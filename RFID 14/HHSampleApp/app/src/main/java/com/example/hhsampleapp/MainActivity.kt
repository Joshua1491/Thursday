package com.example.hhsampleapp

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.hhsampleapp.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private val viewModel: FabricViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupObservers()
        setupClickListeners()
    }

    private fun setupObservers() {
        viewModel.currentFabric.observe(this) { fabric ->
            fabric?.let { updateUIWithFabric(it) }
        }

        viewModel.error.observe(this) { error ->
            error?.let {
                Toast.makeText(this, it, Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun setupClickListeners() {
        binding.btnWriteFabricData.setOnClickListener {
            saveFabricData()
        }

        binding.btnReadFabricData.setOnClickListener {
            val epc = binding.epcTextView.text.toString().replace("Last EPC Read: ", "")
            if (epc != "None") {
                viewModel.loadFabric(epc)
            } else {
                Toast.makeText(this, "No EPC available to read", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun saveFabricData() {
        val epc = binding.epcTextView.text.toString().replace("Last EPC Read: ", "")
        if (epc == "None") {
            Toast.makeText(this, "No EPC available to save", Toast.LENGTH_SHORT).show()
            return
        }

        val fabric = Fabric(
            epc = epc,
            name = binding.etFabricName.text.toString(),
            colour = binding.etColour.text.toString(),
            weight = binding.etWeight.text.toString().toDoubleOrNull() ?: 0.0,
            location = binding.etLocation.text.toString(),
            tagIssuedOn = binding.etIssuedAt.text.toString(),
            rollType = binding.etSku.text.toString()
        )

        viewModel.saveFabric(fabric)
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