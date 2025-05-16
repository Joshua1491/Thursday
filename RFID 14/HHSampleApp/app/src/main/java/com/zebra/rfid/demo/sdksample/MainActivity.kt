package com.zebra.rfid.demo.sdksample

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.zebra.rfid.demo.sdksample.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private val viewModel: FabricViewModel by viewModels()

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        if (permissions.all { it.value }) {
            viewModel.startInventory()
        } else {
            Toast.makeText(this, "Bluetooth permissions required", Toast.LENGTH_SHORT).show()
        }
    }

    private val bluetoothEnableLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            viewModel.startInventory()
        } else {
            Toast.makeText(this, "Bluetooth must be enabled", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupObservers()
        setupClickListeners()
    }

    private fun setupObservers() {
        lifecycleScope.launch {
            viewModel.currentFabric.collect { fabric ->
                fabric?.let { updateUIWithFabric(it) }
            }
        }

        lifecycleScope.launch {
            viewModel.currentEpc.collect { epc ->
                binding.epcTextView.text = "Last EPC Read: ${epc ?: "None"}"
            }
        }
    }

    private fun setupClickListeners() {
        binding.btnStartInventory.setOnClickListener {
            viewModel.startInventory()
        }

        binding.btnStopInventory.setOnClickListener {
            viewModel.stopInventory()
        }

        binding.btnWriteFabricData.setOnClickListener {
            saveFabricData()
        }
    }

    private fun saveFabricData() {
        if (viewModel.currentEpc.value == null) {
            Toast.makeText(this, "No EPC available to save", Toast.LENGTH_SHORT).show()
            return
        }

        viewModel.saveFabric(
            name = binding.etFabricName.text.toString(),
            colour = binding.etColour.text.toString(),
            weight = binding.etWeight.text.toString().toDoubleOrNull() ?: 0.0,
            location = binding.etLocation.text.toString(),
            tagIssuedOn = binding.etIssuedAt.text.toString(),
            rollType = binding.etSku.text.toString()
        )

        Toast.makeText(this, "Fabric data saved", Toast.LENGTH_SHORT).show()
    }

    private fun updateUIWithFabric(fabric: Fabric) {
        binding.apply {
            etFabricName.setText(fabric.name)
            etColour.setText(fabric.colour)
            etWeight.setText(fabric.weight.toString())
            etLocation.setText(fabric.location)
            etIssuedAt.setText(fabric.tagIssuedOn)
            etSku.setText(fabric.rollType)
        }
    }
} 