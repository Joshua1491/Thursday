package com.zebra.rfid.demo.sdksample.api;

import com.zebra.rfid.demo.sdksample.model.FabricTagData;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {
    @POST("fabric")
    Call<FabricTagData> saveFabric(@Body FabricTagData fabric);

    @GET("fabric/{epc}")
    Call<FabricTagData> getFabric(@Path("epc") String epc);
} 