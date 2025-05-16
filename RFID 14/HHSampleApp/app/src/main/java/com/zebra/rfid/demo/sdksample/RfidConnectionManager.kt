package com.zebra.rfid.demo.sdksample

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothGattService
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.activity.result.ActivityResultLauncher
import androidx.core.app.ActivityCompat
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.util.UUID

class RfidConnectionManager(
    private val context: Context,
    private val permissionLauncher: ActivityResultLauncher<Array<String>>,
    private val bluetoothEnableLauncher: ActivityResultLauncher<Intent>,
    private val fabricRepository: FabricRepository
) {
    companion object {
        private const val TAG = "RfidConnectionManager"
        
        // Zebra RFD4031 specific UUIDs
        private val ZEBRA_SERVICE_UUID = UUID.fromString("0000FFE0-0000-1000-8000-00805F9B34FB")
        private val ZEBRA_CHARACTERISTIC_UUID = UUID.fromString("0000FFE1-0000-1000-8000-00805F9B34FB")
        
        // Permission request codes
        private const val PERMISSION_REQUEST_CODE = 100
    }

    private val bluetoothManager: BluetoothManager by lazy {
        context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    }
    private val bluetoothAdapter: BluetoothAdapter? by lazy {
        bluetoothManager.adapter
    }
    private val bluetoothLeScanner: BluetoothLeScanner? by lazy {
        bluetoothAdapter?.bluetoothLeScanner
    }

    private var bluetoothGatt: BluetoothGatt? = null
    private var isScanning = false

    // Connection state
    private val _isConnected = MutableStateFlow(false)
    val isConnected: StateFlow<Boolean> = _isConnected

    private val _lastScannedEpc = MutableStateFlow<String?>(null)
    val lastScannedEpc: StateFlow<String?> = _lastScannedEpc

    // GATT callback
    private val gattCallback = object : BluetoothGattCallback() {
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            when (newState) {
                BluetoothProfile.STATE_CONNECTED -> {
                    Log.i(TAG, "Connected to GATT server")
                    _isConnected.value = true
                    gatt.discoverServices()
                }
                BluetoothProfile.STATE_DISCONNECTED -> {
                    Log.i(TAG, "Disconnected from GATT server")
                    _isConnected.value = false
                    cleanup()
                }
            }
        }

        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            when (status) {
                BluetoothGatt.GATT_SUCCESS -> {
                    Log.i(TAG, "Services discovered")
                    // Find the Zebra service and characteristic
                    val service = gatt.getService(ZEBRA_SERVICE_UUID)
                    val characteristic = service?.getCharacteristic(ZEBRA_CHARACTERISTIC_UUID)
                    if (characteristic != null) {
                        // Enable notifications for tag reads
                        gatt.setCharacteristicNotification(characteristic, true)
                    }
                }
                else -> {
                    Log.e(TAG, "Service discovery failed with status: $status")
                }
            }
        }

        override fun onCharacteristicChanged(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic
        ) {
            // Handle incoming tag data
            val data = characteristic.value
            if (data.isNotEmpty()) {
                // Parse EPC from the data
                val epc = parseEpcFromData(data)
                if (epc != null) {
                    _lastScannedEpc.value = epc
                    // Look up fabric data
                    val fabric = fabricRepository.getFabric(epc)
                    if (fabric != null) {
                        Log.d(TAG, "Found existing fabric data for EPC: $epc")
                    } else {
                        Log.d(TAG, "New EPC scanned: $epc")
                    }
                }
            }
        }
    }

    private fun parseEpcFromData(data: ByteArray): String? {
        try {
            // Convert bytes to hex string
            val hexString = data.joinToString("") { "%02X".format(it) }
            // Extract EPC from the data (adjust parsing logic based on your tag format)
            return hexString.take(24) // Assuming 12-byte EPC
        } catch (e: Exception) {
            Log.e(TAG, "Failed to parse EPC from data: ${e.message}")
            return null
        }
    }

    // Scan callback
    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val device = result.device
            if (isZebraDevice(device)) {
                stopScan()
                connectToDevice(device)
            }
        }

        override fun onScanFailed(errorCode: Int) {
            Log.e(TAG, "Scan failed with error: $errorCode")
            isScanning = false
        }
    }

    fun checkPermissionsAndConnect() {
        when {
            !hasRequiredPermissions() -> {
                requestPermissions()
            }
            !isBluetoothEnabled() -> {
                requestBluetoothEnable()
            }
            else -> {
                startScan()
            }
        }
    }

    private fun hasRequiredPermissions(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED
        } else {
            ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH) == PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_ADMIN) == PackageManager.PERMISSION_GRANTED
        }
    }

    private fun requestPermissions() {
        val permissions = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            arrayOf(
                Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.BLUETOOTH_SCAN
            )
        } else {
            arrayOf(
                Manifest.permission.BLUETOOTH,
                Manifest.permission.BLUETOOTH_ADMIN
            )
        }
        permissionLauncher.launch(permissions)
    }

    private fun isBluetoothEnabled(): Boolean {
        return bluetoothAdapter?.isEnabled == true
    }

    private fun requestBluetoothEnable() {
        val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
        bluetoothEnableLauncher.launch(enableBtIntent)
    }

    private fun startScan() {
        if (isScanning) return

        val filters = listOf<ScanFilter>()
        val settings = ScanSettings.Builder()
            .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
            .build()

        try {
            bluetoothLeScanner?.startScan(filters, settings, scanCallback)
            isScanning = true
            Log.d(TAG, "Started scanning for devices")
        } catch (e: SecurityException) {
            Log.e(TAG, "Failed to start scan: ${e.message}")
        }
    }

    private fun stopScan() {
        if (!isScanning) return

        try {
            bluetoothLeScanner?.stopScan(scanCallback)
            isScanning = false
            Log.d(TAG, "Stopped scanning")
        } catch (e: SecurityException) {
            Log.e(TAG, "Failed to stop scan: ${e.message}")
        }
    }

    private fun isZebraDevice(device: BluetoothDevice): Boolean {
        return device.name?.contains("RFD4031", ignoreCase = true) == true
    }

    private fun connectToDevice(device: BluetoothDevice) {
        try {
            bluetoothGatt = device.connectGatt(context, false, gattCallback)
            Log.d(TAG, "Connecting to device: ${device.name}")
        } catch (e: SecurityException) {
            Log.e(TAG, "Failed to connect to device: ${e.message}")
        }
    }

    fun cleanup() {
        bluetoothGatt?.let { gatt ->
            try {
                gatt.disconnect()
                gatt.close()
            } catch (e: SecurityException) {
                Log.e(TAG, "Failed to cleanup GATT: ${e.message}")
            }
        }
        bluetoothGatt = null
        _isConnected.value = false
    }

    fun startInventory() {
        if (!_isConnected.value) {
            Log.e(TAG, "Cannot start inventory: not connected")
            return
        }
        // Send inventory start command to reader
        sendInventoryCommand(true)
    }

    fun stopInventory() {
        if (!_isConnected.value) {
            Log.e(TAG, "Cannot stop inventory: not connected")
            return
        }
        // Send inventory stop command to reader
        sendInventoryCommand(false)
    }

    private fun sendInventoryCommand(start: Boolean) {
        val command = if (start) {
            // Command to start inventory (adjust based on your reader's protocol)
            byteArrayOf(0x02, 0x49, 0x4E, 0x56, 0x45, 0x4E, 0x54, 0x0D)
        } else {
            // Command to stop inventory
            byteArrayOf(0x02, 0x53, 0x54, 0x4F, 0x50, 0x0D)
        }
        
        try {
            val service = bluetoothGatt?.getService(ZEBRA_SERVICE_UUID)
            val characteristic = service?.getCharacteristic(ZEBRA_CHARACTERISTIC_UUID)
            characteristic?.let {
                it.value = command
                bluetoothGatt?.writeCharacteristic(it)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to send inventory command: ${e.message}")
        }
    }
} 