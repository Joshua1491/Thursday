package com.example.hhsampleapp

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

data class Fabric(
    val epc: String,
    val name: String,
    val colour: String,
    val weight: Double,
    val location: String,
    val tagIssuedOn: String,
    val rollType: String
)

interface FabricRepository {
    fun saveFabric(fabric: Fabric)
    fun getFabric(epc: String): Fabric?
    fun deleteFabric(epc: String)
}

class SharedPrefsFabricRepository(private val context: Context) : FabricRepository {
    private val sharedPreferences = context.getSharedPreferences("fabric_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    override fun saveFabric(fabric: Fabric) {
        val json = gson.toJson(fabric)
        sharedPreferences.edit()
            .putString("fabric_${fabric.epc}", json)
            .apply()
    }

    override fun getFabric(epc: String): Fabric? {
        val json = sharedPreferences.getString("fabric_$epc", null) ?: return null
        return try {
            gson.fromJson(json, Fabric::class.java)
        } catch (e: Exception) {
            null
        }
    }

    override fun deleteFabric(epc: String) {
        sharedPreferences.edit()
            .remove("fabric_$epc")
            .apply()
    }
} 