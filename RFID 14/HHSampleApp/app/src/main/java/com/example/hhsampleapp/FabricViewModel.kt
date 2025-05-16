package com.example.hhsampleapp

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class FabricViewModel(application: Application) : AndroidViewModel(application) {
    // Using SharedPrefsFabricRepository for now, can be swapped with RemoteFabricRepository later
    private val repository: FabricRepository = SharedPrefsFabricRepository(application)
    
    private val _currentFabric = MutableLiveData<Fabric?>()
    val currentFabric: LiveData<Fabric?> = _currentFabric
    
    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error
    
    fun saveFabric(fabric: Fabric) {
        viewModelScope.launch {
            try {
                withContext(Dispatchers.IO) {
                    repository.saveFabric(fabric)
                }
                _currentFabric.value = fabric
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to save fabric: ${e.message}"
            }
        }
    }
    
    fun loadFabric(epc: String) {
        viewModelScope.launch {
            try {
                val fabric = withContext(Dispatchers.IO) {
                    repository.getFabric(epc)
                }
                _currentFabric.value = fabric
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to load fabric: ${e.message}"
            }
        }
    }
    
    fun deleteFabric(epc: String) {
        viewModelScope.launch {
            try {
                withContext(Dispatchers.IO) {
                    repository.deleteFabric(epc)
                }
                _currentFabric.value = null
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to delete fabric: ${e.message}"
            }
        }
    }
} 