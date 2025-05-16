package com.zebra.rfid.demo.sdksample;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.TextView;

import com.zebra.rfid.api3.TagData;
import com.zebra.rfid.demo.sdksample.model.FabricTagData;
import com.zebra.scannercontrol.SDKHandler;
import com.zebra.rfid.demo.sdksample.repository.FabricRepository;
import com.zebra.rfid.demo.sdksample.api.RetrofitClient;
import com.zebra.rfid.demo.sdksample.api.ApiService;
import com.zebra.rfid.demo.sdksample.model.Fabric;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Sample app to connect to the reader,to do inventory and basic barcode scan
 * We can also set antenna settings and singulation control
 * */

public class MainActivity extends AppCompatActivity implements RFIDHandler.ResponseHandlerInterface {
    private static final int PERMISSION_REQUEST_CODE = 1;
    private RFIDHandler rfidHandler;
    private String lastEPCRead = "";
    private EditText etFabricName, etColour, etWeight, etLocation, etIssuedAt, etSku;
    private TextView epcTextView, textViewStatusrfid;
    private Button btnStartInventory, btnStopInventory, btnWriteFabricData;
    final static String TAG = "RFID_SAMPLE";
    public static SDKHandler sdkHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeViews();
        setupRFIDHandler();
        checkPermissions();
    }

    private void initializeViews() {
        etFabricName = findViewById(R.id.etFabricName);
        etColour = findViewById(R.id.etColour);
        etWeight = findViewById(R.id.etWeight);
        etLocation = findViewById(R.id.etLocation);
        etIssuedAt = findViewById(R.id.etIssuedAt);
        etSku = findViewById(R.id.etSku);
        epcTextView = findViewById(R.id.epcTextView);
        textViewStatusrfid = findViewById(R.id.textViewStatusrfid);
        btnStartInventory = findViewById(R.id.btnStartInventory);
        btnStopInventory = findViewById(R.id.btnStopInventory);
        btnWriteFabricData = findViewById(R.id.btnWriteFabricData);

        btnStartInventory.setOnClickListener(v -> startInventory());
        btnStopInventory.setOnClickListener(v -> stopInventory());
        btnWriteFabricData.setOnClickListener(v -> saveFabricData());
    }

    private void setupRFIDHandler() {
        rfidHandler = new RFIDHandler(this);
    }

    private void checkPermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    PERMISSION_REQUEST_CODE);
        } else {
            enableBluetooth();
        }
    }

    private void enableBluetooth() {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter != null && !bluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBtIntent, 1);
        } else {
            connectRFID();
        }
    }

    private void connectRFID() {
        rfidHandler.connect();
    }

    public void startInventory() {
        if (rfidHandler != null) {
            rfidHandler.performInventory();
        }
    }

    public void stopInventory() {
        if (rfidHandler != null) {
            rfidHandler.stopInventory();
        }
    }

    @Override
    public void handleTagdata(TagData[] tagData) {
        StringBuilder sb = new StringBuilder();
        for (TagData tag : tagData) {
            sb.append(tag.getTagID()).append(" , ").append(tag.getPeakRSSI()).append("\n");
        }
        runOnUiThread(() -> {
            TextView textrfid = findViewById(R.id.edittextrfid);
            textrfid.append(sb.toString());
        });
    }

    @Override
    public void handleTriggerPress(boolean pressed) {
        if (pressed) {
            runOnUiThread(() -> {
                TextView textrfid = findViewById(R.id.edittextrfid);
                textrfid.setText("");
            });
            rfidHandler.performInventory();
        } else {
            rfidHandler.stopInventory();
        }
    }

    @Override
    public void barcodeData(String val) {
        runOnUiThread(() -> {
            TextView scanResult = findViewById(R.id.scanResult);
            scanResult.setText("Scan Result : " + val);
        });
    }

    @Override
    public void sendToast(String val) {
        runOnUiThread(() -> Toast.makeText(MainActivity.this, val, Toast.LENGTH_SHORT).show());
    }

    @Override
    public void onTagRead(String epc) {
        lastEPCRead = epc;
        runOnUiThread(() -> {
            epcTextView.setText("Last EPC Read: " + epc);
            // Load fabric data if exists
            Fabric fabric = FabricRepository.getInstance(this).getFabric(epc);
            if (fabric != null) {
                populateForm(fabric);
            } else {
                // Clear form if no fabric data exists
                clearForm();
            }
        });
    }

    private void clearForm() {
        etFabricName.setText("");
        etColour.setText("");
        etWeight.setText("");
        etLocation.setText("");
        etIssuedAt.setText("");
        etSku.setText("");
    }

    private void populateForm(Fabric fabric) {
        etFabricName.setText(fabric.getName());
        etColour.setText(fabric.getColour());
        etWeight.setText(String.valueOf(fabric.getWeight()));
        etLocation.setText(fabric.getLocation());
        etIssuedAt.setText(fabric.getTagIssuedOn());
        etSku.setText(fabric.getRollType());
    }

    public void saveFabricData() {
        if (lastEPCRead.isEmpty()) {
            Toast.makeText(this, "No EPC available to save", Toast.LENGTH_SHORT).show();
            return;
        }

        try {
            Fabric fabric = new Fabric(
                lastEPCRead,
                etFabricName.getText().toString(),
                etColour.getText().toString(),
                Double.parseDouble(etWeight.getText().toString()),
                etLocation.getText().toString(),
                etIssuedAt.getText().toString(),
                etSku.getText().toString()
            );

            FabricRepository.getInstance(this).saveFabric(fabric);
            Toast.makeText(this, "Fabric data saved", Toast.LENGTH_SHORT).show();
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Invalid weight value", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (rfidHandler != null) {
            rfidHandler.dispose();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.antenna_settings) {
            String result = rfidHandler.Test1();
            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
            return true;
        }
        if (id == R.id.Singulation_control) {
            String result = rfidHandler.Test2();
            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
            return true;
        }
        if (id == R.id.Default) {
            String result = rfidHandler.Defaults();
            Toast.makeText(this,result,Toast.LENGTH_SHORT).show();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onPause() {
        super.onPause();
        //rfidHandler.onPause();
    }

    @Override
    protected void onPostResume() {
        super.onPostResume();
        String result = rfidHandler.onResume();
        Log.e(TAG, "onPostResume: "+result);
        //statusTextViewRFID.setText(result);
    }
}
