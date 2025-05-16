package com.zebra.rfid.demo.sdksample

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class FabricViewModel(application: Application) : AndroidViewModel(application) {
    private val fabricRepository: FabricRepository = SharedPrefsFabricRepository(application)
    private val rfidManager: RfidConnectionManager

    private val _currentFabric = MutableStateFlow<Fabric?>(null)
    val currentFabric: StateFlow<Fabric?> = _currentFabric

    private val _currentEpc = MutableStateFlow<String?>(null)
    val currentEpc: StateFlow<String?> = _currentEpc

    init {
        // Initialize RFID manager with activity result launchers
        rfidManager = RfidConnectionManager(
            context = application,
            permissionLauncher = null, // Set these in the Activity
            bluetoothEnableLauncher = null, // Set these in the Activity
            fabricRepository = fabricRepository
        )

        // Observe last scanned EPC
        viewModelScope.launch {
            rfidManager.lastScannedEpc.collect { epc ->
                epc?.let { onEpcScanned(it) }
            }
        }
    }

    private fun onEpcScanned(epc: String) {
        viewModelScope.launch {
            _currentEpc.value = epc
            loadFabric(epc)
        }
    }

    fun loadFabric(epc: String) {
        viewModelScope.launch {
            val fabric = fabricRepository.getFabric(epc)
            _currentFabric.value = fabric
        }
    }

    fun saveFabric(
        name: String,
        colour: String,
        weight: Double,
        location: String,
        tagIssuedOn: String,
        rollType: String
    ) {
        viewModelScope.launch {
            val currentEpc = _currentEpc.value
            if (currentEpc == null) {
                return@launch
            }

            val fabric = Fabric(
                epc = currentEpc,
                name = name,
                colour = colour,
                weight = weight,
                location = location,
                tagIssuedOn = tagIssuedOn,
                rollType = rollType
            )
            fabricRepository.saveFabric(fabric)
            _currentFabric.value = fabric
        }
    }

    fun startInventory() {
        rfidManager.startInventory()
    }

    fun stopInventory() {
        rfidManager.stopInventory()
    }

    override fun onCleared() {
        super.onCleared()
        rfidManager.cleanup()
    }
} 