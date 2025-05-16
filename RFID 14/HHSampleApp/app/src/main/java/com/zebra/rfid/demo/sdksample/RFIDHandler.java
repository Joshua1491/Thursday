package com.zebra.rfid.demo.sdksample;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.TextView;

import com.zebra.rfid.api3.Antennas;
import com.zebra.rfid.api3.ENUM_TRANSPORT;
import com.zebra.rfid.api3.ENUM_TRIGGER_MODE;
import com.zebra.rfid.api3.FILTER_ACTION;
import com.zebra.rfid.api3.HANDHELD_TRIGGER_EVENT_TYPE;
import com.zebra.rfid.api3.INVENTORY_STATE;
import com.zebra.rfid.api3.IRFIDLogger;
import com.zebra.rfid.api3.InvalidUsageException;
import com.zebra.rfid.api3.LOCK_DATA_FIELD;
import com.zebra.rfid.api3.LOCK_PRIVILEGE;
import com.zebra.rfid.api3.MEMORY_BANK;
import com.zebra.rfid.api3.OperationFailureException;
import com.zebra.rfid.api3.PreFilters;
import com.zebra.rfid.api3.RFIDReader;
import com.zebra.rfid.api3.ReaderDevice;
import com.zebra.rfid.api3.Readers;
import com.zebra.rfid.api3.RfidEventsListener;
import com.zebra.rfid.api3.RfidReadEvents;
import com.zebra.rfid.api3.RfidStatusEvents;
import com.zebra.rfid.api3.SESSION;
import com.zebra.rfid.api3.SL_FLAG;
import com.zebra.rfid.api3.START_TRIGGER_TYPE;
import com.zebra.rfid.api3.STATE_AWARE_ACTION;
import com.zebra.rfid.api3.STATUS_EVENT_TYPE;
import com.zebra.rfid.api3.STOP_TRIGGER_TYPE;
import com.zebra.rfid.api3.TARGET;
import com.zebra.rfid.api3.TRUNCATE_ACTION;
import com.zebra.rfid.api3.TagAccess;
import com.zebra.rfid.api3.TagData;
import com.zebra.rfid.api3.TriggerInfo;
import com.zebra.scannercontrol.DCSSDKDefs;
import com.zebra.scannercontrol.DCSScannerInfo;
import com.zebra.scannercontrol.FirmwareUpdateEvent;
import com.zebra.scannercontrol.IDcsSdkApiDelegate;
import com.zebra.scannercontrol.SDKHandler;
import com.zebra.rfid.demo.sdksample.api.RetrofitClient;
import com.zebra.rfid.demo.sdksample.model.Fabric;

import java.util.ArrayList;
import java.nio.charset.StandardCharsets;

public class RFIDHandler implements IDcsSdkApiDelegate, Readers.RFIDReaderEventHandler, RfidEventsListener {

    final static String TAG = "RFID_SAMPLE";
    private Readers readers;
    private ArrayList<ReaderDevice> availableRFIDReaderList;
    private ReaderDevice readerDevice;
    private RFIDReader reader;
    private TextView textView;
    private MainActivity context;
    private SDKHandler sdkHandler;
    private ArrayList<DCSScannerInfo> scannerList;
    private int scannerID;
    static MyAsyncTask cmdExecTask = null;
    private int MAX_POWER = 270;
    private int DEVICE_STD_MODE = 0;
    private int DEVICE_PREMIUM_PLUS_MODE = 1;

    // In case of RFD8500 change reader name with intended device below from list of paired RFD8500
    // If barcode scan is available in RFD8500, for barcode scanning change mode using mode button on RFD8500 device. By default it is set to RFID mode
    String readerNamebt = "RFD40+_211545201D0011";
    String readerName = "RFD4031-G10B700-US";
    String RFD8500 = "RFD8500161755230D5038";

    private Handler mainHandler;
    private String lastEPCRead = "";
    private boolean isConnected = false;
    private boolean isInventoryRunning = false;

    public RFIDHandler(MainActivity activity) {
        this.context = activity;
        this.textView = activity.findViewById(R.id.textViewStatusrfid);
        this.mainHandler = new Handler(Looper.getMainLooper());
        this.scannerList = new ArrayList<>();
        InitSDK();
    }

    @Override
    public void dcssdkEventScannerAppeared(DCSScannerInfo dcsScannerInfo) {

    }

    @Override
    public void dcssdkEventScannerDisappeared(int i) {

    }

    @Override
    public void dcssdkEventCommunicationSessionEstablished(DCSScannerInfo dcsScannerInfo) {

    }

    @Override
    public void dcssdkEventCommunicationSessionTerminated(int i) {

    }

    @Override
    public void dcssdkEventBarcode(byte[] barcodeData, int barcodeType, int fromScannerID) {
        String s = new String(barcodeData);
        context.barcodeData(s);
        Log.d(TAG,"barcaode ="+ s);
    }

    @Override
    public void dcssdkEventImage(byte[] bytes, int i) {

    }

    @Override
    public void dcssdkEventVideo(byte[] bytes, int i) {

    }

    @Override
    public void dcssdkEventBinaryData(byte[] bytes, int i) {

    }

    @Override
    public void dcssdkEventFirmwareUpdate(FirmwareUpdateEvent firmwareUpdateEvent) {

    }

    @Override
    public void dcssdkEventAuxScannerAppeared(DCSScannerInfo dcsScannerInfo, DCSScannerInfo dcsScannerInfo1) {

    }



// TEST BUTTON functionality
    // following two tests are to try out different configurations features

    public String Test1() {
        // check reader connection
        if (!isReaderConnected())
            return "Not connected";
        // set antenna configurations - reducing power to 200
        try {
            Antennas.AntennaRfConfig config = null;
            config = reader.Config.Antennas.getAntennaRfConfig(1);
            config.setTransmitPowerIndex(100);
            config.setrfModeTableIndex(0);
            config.setTari(0);
            reader.Config.Antennas.setAntennaRfConfig(1, config);
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
            return e.getResults().toString() + " " + e.getVendorMessage();
        }
        return "Antenna power Set to 220";
    }

    public String Test2() {
        // check reader connection
        if (!isReaderConnected())
            return "Not connected";
        // Set the singulation control to S2 which will read each tag once only
        try {
            Antennas.SingulationControl s1_singulationControl = reader.Config.Antennas.getSingulationControl(1);
            s1_singulationControl.setSession(SESSION.SESSION_S2);
            s1_singulationControl.Action.setInventoryState(INVENTORY_STATE.INVENTORY_STATE_A);
            s1_singulationControl.Action.setSLFlag(SL_FLAG.SL_ALL);
            reader.Config.Antennas.setSingulationControl(1, s1_singulationControl);
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
            return e.getResults().toString() + " " + e.getVendorMessage();
        }
        return "Session set to S2";
    }

    public String Defaults() {
        // check reader connection
        if (!isReaderConnected())
            return "Not connected";;
        try {
            // Power to 270
            Antennas.AntennaRfConfig config = null;
            config = reader.Config.Antennas.getAntennaRfConfig(1);
            config.setTransmitPowerIndex(MAX_POWER);
            config.setrfModeTableIndex(0);
            config.setTari(0);
            reader.Config.Antennas.setAntennaRfConfig(1, config);
            // singulation to S0
            Antennas.SingulationControl s1_singulationControl = reader.Config.Antennas.getSingulationControl(1);
            s1_singulationControl.setSession(SESSION.SESSION_S0);
            s1_singulationControl.Action.setInventoryState(INVENTORY_STATE.INVENTORY_STATE_A);
            s1_singulationControl.Action.setSLFlag(SL_FLAG.SL_ALL);
            reader.Config.Antennas.setSingulationControl(1, s1_singulationControl);
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
            return e.getResults().toString() + " " + e.getVendorMessage();
        }
        return "Default settings applied";
    }

    private boolean isReaderConnected() {
        if (reader != null && reader.isConnected())
            return true;
        else {
            Log.d(TAG, "reader is not connected");
            return false;
        }
    }

    //
    //  Activity life cycle behavior
    //

    String onResume() {
        return connect();
    }

    void onPause() {
        disconnect();
    }

     void onDestroy() {
        dispose();
    }

    //
    // RFID SDK
    //
    private void InitSDK() {
        Log.d(TAG, "InitSDK");
        if (readers == null) {
            new CreateInstanceTask().execute();
        } else
            connectReader();
    }

    public void testFunction() {
        setPreFilters();
        //testReadevent();
    }

    private void testReadevent() {
        TagAccess tagAccess = new TagAccess();
        TagAccess.LockAccessParams lockAccessParams =  tagAccess.new LockAccessParams();
        lockAccessParams.setLockPrivilege(LOCK_DATA_FIELD.LOCK_USER_MEMORY, LOCK_PRIVILEGE.LOCK_PRIVILEGE_READ_WRITE);
        lockAccessParams.setAccessPassword(Long.decode("0X" + "12341234"));
        try {
            reader.Actions.TagAccess.lockEvent(lockAccessParams,null,null);
        } catch (InvalidUsageException e) {
            throw new RuntimeException(e);
        } catch (OperationFailureException e) {
            throw new RuntimeException(e);
        }
    }

    public void setPreFilters() {
        Log.d("setPrefilter", "setPrefilter...");
        PreFilters.PreFilter[] preFilterArray = new PreFilters.PreFilter[4];

        PreFilters filters = new PreFilters();
        PreFilters.PreFilter filter = filters.new PreFilter();
        filter.setAntennaID((short) 1);// Set this filter for Antenna ID 1
        filter.setTagPattern("000000000000000000000282");// Tags which starts with passed pattern
        filter.setTagPatternBitCount(96);
        filter.setBitOffset(32); // skip PC bits (always it should be in bit length)
        filter.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE); // use state aware singulation
        filter.StateAwareAction.setTarget(TARGET.TARGET_SL); // inventoried flag of session S1 of matching tags to B
        filter.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[0] = filter;

        PreFilters filters1 = new PreFilters();
        PreFilters.PreFilter filter1 = filters1.new PreFilter();
        filter1.setAntennaID((short) 1);// Set this filter for Antenna ID 1
        filter1.setTagPattern("010000000000000000000296");// Tags which starts with passed pattern
        filter1.setTagPatternBitCount(96);
        filter1.setBitOffset(32); // skip PC bits (always it should be in bit length)
        filter1.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter1.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE); // use state aware singulation
        filter1.StateAwareAction.setTarget(TARGET.TARGET_SL); // inventoried flag of session S1 of matching tags to B
        filter1.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter1.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[1] = filter1;

        PreFilters filters2 = new PreFilters();
        PreFilters.PreFilter filter2 = filters2.new PreFilter();
        filter2.setAntennaID((short) 1);// Set this filter for Antenna ID 1
        filter2.setTagPattern("101010101010444455556666");// Tags which starts with passed pattern
        filter2.setTagPatternBitCount(96);
        filter2.setBitOffset(32); // skip PC bits (always it should be in bit length)
        filter2.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter2.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE); // use state aware singulation
        filter2.StateAwareAction.setTarget(TARGET.TARGET_SL); // inventoried flag of session S1 of matching tags to B
        filter2.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter2.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[2] = filter2;

        PreFilters filters3 = new PreFilters();
        PreFilters.PreFilter filter3 = filters3.new PreFilter();
        filter3.setAntennaID((short) 1);// Set this filter for Antenna ID 1
        filter3.setTagPattern("03000000000000000000029A");// Tags which starts with passed pattern
        filter3.setTagPatternBitCount(96);
        filter3.setBitOffset(32); // skip PC bits (always it should be in bit length)
        filter3.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
        filter3.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE); // use state aware singulation
        filter3.StateAwareAction.setTarget(TARGET.TARGET_SL); // inventoried flag of session S1 of matching tags to B
        filter3.StateAwareAction.setStateAwareAction(STATE_AWARE_ACTION.STATE_AWARE_ACTION_ASRT_SL);
        filter3.setTruncateAction(TRUNCATE_ACTION.TRUNCATE_ACTION_DO_NOT_TRUNCATE);
        preFilterArray[3] = filter3;

        try {
            Log.d("setSingulationControl", "SingulationControl...");

            Antennas.SingulationControl singulationControl = new Antennas.SingulationControl();
            //singulationControl // mRfidReader.Config.Antennas.getSingulationControl(1);

            singulationControl.setSession(SESSION.SESSION_S2);
            singulationControl.setTagPopulation((short) 32);
            singulationControl.Action.setSLFlag(SL_FLAG.SL_FLAG_ASSERTED);
            singulationControl.Action.setInventoryState(INVENTORY_STATE.INVENTORY_STATE_AB_FLIP);
            // mRfidReader.Config.Antennas.setSingulationControl(1, singulationControl);
            reader.Actions.PreFilters.deleteAll();
            reader.Actions.PreFilters.add(preFilterArray, null);
            reader.Config.setUniqueTagReport(true);
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
        }

    }

    // Enumerates SDK based on host device
    private class CreateInstanceTask extends AsyncTask<Void, Void, Void> {
        private InvalidUsageException invalidUsageException = null;
        @Override
        protected Void doInBackground(Void... voids) {
            Log.d(TAG, "CreateInstanceTask");
            try {
                readers = new Readers(context, ENUM_TRANSPORT.SERVICE_USB);
                availableRFIDReaderList = readers.GetAvailableRFIDReaderList();
                if(availableRFIDReaderList.isEmpty()) {
                    Log.d(TAG, "Reader not available in SERVICE_USB Transport trying with BLUETOOTH transport");
                    readers.setTransport(ENUM_TRANSPORT.BLUETOOTH);
                    availableRFIDReaderList = readers.GetAvailableRFIDReaderList();
                }
                if(availableRFIDReaderList.isEmpty()) {
                    Log.d(TAG, "Reader not available in BLUETOOTH Transport trying with SERVICE_SERIAL transport");
                    readers.setTransport(ENUM_TRANSPORT.SERVICE_SERIAL);
                    availableRFIDReaderList = readers.GetAvailableRFIDReaderList();
                }
                if(availableRFIDReaderList.isEmpty()) {
                    Log.d(TAG, "Reader not available in SERVICE_SERIAL Transport trying with RE_SERIAL transport");
                    readers.setTransport(ENUM_TRANSPORT.RE_SERIAL);
                    availableRFIDReaderList = readers.GetAvailableRFIDReaderList();
                }
            } catch (InvalidUsageException e) {
                invalidUsageException = e;
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            super.onPostExecute(aVoid);
            if (invalidUsageException != null) {
                context.sendToast("Failed to get Available Readers\n"+invalidUsageException.getInfo());
                readers = null;
            } else if (availableRFIDReaderList.isEmpty()) {
                context.sendToast("No Available Readers to proceed");
                readers = null;
            } else {
                connectReader();
            }
        }
    }

    private synchronized void connectReader(){
        if(!isReaderConnected()){
            new ConnectionTask().execute();
        }
    }

    private class ConnectionTask extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... voids) {
            Log.d(TAG, "ConnectionTask");
            GetAvailableReader();
            if (reader != null)
                return connect();
            return "Failed to find or connect reader";
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            textView.setText(result);
        }
    }

    private synchronized void GetAvailableReader() {
        Log.d(TAG, "GetAvailableReader");
        if (readers != null) {
            readers.attach(this);
            try {
                ArrayList<ReaderDevice> availableReaders = readers.GetAvailableRFIDReaderList();
                if (availableReaders != null && !availableReaders.isEmpty()) {
                    availableRFIDReaderList = availableReaders;
                    // if single reader is available then connect it
                    Log.e(TAG,"Available readers to connect = "+availableRFIDReaderList.size());
                    if (availableRFIDReaderList.size() == 1) {
                        readerDevice = availableRFIDReaderList.get(0);
                        reader = readerDevice.getRFIDReader();
                    } else {
                        // search reader specified by name
                        for (ReaderDevice device : availableRFIDReaderList) {
                            Log.d(TAG,"device: "+device.getName());
                            if (device.getName().startsWith(readerName)) {

                                readerDevice = device;
                                reader = readerDevice.getRFIDReader();

                            }
                        }
                    }
                }
            }catch (InvalidUsageException ie){
                ie.printStackTrace();
            }

        }
    }

    // handler for receiving reader appearance events
    @Override
    public void RFIDReaderAppeared(ReaderDevice readerDevice) {
        Log.d(TAG, "RFIDReaderAppeared " + readerDevice.getName());
        context.sendToast("RFIDReaderAppeared");
        connectReader();
    }

    @Override
    public void RFIDReaderDisappeared(ReaderDevice readerDevice) {
        Log.d(TAG, "RFIDReaderDisappeared " + readerDevice.getName());
        context.sendToast("RFIDReaderDisappeared");
        if (readerDevice.getName().equals(reader.getHostName()))
            disconnect();
    }


    public synchronized String connect() {
        if (reader != null) {
            Log.d(TAG, "connect " + reader.getHostName());
            try {
                if (!reader.isConnected()) {
                    // Establish connection to the RFID Reader
                    reader.connect();
                    ConfigureReader();

                    //Call this function if the readerdevice supports scanner to setup scanner SDK
                    //setupScannerSDK();
                    if(reader.isConnected()){
                        isConnected = true;
                        return "Connected: " + reader.getHostName();
                    }

                }
            } catch (InvalidUsageException e) {
                e.printStackTrace();
            } catch (OperationFailureException e) {
                e.printStackTrace();
                Log.d(TAG, "OperationFailureException " + e.getVendorMessage());
                String des = e.getResults().toString();
                return "Connection failed" + e.getVendorMessage() + " " + des;
            }
        }
        return "";
    }

    private void ConfigureReader() {
        Log.d(TAG, "ConfigureReader " + reader.getHostName());
        IRFIDLogger.getLogger("SDKSAmpleApp").EnableDebugLogs(true);
        if (reader.isConnected()) {
            TriggerInfo triggerInfo = new TriggerInfo();
            triggerInfo.StartTrigger.setTriggerType(START_TRIGGER_TYPE.START_TRIGGER_TYPE_IMMEDIATE);
            triggerInfo.StopTrigger.setTriggerType(STOP_TRIGGER_TYPE.STOP_TRIGGER_TYPE_IMMEDIATE);
            try {
                // receive events from reader
                reader.Events.addEventsListener(this);
                // HH event
                reader.Events.setHandheldEvent(true);
                // tag event with tag data
                reader.Events.setTagReadEvent(true);
                reader.Events.setAttachTagDataWithReadEvent(false);
                // set trigger mode as rfid so scanner beam will not come
                reader.Config.setTriggerMode(ENUM_TRIGGER_MODE.RFID_MODE, true);
                // set start and stop triggers
                reader.Config.setStartTrigger(triggerInfo.StartTrigger);
                reader.Config.setStopTrigger(triggerInfo.StopTrigger);
                // power levels are index based so maximum power supported get the last one
                MAX_POWER = reader.ReaderCapabilities.getTransmitPowerLevelValues().length - 1;
                // set antenna configurations
                Antennas.AntennaRfConfig config = reader.Config.Antennas.getAntennaRfConfig(1);
                config.setTransmitPowerIndex(MAX_POWER);
                config.setrfModeTableIndex(0);
                config.setTari(0);
                reader.Config.Antennas.setAntennaRfConfig(1, config);
                // Set the singulation control
                Antennas.SingulationControl s1_singulationControl = reader.Config.Antennas.getSingulationControl(1);
                s1_singulationControl.setSession(SESSION.SESSION_S0);
                s1_singulationControl.Action.setInventoryState(INVENTORY_STATE.INVENTORY_STATE_A);
                s1_singulationControl.Action.setSLFlag(SL_FLAG.SL_ALL);
                reader.Config.Antennas.setSingulationControl(1, s1_singulationControl);
                // delete any prefilters
                reader.Actions.PreFilters.deleteAll();
                // Set a longer timeout for write operation (5 seconds)
                reader.Config.setAccessOperationWaitTimeout(5000);
            } catch (InvalidUsageException | OperationFailureException e) {
                e.printStackTrace();
            }
        }
    }


    public void setupScannerSDK(){
        if (sdkHandler == null)
        {
            sdkHandler = new SDKHandler(context);
            //For cdc device
            DCSSDKDefs.DCSSDK_RESULT result = sdkHandler.dcssdkSetOperationalMode(DCSSDKDefs.DCSSDK_MODE.DCSSDK_OPMODE_USB_CDC);

            //For bluetooth device
           DCSSDKDefs.DCSSDK_RESULT btResult = sdkHandler.dcssdkSetOperationalMode(DCSSDKDefs.DCSSDK_MODE.DCSSDK_OPMODE_BT_LE);
            DCSSDKDefs.DCSSDK_RESULT btNormalResult = sdkHandler.dcssdkSetOperationalMode(DCSSDKDefs.DCSSDK_MODE.DCSSDK_OPMODE_BT_NORMAL);

            Log.d(TAG,btNormalResult+ " results "+ btResult);
            sdkHandler.dcssdkSetDelegate(this);

            int notifications_mask = 0;
            // We would like to subscribe to all scanner available/not-available events
            notifications_mask |= DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SCANNER_APPEARANCE.value | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SCANNER_DISAPPEARANCE.value;

            // We would like to subscribe to all scanner connection events
            notifications_mask |= DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_BARCODE.value | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_BARCODE.value | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SESSION_ESTABLISHMENT.value | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SESSION_TERMINATION.value;


            // We would like to subscribe to all barcode events
            // subscribe to events set in notification mask
            sdkHandler.dcssdkSubsribeForEvents(notifications_mask);
        }
        if (sdkHandler != null)
        {
            ArrayList<DCSScannerInfo> availableScanners = new ArrayList<>();
            availableScanners  = (ArrayList<DCSScannerInfo>) sdkHandler.dcssdkGetAvailableScannersList();

            scannerList.clear();
            if (availableScanners != null)
            {
                for (DCSScannerInfo scanner : availableScanners)
                {

                    scannerList.add(scanner);
                }
            }
            else
                Log.d(TAG,"Available scanners null");

        }
        if (reader != null )
        {
            for (DCSScannerInfo device : scannerList)
            {
                if (device.getScannerName().contains(reader.getHostName()))
                {
                    try
                    {
                        sdkHandler.dcssdkEstablishCommunicationSession(device.getScannerID());
                        scannerID= device.getScannerID();
                    }
                    catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private synchronized void disconnect() {
        Log.d(TAG, "Disconnect");
        try {
            if (reader != null) {
                reader.Events.removeEventsListener(this);
                if (sdkHandler != null) {
                    sdkHandler.dcssdkTerminateCommunicationSession(scannerID);
                    scannerList = null;
                }
                reader.disconnect();
                context.sendToast("Disconnecting reader");
            }
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public synchronized void dispose() {
        if (reader != null) {
            try {
                if (reader.isConnected())
                    reader.disconnect();
            } catch (InvalidUsageException e) {
                e.printStackTrace();
            } catch (OperationFailureException e) {
                e.printStackTrace();
            }
            reader = null;
        }
        if (readers != null) {
            try {
                readers.Dispose();
            } catch (Exception e) {
                e.printStackTrace();
            }
            readers = null;
        }
    }

    synchronized void performInventory() {
        try {
            reader.Actions.Inventory.perform();
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
        }
    }

    synchronized void stopInventory() {
        try {
            reader.Actions.Inventory.stop();
        } catch (InvalidUsageException e) {
            e.printStackTrace();
        } catch (OperationFailureException e) {
            e.printStackTrace();
        }
    }
    public void scanCode(){
        String in_xml = "<inArgs><scannerID>" + scannerID+ "</scannerID></inArgs>";
        cmdExecTask = new MyAsyncTask(scannerID, DCSSDKDefs.DCSSDK_COMMAND_OPCODE.DCSSDK_DEVICE_PULL_TRIGGER, null);
        cmdExecTask.execute(new String[]{in_xml});
    }

    private class MyAsyncTask extends AsyncTask<String, Integer, Boolean> {
        int scannerId;
        StringBuilder outXML;
        DCSSDKDefs.DCSSDK_COMMAND_OPCODE opcode;
        ///private CustomProgressDialog progressDialog;

        public MyAsyncTask(int scannerId, DCSSDKDefs.DCSSDK_COMMAND_OPCODE opcode, StringBuilder outXML) {
            this.scannerId = scannerId;
            this.opcode = opcode;
            this.outXML = outXML;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();

        }


        @Override
        protected Boolean doInBackground(String... strings) {
            return executeCommand(opcode, strings[0], outXML, scannerId);
        }

        @Override
        protected void onPostExecute(Boolean b) {
            super.onPostExecute(b);
        }
    }
    public boolean executeCommand(DCSSDKDefs.DCSSDK_COMMAND_OPCODE opCode, String inXML, StringBuilder outXML, int scannerID) {
        if (sdkHandler != null)
        {
            if(outXML == null){
                outXML = new StringBuilder();
            }
            DCSSDKDefs.DCSSDK_RESULT result=sdkHandler.dcssdkExecuteCommandOpCodeInXMLForScanner(opCode,inXML,outXML,scannerID);
            Log.d(TAG, "execute command returned " + result.toString() );
            if(result== DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_SUCCESS)
                return true;
            else if(result==DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_FAILURE)
                return false;
        }
        return false;
    }
    // Read/Status Notify handler
    // Implement the RfidEventsLister class to receive event notifications
    @Override
    public void eventReadNotify(RfidReadEvents rfidReadEvents) {
        TagData[] myTags = reader.Actions.getReadTags(100);
        if (myTags != null && myTags.length > 0) {
            for (TagData tag : myTags) {
                String epc = tag.getTagID();
                Log.d(TAG, "EPC Read: " + epc);
                context.onTagRead(epc);
            }
            new AsyncDataUpdate().execute(myTags);
        }
    }

    @Override
    public void eventStatusNotify(RfidStatusEvents rfidStatusEvents) {
        Log.d(TAG, "Status Notification: " + rfidStatusEvents.StatusEventData.getStatusEventType());
        if (rfidStatusEvents.StatusEventData.getStatusEventType() == STATUS_EVENT_TYPE.HANDHELD_TRIGGER_EVENT) {
            if (rfidStatusEvents.StatusEventData.HandheldTriggerEventData.getHandheldEvent() == HANDHELD_TRIGGER_EVENT_TYPE.HANDHELD_TRIGGER_PRESSED) {
                new AsyncTask<Void, Void, Void>() {
                    @Override
                    protected Void doInBackground(Void... voids) {
                        Log.d(TAG,"HANDHELD_TRIGGER_PRESSED");
                        context.handleTriggerPress(true);
                        return null;
                    }
                }.execute();
            }
            if (rfidStatusEvents.StatusEventData.HandheldTriggerEventData.getHandheldEvent() == HANDHELD_TRIGGER_EVENT_TYPE.HANDHELD_TRIGGER_RELEASED) {
                new AsyncTask<Void, Void, Void>() {
                    @Override
                    protected Void doInBackground(Void... voids) {
                        context.handleTriggerPress(false);
                        Log.d(TAG,"HANDHELD_TRIGGER_RELEASED");
                        return null;
                    }
                }.execute();
            }
        }
        if (rfidStatusEvents.StatusEventData.getStatusEventType() == STATUS_EVENT_TYPE.DISCONNECTION_EVENT) {
            new AsyncTask<Void, Void, Void>() {
                @Override
                protected Void doInBackground(Void... voids) {
                    disconnect();
                    return null;
                }
            }.execute();
        }
    }

    private class AsyncDataUpdate extends AsyncTask<TagData[], Void, Void> {
        @Override
        protected Void doInBackground(TagData[]... params) {
            context.handleTagdata(params[0]);

            return null;
        }
    }

    interface ResponseHandlerInterface {
        void handleTagdata(TagData[] tagData);
        void handleTriggerPress(boolean pressed);
        void barcodeData(String val);
        void sendToast(String val);
        void onTagRead(String epc);
    }

    public void writeToTag(String targetEpc, String dataToWrite) {
        if (!isReaderConnected()) {
            context.sendToast("Reader not connected");
            return;
        }

        try {
            // The SDK does not provide a direct way to get user memory size. Check tag datasheet or read user memory to determine size.
            int totalWordsNeeded = dataToWrite.length() / 4; // since your data is already hex and padded
            Log.d("RFIDHandler", "Words needed for payload: " + totalWordsNeeded);

            // Create a tag access object
            TagAccess tagAccess = new TagAccess();
            
            // Create write access parameters
            TagAccess.WriteAccessParams writeAccessParams = tagAccess.new WriteAccessParams();
            writeAccessParams.setMemoryBank(MEMORY_BANK.MEMORY_BANK_USER);
            writeAccessParams.setOffset(0); // Start writing from the beginning of user memory
            writeAccessParams.setWriteData(dataToWrite);
            writeAccessParams.setWriteDataLength(dataToWrite.length() / 4);
            
            // Create a prefilter to target the specific tag
            PreFilters.PreFilter preFilter = new PreFilters().new PreFilter();
            preFilter.setTagPattern(targetEpc);
            preFilter.setTagPatternBitCount(targetEpc.length() * 4); // Convert hex string length to bits
            preFilter.setBitOffset(32); // Skip PC bits
            preFilter.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
            preFilter.setFilterAction(FILTER_ACTION.FILTER_ACTION_STATE_AWARE);
            
            // Apply the prefilter
            reader.Actions.PreFilters.deleteAll();
            reader.Actions.PreFilters.add(preFilter);
            
            // Set a longer timeout for write operation (20 seconds)
            reader.Config.setAccessOperationWaitTimeout(20000);
            // Perform the write operation
            reader.Actions.TagAccess.writeWait(targetEpc, writeAccessParams, null, null);
            
            // Show success message
            context.sendToast("Write successful");
            
        } catch (InvalidUsageException e) {
            e.printStackTrace();
            context.sendToast("Write failed: " + e.getInfo());
        } catch (OperationFailureException e) {
            e.printStackTrace();
            context.sendToast("Write failed: " + e.getVendorMessage());
        }
    }

    public String readUserMemory(String epc, int lengthInWords) {
        if (!isReaderConnected()) {
            context.sendToast("Reader not connected");
            return null;
        }
        try {
            TagAccess tagAccess = new TagAccess();
            TagAccess.ReadAccessParams readParams = tagAccess.new ReadAccessParams();
            readParams.setMemoryBank(MEMORY_BANK.MEMORY_BANK_USER);
            readParams.setOffset(0);
            readParams.setCount(lengthInWords);
            TagData tagData = reader.Actions.TagAccess.readWait(epc, readParams, null);
            if (tagData != null) {
                return tagData.getMemoryBankData();
            }
        } catch (InvalidUsageException | OperationFailureException e) {
            e.printStackTrace();
            context.sendToast("Read failed: " + e.getMessage());
        }
        return null;
    }

    public boolean isConnected() {
        return isConnected;
    }

    public boolean isInventoryRunning() {
        return isInventoryRunning;
    }

    public String getLastEPCRead() {
        return lastEPCRead;
    }
}
