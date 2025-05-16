package com.zebra.rfid.demo.sdksample.repository;

import android.content.Context;
import android.content.SharedPreferences;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.zebra.rfid.demo.sdksample.model.Fabric;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class FabricRepository {
    private static final String PREF_NAME = "fabric_data";
    private static final String KEY_FABRICS = "fabrics";
    private static FabricRepository instance;
    private final SharedPreferences preferences;
    private final Gson gson;

    private FabricRepository(Context context) {
        preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        gson = new Gson();
    }

    public static synchronized FabricRepository getInstance(Context context) {
        if (instance == null) {
            instance = new FabricRepository(context.getApplicationContext());
        }
        return instance;
    }

    public void saveFabric(Fabric fabric) {
        List<Fabric> fabrics = getAllFabrics();
        // Remove existing fabric with same EPC if exists
        fabrics.removeIf(f -> f.getEpc().equals(fabric.getEpc()));
        fabrics.add(fabric);
        saveFabrics(fabrics);
    }

    public Fabric getFabric(String epc) {
        List<Fabric> fabrics = getAllFabrics();
        for (Fabric fabric : fabrics) {
            if (fabric.getEpc().equals(epc)) {
                return fabric;
            }
        }
        return null;
    }

    public List<Fabric> getAllFabrics() {
        String json = preferences.getString(KEY_FABRICS, null);
        if (json == null) {
            return new ArrayList<>();
        }
        Type type = new TypeToken<List<Fabric>>(){}.getType();
        return gson.fromJson(json, type);
    }

    private void saveFabrics(List<Fabric> fabrics) {
        String json = gson.toJson(fabrics);
        preferences.edit().putString(KEY_FABRICS, json).apply();
    }

    public String generateShortCode(String epc) {
        if (epc == null || epc.length() < 8) return epc != null ? epc.toUpperCase() : null;
        return epc.substring(epc.length() - 8).toUpperCase();
    }
} 