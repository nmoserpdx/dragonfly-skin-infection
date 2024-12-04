package com.protondx.dragonfly;

import static com.protondx.dragonfly.Services.Constants.MyPREFERENCES;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.app.DownloadManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothHeadset;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.Camera;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraManager;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.webkit.PermissionRequest;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.auth0.android.Auth0;
import com.auth0.android.authentication.AuthenticationException;
import com.auth0.android.callback.Callback;
import com.auth0.android.provider.WebAuthProvider;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.firebase.components.BuildConfig;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;


import com.opencsv.CSVWriter;
import com.protondx.dragonfly.Services.BackgroundService;
import com.protondx.dragonfly.Services.Constants;
import com.protondx.dragonfly.Services.Get_Header_AsyncTask;
import com.protondx.dragonfly.Services.Json_Appconfig_Asynctask;
import com.protondx.dragonfly.Services.UploadService;

import com.protondx.dragonfly.aialgorithm.Utils;
//import com.protondx.dragonfly.bluetoothutils.DragonflyBTConnectivityHelper;
import com.protondx.dragonfly.bluetoothutils.DragonflyBTConnectivityHelper;
import com.protondx.dragonfly.bluetoothutils.DragonflyBTHelper;
import com.protondx.dragonfly.database.DbHandler;
import com.protondx.dragonfly.datamodels.AlgorithmOutputModel;
import com.protondx.dragonfly.datamodels.RecyclerView_switchUser;
import com.protondx.dragonfly.datamodels.TestResults;
import com.protondx.dragonfly.datamodels.Users;
import com.protondx.dragonfly.downloader.FileDownloader;
import com.protondx.dragonfly.downloader.FileUtils;
import com.protondx.dragonfly.fileserver.HttpFileServer;
import com.protondx.dragonfly.gmm.ApriltagNative;
import com.protondx.dragonfly.gmm.Gmmdetection;
import com.protondx.dragonfly.gmm.Key_value;

import com.protondx.dragonfly.interfaces.ILaceWingBluetoothInterface;
import com.protondx.dragonfly.interfaces.ILaceWingDeviceSearchInterface;
import com.protondx.dragonfly.interfaces.MainActivityCallback;
import com.protondx.dragonfly.models.lacewingconnectivitymodel.SerialCommandResponseModel;
import com.scandit.datacapture.barcode.capture.BarcodeCapture;
import com.scandit.datacapture.barcode.capture.BarcodeCaptureListener;
import com.scandit.datacapture.barcode.capture.BarcodeCaptureSession;
import com.scandit.datacapture.barcode.capture.BarcodeCaptureSettings;
import com.scandit.datacapture.barcode.data.Symbology;
import com.scandit.datacapture.barcode.data.SymbologyDescription;
import com.scandit.datacapture.core.capture.DataCaptureContext;
import com.scandit.datacapture.core.common.ContextStatus;
import com.scandit.datacapture.core.common.feedback.Feedback;
import com.scandit.datacapture.core.common.feedback.Sound;
import com.scandit.datacapture.core.common.feedback.Vibration;
import com.scandit.datacapture.core.data.FrameData;
import com.scandit.datacapture.core.source.BitmapFrameSource;
import com.scandit.datacapture.core.source.FrameSource;
import com.scandit.datacapture.core.source.FrameSourceListener;
import com.scandit.datacapture.core.source.FrameSourceState;
import com.scandit.datacapture.core.time.TimeInterval;
import com.scandit.datacapture.core.ui.DataCaptureView;

import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.opencv.android.InstallCallbackInterface;
import org.opencv.android.LoaderCallbackInterface;
import org.opencv.android.OpenCVLoader;


import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import javax.xml.transform.Result;


public class MainActivity extends AppCompatActivity implements IMainActivityInterface, BarcodeCaptureListener, FrameSourceListener {
    private static final int BUFFER_SIZE = 8192;
    private static final int PERMISSON_STORAGE_CODE = 10000;
    private static final int PERMISSON_CAMERA_CODE = 12345;
    private static final String TAG = MainActivity.class.getName().toString();
    private  WebView myWebView;
    private ImageView mImageView;
    private FloatingActionButton bluetooth_btn;
    private ArrayList<AlgorithmOutputModel>algorithmOutputModels_array=new ArrayList<>();
    private HttpFileServer mServer;
    private int mCurrentPortNumber;
    String CHANNEL_ID="pdx";

    private  BitmapFrameSource bitmapFrameSource=null;
    private Dialog userDialog;
    private RecyclerView recyclerView;
    boolean logoutCalled=false;
    private String callFrm1="";
    public static MainActivity instance;
    ProgressDialog progressBar;
    JobScheduler jobScheduler;
    private String dataMatrixString="";
    private static final int PERMISSION_CODE = 3030;
    private long DownloadId;
    private String SDPath = "";
    private static final int REQUEST_ENABLE_BT = 1;
    private String unzipPath = SDPath + "";
    private String zipPath = SDPath + "";
    private Button btnDownloadFile;
    private Camera camera;
    private ScheduledExecutorService scheduleTaskExecutor;

    boolean hasCameraFlash = false;
    public static Bitmap result = null;
    public static List<Integer> hueResult = null;
    private int MYJOBID=1;
    private Auth0 auth0;
    private String callFrm;
    private int version_number=4;
    private boolean qrProcess=false;
    private DataCaptureContext dataCaptureContext;
    private BarcodeCapture barcodeCapture;
    private DataCaptureView dataCaptureView;
    private boolean isQrProcess=false;
    private BluetoothAdapter mBluetoothAdapter;
    //Following code is for BT connection to EYOYO
    private DragonflyBTConnectivityHelper deviceConnection;
    static UUID myBleUUid = UUID.fromString("00001101-0000-1000-8000-00805f9b34fb");
    public static final String EXTRA_CLEAR_CREDENTIALS = "com.auth0.CLEAR_CREDENTIALS";
    public static final String EXTRA_ACCESS_TOKEN = "com.auth0.ACCESS_TOKEN";
    AlgorithmOutputModel algorithmOutput = new AlgorithmOutputModel();
    private boolean IsBluetoothOn;
    private Handler M_MainHandler= new Handler();
    private ArrayList<BluetoothDevice>bt_devices=new ArrayList<>();
    private AppCompatButton closeImage,confirmBtn;
    private TextView dialogStatusTV,bt_connected_deviceName_tv,bt_connected_deviceStatus_tv;
    private RecyclerView_switchUser recyclerView_switchUser;
    private LinearLayout bt_connected_device_linearLayout;
    private BluetoothDevice connected_Bt_device;
    private boolean IsDeviceConnected=false;
    private boolean is_connectionInProcess=false;
    private boolean pre_connection_status=false;

    private String sample_testpanel_ids = null;

    private ImageView disconnect_imageView;
    private int alt=1;
    private int created=0;
    private DragonflyBTConnectivityHelper MLacewingDeviceConnection;
    public MainActivityCallback mainActivityCallback=new MainActivityCallback() {
        @Override
        public void onStartsearch(String msg) {
            dialogStatusTV.setText("Searching for nearby Devices");
            recyclerView.setVisibility(View.GONE);

        }
    };

    private ILaceWingBluetoothInterface callBackInterface = new ILaceWingBluetoothInterface() {
        @Override
        public void onSerialCommandResponse(SerialCommandResponseModel response, int callId) {
//            if (callId == mTestStepsCallId) {
//                M_MainHandler.post(() -> {
                    Log.d("Bluetooth_PDX", response.getError());
//                });
//            }
        }

        @Override
        public void onLaceWingConnected(BluetoothDevice device) {
            if(device!=null)
            {

                Log.e("bluetooth","sending1");

                if (mBluetoothAdapter.isDiscovering())
                {
                    mBluetoothAdapter.cancelDiscovery();
                }
               // Log.e("bluetooth","sending");
                IsDeviceConnected = true;
                Log.e("bluetooth",device.getBondState()+"");
                connected_Bt_device=device;
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if(recyclerView!=null)
                        {
                            recyclerView.setVisibility(View.GONE);
                            bt_connected_device_linearLayout.setVisibility(View.VISIBLE);
                            dialogStatusTV.setVisibility(View.GONE);
                            bt_connected_deviceName_tv.setText(DragonflyBTHelper.getDeviceName(device));
                            confirmBtn.setTextColor(getResources().getColor(R.color.black2));
                            confirmBtn.setBackground(getResources().getDrawable(R.drawable.button_bg_green));
                            bt_connected_deviceStatus_tv.setText("Connected");
                            String res = DragonflyBTHelper.getBluetoothModel(connected_Bt_device,true);
                            Log.e("data_to_react",res);
                            sendItToReact(res);

                            storeInSharedPreference("lastConnectedDevice",DragonflyBTHelper.getDeviceName(device));
                        }
                        else
                        {
                            String res = DragonflyBTHelper.getBluetoothModel(connected_Bt_device,true);
                            Log.e("data_to_react",res);
                            sendItToReact(res);
                            storeInSharedPreference("lastConnectedDevice",DragonflyBTHelper.getDeviceName(device));

                        }

                    }
                });
            }

            Log.e("Bluetooth_PDX", "Lacewing connected");


            M_MainHandler.post(() -> {
                Log.d("Bluetooth_PDX", "Lacewing connected");
//                if (mParentCallback != null) {
//                    if (cardContainerMainBinding == null)
//                        initView();
//                    checkDeviceId();
//                    mParentCallback.onConnected(LacewingDeviceView.this);
//                }
            });
            String res= null;
            //initialize the entire view

        }

        @Override
        public void onLaceWingConnected(BluetoothDevice device, BluetoothSocket socket) {
            Log.e("device_serial_communication",device.getName());
          //30s sleep ^&043&^
          //30min sleep ^&048&^d
          //never sleep ^&040&^
          //now sleep ^&041&^

        is_connectionInProcess=false;
            if (mBluetoothAdapter.isEnabled()) {
                if (mBluetoothAdapter.isDiscovering()) {
                    mBluetoothAdapter.cancelDiscovery();
                }
            }

        if(MLacewingDeviceConnection!=null)
        {


            MLacewingDeviceConnection.runCommand(device,socket,"^&043&^");



     }
        }

        @Override
        public void onLacewingConnectionFailed(BluetoothDevice device) {
            IsDeviceConnected = false;
            is_connectionInProcess=false;
            connected_Bt_device=null;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.i("BT","Connection failed");
                    //Toast.makeText(getMainActivity(),"Connection failed",Toast.LENGTH_SHORT).show();
                    String res = DragonflyBTHelper.getBluetoothModel(device,false);
                    Log.e("data_to_react",res);
                    sendItToReact(res);
                }
            });

        }

        @Override
        public void onReceiveData(String data) {
            if(data != null && data.length() > 0) {
                String temp = data.replaceAll("(\\r|\\n)", "");

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Log.e("Bluetooth_data",temp);
                        if(myWebView!=null)
                        {
                            myWebView.evaluateJavascript("javascript:qrCodeOutput(\'" + temp + "\');", null);

                        }


                    }
                });

            }
        }
    };

    private ILaceWingDeviceSearchInterface mDeviceSearchCallBack=new ILaceWingDeviceSearchInterface() {
        @Override
        public void onDeviceSearchSuccess() {

        }

        @Override
        public void onDeviceSearchFailed() {
            is_connectionInProcess=false;
        }

        @Override
        public void connectDevice(BluetoothDevice device) {
           is_connectionInProcess=true;

            if(device!=null)
            {

                if(!IsDeviceConnected)
                MLacewingDeviceConnection = new DragonflyBTConnectivityHelper(callBackInterface, device, myWebView);
         //       MLacewingDeviceConnection.runCommandOnDevice_new("^&041&^");
            }

        }

        @Override
        public void onPairedDevicesFound(List<BluetoothDevice> pairedLacewingDevices) {
            DragonflyBTConnectivityHelper MLacewingDeviceConnection;
            is_connectionInProcess=true;

            if(pairedLacewingDevices.size() > 0) {
                if (mBluetoothAdapter.isEnabled()) {
                    if (mBluetoothAdapter.isDiscovering()) {
                        mBluetoothAdapter.cancelDiscovery();
                    }
                }

                Log.e("device_connected",pairedLacewingDevices.get(0).getName());
                MLacewingDeviceConnection = new DragonflyBTConnectivityHelper(callBackInterface, pairedLacewingDevices.get(0), myWebView);
            }
        }
    };

    private void sendItToReact(String finalRes) {
        Log.e("sending","sending_data");
        try{
            if(created==1)
            {
                pre_connection_status=getStatus(finalRes);
                Log.e("sending","sent");
                myWebView.evaluateJavascript("javascript:setBluetoothStatus(\'" + finalRes + "\');", null);
                if(!pre_connection_status&&getStatus(finalRes))
                {

                }
                else
                {
                    pre_connection_status=getStatus(finalRes);
                }
            }
            else
            {
                final Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                         created=1;
                         sendItToReact( finalRes);
                    }
                }, 2000);
            }
        }catch (Exception e)
        {
            Log.e("error","error while sending data to react");
        }

    }

    private boolean getStatus(String finalRes) {
        boolean response=false;
        try {
            JSONObject jsonObject=new JSONObject(finalRes);
            if(jsonObject.has("status"))
            {
                response= jsonObject.getBoolean("status");
            }



        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  response;
    }

    //OpenCvAlgorithm openCvAlgo;
    //AIAlgorithm aiAlgo;
    Gmmdetection gmmAlgo;
    LoaderCallbackInterface mOpenCVCallBack = new LoaderCallbackInterface() {
        @Override
        public void onManagerConnected(int status) {
            if (status == LoaderCallbackInterface.SUCCESS) {
                //openCvAlgo = new OpenCvAlgorithm(getApplicationContext());
                //Load template here already
                //openCvAlgo.loadTemplate();
                //aiAlgo = new AIAlgorithm(getApplicationContext());
                gmmAlgo = new Gmmdetection(getApplicationContext());
           //     gmmAlgo.readMatFile("file:///android_asset/color_models.mat");

                String downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/color_models.mat";
                File matfile = new File(downloadDir);
                if(matfile.exists()) {
                }else{
                    //Do this at the time of getting permission
                }
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                     //   Toast.makeText(MainActivity.this, "Analyser engine initiated!", Toast.LENGTH_SHORT).show();
                    }
                });
                ApriltagNative.native_init();
                //gmmAlgo.detectGMM();
                //new AsyncCaller().execute();
            }

        }



        @Override
        public void onPackageInstall(int operation, InstallCallbackInterface callback) {

        }
    };
    public static MainActivity getMainActivity() {
        return instance;
    }

       /*    if(initDebug())
        {
          *//*  openCvAlgo=new OpenCvAlgorithm();*//*
     *//* Toast.makeText( ,"opencv is started ",Toast.LENGTH_SHORT).show();*//*
        }else
        {

            *//*OpenCVLoader.initAsync("4.2.0", this, mOpenCVCallBack);*//*
     *//*Toast.makeText( this,"opencv is failed to start ",Toast.LENGTH_SHORT).show();*//*

        }*/


    private boolean mIsDownloadingUpdates;
//    private ZXingScannerView mScannerView;
//    setQrCodeScanner(YUV420toNV21(image.getImage()), image.getWidth(), image.getHeight(), rotationDegrees);


    // Storage Permissions
    private static String[] PERMISSIONS_REQ = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.CAMERA,
            Manifest.permission.BLUETOOTH,
            Manifest.permission.BLUETOOTH_CONNECT,
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_PRIVILEGED,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_BACKGROUND_LOCATION
    };
    private static final int REQUEST_CODE_PERMISSION = 2;

    /**
     * Checks if the app has permission to write to device storage or open camera
     * If the app does not has permission then the user will be prompted to grant permissions
     *
     * @param activity
     */
    private static boolean verifyPermissions(Activity activity) {
        // Check if we have write permission
        int write_permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        int read_permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.READ_EXTERNAL_STORAGE);
        int camera_permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.CAMERA);
        int bt_permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.BLUETOOTH);
        int bt_permission_connect = ActivityCompat.checkSelfPermission(activity, Manifest.permission.BLUETOOTH_CONNECT);
        int bt_permission_scan = ActivityCompat.checkSelfPermission(activity, Manifest.permission.BLUETOOTH_SCAN);
        int bt_permission_privileged = ActivityCompat.checkSelfPermission(activity, Manifest.permission.BLUETOOTH_PRIVILEGED);
        int coarse_location_permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_COARSE_LOCATION);
        int fine_location_permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION);
        int background_location_permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_BACKGROUND_LOCATION);

        if (write_permission != PackageManager.PERMISSION_GRANTED ||
                read_permission != PackageManager.PERMISSION_GRANTED ||
                camera_permission != PackageManager.PERMISSION_GRANTED ||
                bt_permission != PackageManager.PERMISSION_GRANTED ||
                bt_permission_connect != PackageManager.PERMISSION_GRANTED ||
                bt_permission_scan != PackageManager.PERMISSION_GRANTED ||
                bt_permission_privileged != PackageManager.PERMISSION_GRANTED ||
                coarse_location_permission != PackageManager.PERMISSION_GRANTED ||
                fine_location_permission != PackageManager.PERMISSION_GRANTED || background_location_permission != PackageManager.PERMISSION_GRANTED  ) {
            // We don't have permission so prompt the user
            ActivityCompat.requestPermissions(
                    activity,
                    PERMISSIONS_REQ,
                    REQUEST_CODE_PERMISSION
            );
            return false;
        } else
        {
            return true;
        }
    }

//    public void changeUser(Users users1,Context context) {
////        SharedPreferences prefs = context.getApplicationContext().
////                getSharedPreferences(context.getPackageName(), Activity.MODE_PRIVATE);
////
////        String json = prefs.getString("json","");
//
//        runOnUiThread(() -> {
//            myWebView.post(() -> {
//
//                myWebView.evaluateJavascript("javascript:setSaveJson(\'" + users1.getHeaterData() + "\');",null);
//
//
//
//            });
//        });
//        //  String storeString=storeCurrentTime(json);
//      //  myWebView.evaluateJavascript("javascript:setSaveJson(\'" + json + "\');",null);
//        Log.e("status","app restated");
//        Log.e("status",users1.getHeaterData());
//        userDialog.dismiss();
//    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        mScannerView = new ZXingScannerView(this);
        boolean permissions = false;
        setContentView(R.layout.activity_main);

        auth0 = new Auth0(getResources().getString(R.string.com_auth0_client_id),getResources().getString(R.string.com_auth0_domain));
        auth0 = new Auth0(this);
//        if(getIntent().hasExtra("data"))
//        {
//            version_number=getIntent().getIntExtra("data",38);
//        }

//        copyAssets();
//        try {
//            getSupportActionBar().hide();
//        } catch (NullPointerException ex) {
//            ex.printStackTrace();
//        }


        if (!OpenCVLoader.initDebug()) {
            Log.d(TAG, "Internal OpenCV library not found. Using OpenCV Manager for initialization");
            OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION, this, mOpenCVCallBack);
        } else {
            //openCvAlgo = new OpenCvAlgorithm(getApplicationContext());
            Log.d(TAG, "OpenCV library found inside package. Using it!");
            mOpenCVCallBack.onManagerConnected(LoaderCallbackInterface.SUCCESS);
        }

        int currentapiVersion = android.os.Build.VERSION.SDK_INT;

        if (currentapiVersion >= Build.VERSION_CODES.M) {
            permissions = verifyPermissions(this);
        }


        startServer();

        hasCameraFlash = getPackageManager().
        hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH);

        myWebView = (WebView) findViewById(R.id.webview);
        mImageView = (ImageView) findViewById(R.id.imageViewHtmlFrameDisplay);
        bluetooth_btn=findViewById(R.id.floating_bt);
        btnDownloadFile = findViewById(R.id.btn_downloadFilesFromInternet);
        myWebView.getSettings().setJavaScriptEnabled(true);
        myWebView.getSettings().setAllowContentAccess(true);
        myWebView.getSettings().setAllowFileAccess(true);
        myWebView.getSettings().setSupportZoom(false);
        myWebView.getSettings().setBuiltInZoomControls(false);
        myWebView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        myWebView.getSettings().setDomStorageEnabled(true);
        myWebView.getSettings().setMediaPlaybackRequiresUserGesture(false);
//        myWebView.getSettings().setAppCacheEnabled(false);
        myWebView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
       // registerReceiver(onDownloadComplete, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
        instance = this;

        Intent intent=new Intent(getBaseContext(), BackgroundService.class);
        intent.putExtra("port",mCurrentPortNumber);
     //   startService(intent);
        if (requestPermissionRequired()) {
            loadUrlInWebView();
        }
        initBluetoothDialog();

//        myWebView.getSettings().setPluginState(WebSettings.PluginState.ON);
        myWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    request.grant(request.getResources());
                }
            }
        });

        //Check new config if available from the server
        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        String loginData = prefs.getString("CurrentUser","");
        if(loginData != null) {
            if (loginData.length() > 0) {
                try {
                    JSONObject jsonObject=new JSONObject(loginData);
                    String heaterData = jsonObject.getString("heaterData");
                    if(heaterData != null && heaterData.length() > 0) {
                        JSONObject heaterObj = new JSONObject(heaterData);
                        if(heaterObj != null) {
                            JSONObject loginInfo = heaterObj.getJSONObject("LoginInfo");
                            if (loginInfo != null) {
                                String authToken = loginInfo.getString("auth0_access_token");
                                checkForNewPanelsLatest(authToken);
                            }
                            Log.e("logging_error", heaterData);
                        }
                    }
                } catch (Exception e) {
                    Log.e("logging_error" , e.getMessage());
                }
            }
        }

        progressBar=new ProgressDialog(MainActivity.this);
        progressBar.setMessage("Please wait");
        progressBar.show();
        //setValueToReact(); //moving this inside checkForNewPanels

//        myWebView.setDownloadListener(new DownloadListener() {
//
//            @Override
//            public void onDownloadStart(String url, String userAgent,
//                                        String contentDisposition, String mimetype,
//                                        long contentLength) {
//                Log.e("downloadManeger","isCalled");
//
//                DownloadManager.Request request = new DownloadManager.Request(
//                        Uri.parse(url));
//
//                request.allowScanningByMediaScanner();
//                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED); //Notify client once download is completed!
//                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "Name of your downloadble file goes here, example: Mathematics II ");
//                DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
//                dm.enqueue(request);
//                Toast.makeText(getApplicationContext(), "Downloading File", //To notify the Client that the file is being downloaded
//                        Toast.LENGTH_LONG).show();
//
//            }
//        });
        btnDownloadFile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                downloadUpdates();
            }
        });

        myWebView.addJavascriptInterface(new JsInterface(this), "NativeDevice");
        myWebView.setWebViewClient(webClient);
        if (requestPermissionRequired()) {
            loadUrlInWebView();
        }
        //request BT permission here
        requestBluetoothPermissions();
        checkForBTDevice();
        //        myWebView.loadUrl("file:///android_asset/webapp.html");
        //check BT for EYOYO here

        //   CheckBlueToothState();
        //  CheckBlueToothState();
        bluetooth_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                bt_devices.clear();
                showBTDialog();
            }
        });
    }

    public void checkForBTDevice() {
        Log.e("BT","bt process called");

        if(!IsDeviceConnected&& !is_connectionInProcess)
        {
            IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
            filter.addAction(BluetoothAdapter.EXTRA_STATE);
            filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
            filter.addAction(BluetoothAdapter.EXTRA_SCAN_MODE);
            filter.addAction(BluetoothDevice.ACTION_ACL_CONNECTED);

            filter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECT_REQUESTED);
            filter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED);
            //     filter.addAction(BluetoothAdapter.ACTION_SCAN_MODE_CHANGED);

            registerReceiver(receiver, filter);

            if(!IsDeviceConnected)
            {
                mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
                if (checkIfSupportsBluetoth()) {
                    //if (requestBluetoothPermissions()) { //TBD ANAND
                        coonectBluetooth();
                    //}
                }
            }else
            {
                Log.d("BT","device is already connected");
            }
        }

        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                Log.e("BT","running connection process");

                checkForBTDevice();
                // Do something after 5s = 5000ms

            }
        }, 10000);
    }

    private void coonectBluetooth() {
        Log.e("check_for_bt_device","calling connection");
        if (mBluetoothAdapter.isEnabled()){
            if (mDeviceSearchCallBack != null)
            {
                searchForBluetoothDeviceNew(mDeviceSearchCallBack);
            }
        }
    }
     private void  initBluetoothDialog()
    {
        userDialog = new Dialog(MainActivity.this);
        userDialog.requestWindowFeature(Window.FEATURE_ACTION_BAR);
        userDialog.setCancelable(false);
        userDialog.setContentView(R.layout.dialog_switch_user);
        recyclerView=userDialog.findViewById(R.id.recyclerView);
        dialogStatusTV=userDialog.findViewById(R.id.statusTv);
        closeImage=userDialog.findViewById(R.id.closeImg);
        confirmBtn=userDialog.findViewById(R.id.confirm_button);
        bt_connected_deviceName_tv=userDialog.findViewById(R.id.bt_connected_deviceName_tv);
        bt_connected_deviceStatus_tv=userDialog.findViewById(R.id.bt_connected_deviceStatus_tv);
        disconnect_imageView=userDialog.findViewById(R.id.disconnect_imageView);
        bt_connected_device_linearLayout=userDialog.findViewById(R.id.bt_connected_device_linearLayout);
        bt_connected_device_linearLayout.setVisibility(View.GONE);
        recyclerView_switchUser = new RecyclerView_switchUser(MainActivity.this, bt_devices,mDeviceSearchCallBack );
        recyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
        recyclerView.setAdapter(recyclerView_switchUser);
    }

    //available device list dialog
    private void showBTDialog() {



        runOnUiThread(() -> {
            if(receiver!=null)
            {
                IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
                filter.addAction(BluetoothAdapter.EXTRA_STATE);
                filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
                filter.addAction(BluetoothAdapter.EXTRA_SCAN_MODE);
                filter.addAction(BluetoothDevice.ACTION_ACL_CONNECTED);

                filter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECT_REQUESTED);
                filter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED);
                //     filter.addAction(BluetoothAdapter.ACTION_SCAN_MODE_CHANGED);

                registerReceiver(receiver, filter);
            }
            bt_connected_device_linearLayout.setVisibility(View.GONE);
            CheckBlueToothState();

            //to check status of bluetooth


//            Intent intent=new Intent(getBaseContext(), BluetoothService.class);
//            startService(intent);

           // intent.putExtra("port",mCurrentPortNumber);

        });

        //saveittoheater


        confirmBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(connected_Bt_device!=null)
                {
                    String res;
                    res = DragonflyBTHelper.getBluetoothModel(connected_Bt_device,true);
                    String finalRes = res;
                    if(res!=null)
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                // Log.e("Bluetooth",finalRes);
                                myWebView.evaluateJavascript("javascript:setBluetoothConnectedDevices(\'" + finalRes + "\');", null);
                                userDialog.dismiss();
                            }
                        });
                }

            }
        });

        closeImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.e("close","clicked");
                userDialog.dismiss();
            }
        });
        disconnect_imageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(connected_Bt_device!=null)
                {
                    disconnectBluetoothDevice(connected_Bt_device.getAddress());
                    userDialog.dismiss();
                }
            }
        });

        userDialog.show();
    }

    private final BroadcastReceiver receiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            final int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE,
                    BluetoothAdapter.ERROR);
            Log.e("BT","Receiver Called");

            if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED == action) {
                Log.e("BT", "Discovery finished, hide loading");
                dialogStatusTV.setVisibility(View.GONE);
                recyclerView.setVisibility(View.VISIBLE);
                if (recyclerView_switchUser != null)
                {
                    recyclerView_switchUser.notifyDataSetChanged();

                }
                if(bt_devices.size()==0)
                {
                    dialogStatusTV.setVisibility(View.VISIBLE);
                    recyclerView.setVisibility(View.GONE);
                    dialogStatusTV.setText("No devices found");
                }

            } else if (BluetoothDevice.ACTION_FOUND == action) {
                Log.e("BT","device_disconnected");

                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if(device!=null)
                {
                    bt_devices.add(device);
                    if (recyclerView_switchUser != null)
                    {
                        recyclerView_switchUser.notifyDataSetChanged();
                        recyclerView.setVisibility(View.VISIBLE);

                    }


                    Log.e("BT", "Device Name: " + device.getName());
               //     dialogStatusTV.setVisibility(View.GONE);
                }


            }else if(state==BluetoothAdapter.STATE_ON)
            {
                showBTDialog();
            }
            else if(BluetoothDevice.ACTION_ACL_DISCONNECTED.equals(action))
            {
                Log.e("BT","device_disconnected");

                if(getMainActivity()!=null)
                {
                   // BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);

                    IsDeviceConnected=false;

                    String res = DragonflyBTHelper.getBluetoothModel(connected_Bt_device,false);

                    Log.e("data_to_react",res);
                    sendItToReact(res);
                    Log.i("BT","Disconnected");
                  //  Toast.makeText(getMainActivity(),"Disconnected",Toast.LENGTH_SHORT).show();

                }
            }
            else if(BluetoothDevice.ACTION_ACL_CONNECTED.equalsIgnoreCase(action)){
                if(getMainActivity()!=null)
                {
                    BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);

                    Log.i("BT","Connected");
                    dialogStatusTV.setVisibility(View.GONE);
                    Log.e("BT-------", "Paired Sucessfully");
                }
                Log.d("BtTag","Connected to the device");
            }
        }
    };
    /*
    private final BroadcastReceiver receiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            M_MainHandler.post(() -> {
                Toast.makeText(MainActivity.this, "Bluetooth turning on", Toast.LENGTH_LONG).show();
            });
            final String action = intent.getAction();

            if (action.equals(BluetoothAdapter.ACTION_STATE_CHANGED)) {
                final int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE,
                        BluetoothAdapter.ERROR);
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);


                //  mDeviceList.add(device.getName() + "\n" + device.getAddress());
                if(device!=null)
                Log.e("BT", device.getName() + "\n" + device.getAddress());
                switch (state) {
                    case BluetoothAdapter.STATE_OFF:
                        // Bluetooth has been turned off;
                        IsBluetoothOn = false;
                        M_MainHandler.post(() -> {
                            Toast.makeText(MainActivity.this, "Bluetooth is off", Toast.LENGTH_LONG).show();
                        });
                        break;
                    case BluetoothAdapter.STATE_TURNING_OFF:
                        // Bluetooth is turning off;
                        break;
                    case BluetoothAdapter.STATE_ON:
                        // bluetooth Is On
                        IsBluetoothOn = true;
                        Toast.makeText(MainActivity.this, "Bluetooth is ON", Toast.LENGTH_LONG).show();

                        if (mDeviceSearchCallBack != null)
                            searchForBluetoothDeviceNew(mDeviceSearchCallBack);
                        break;
                    case BluetoothAdapter.STATE_TURNING_ON:
                        // Bluetooth is turning on
                        M_MainHandler.post(() -> {
                            Toast.makeText(MainActivity.this, "Bluetooth turning on", Toast.LENGTH_LONG).show();
                        });
                        break;
                }
            }
            else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action))
            {
                Log.v(" ","discovery Finished ");
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);


                //  mDeviceList.add(device.getName() + "\n" + device.getAddress());
                if(device!=null)
                    Log.e("BT", device.getName() + "\n" + device.getAddress());
//                if(newDevices.size() != 0)
//                {
//                    deviceList.invalidateViews();
//                    sectionAdapter.notifyDataSetChanged();
//                }
//                else
//                {
//                    Toast.makeText(YourActivity.this, "No New Devices Found", Toast.LENGTH_LONG).show();
//                }
            }
        }
    };

     */
    private boolean checkIfSupportsBluetoth() {
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter == null) {
            // Device doesn't support Bluetooth
            return false;
        }
        return true;
    }

    @Override
    public void getPairedLacewingDevices(ILaceWingDeviceSearchInterface callback) {
        if (callback != null)
        {
            mDeviceSearchCallBack = callback;
            searchForBluetoothDeviceNew(callback);
        }

    }

    @Override
    public void setDemoMode(boolean value) {

        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        SharedPreferences.Editor edit = prefs.edit();

        //  String json="{\"AdvData\":{\"useAdvHeaterStoreData\":{\"AdvHeater\":{\"a\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"HeaterId\":[\"a\"],\"allHeaters\":[0]},\"useAdvSampleStoreData\":{\"advSampleCompletedStep\":{\"1\":[]},\"advSamples\":{},\"advSamplesPos\":{},\"samplesNo\":[1],\"samplesReadyForCapture\":[]},\"useAdvSampleTimerStoreData\":{\"AdvSampleTimerPos\":{\"1\":{\"DRY_1\":{\"isPlaying\":false,\"timer\":30},\"Elution_1\":{\"isPlaying\":false,\"timer\":30},\"LYSIS_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_2\":{\"isPlaying\":false,\"timer\":30}}}},\"useAdvTestDataStoreData\":{\"advSampleID\":{},\"advSamplePrepKit\":{},\"advTestPanelID\":{}},\"useAdvTimerStoreData\":{\"activeTimer\":1643651249,\"incubationTimer\":{},\"timerForSamplePos\":{}}},\"BegData\":{\"useHeaterStoreData\":{\"heater\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"useSampleStoreData\":{\"samplePos\":{},\"samples\":[],\"timeExceededSamples\":{},\"timerMapper\":{},\"voidSamples\":[]}},\"LoginData\":{\"isLogin\":true},\"LoginInfo\":{\"auth0_user_id\":\"auth0|61f434e7c725130071fe3f78\",\"auth_data\":{\"debug_run\":true,\"user_agent\":\"WPF APP\"},\"created_at\":\"2022-01-28T18:24:40.085979\",\"id\":\"61f434e8f4341a8a875337ea\",\"no_of_test_runs\":0,\"org_id\":\"61dea2a75bb5036a7ccd0daf\",\"test_runs\":2,\"updated_at\":\"2022-01-28T18:24:40.085993\"}}";
       // boolean value = prefs.getBoolean("demoMode",false);

        if (prefs.contains("demoMode")) {
            edit.remove("demoMode");

        }
        edit.putBoolean("demoMode", value);
        edit.apply();
        Log.e("savedJson",value?"true":"false");
        edit.commit();
    }
    @Override
    public boolean isDemoMode() {

        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        SharedPreferences.Editor edit = prefs.edit();
        boolean value = prefs.getBoolean("demoMode",false);
        Log.e("returnedValue",value?"true":"false");

        return value;
    }
    @Override
    public void ShowNoBluetoothMode() {

        Toast.makeText(MainActivity.this,"Bluetooth is disabled, for testing",Toast.LENGTH_SHORT).show();


    }

    @Override
    public void restartApp() {
        Log.e("restart","called");
        progressBar=new ProgressDialog(MainActivity.this);
        progressBar.setMessage("Please wait");
        progressBar.show();
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if(progressBar!=null)
                {
                    progressBar.dismiss();

                }
                Intent intent = getIntent();
                finish();
                startActivity(intent);

            }
        }, 2000);

    }

    public boolean requestBluetoothPermissions() {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(getApplicationContext(),
                    Manifest.permission.ACCESS_BACKGROUND_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                        MainActivity.this,
                        new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_BACKGROUND_LOCATION, Manifest.permission.BLUETOOTH, Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH_PRIVILEGED},
                        PERMISSION_CODE);
                //to redirect user to settings, above android 10
             //   startActivity(new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS));

                return false;
            } else {
                return true;
            }

        } else {
            if (ContextCompat.checkSelfPermission(getApplicationContext(),
                    Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                        MainActivity.this,
                        new String[]{Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_BACKGROUND_LOCATION},
                        PERMISSION_CODE);
                return false;
            } else {
                return true;
            }
        }
    }

    private void searchForBluetoothDeviceNew(ILaceWingDeviceSearchInterface callback) {
        if (checkIfSupportsBluetoth()) {
            if (requestPermissionRequired()){ //requestBluetoothPermissions()) {

//                requestIgnoreBatteryOptimization();
             //   BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
                if (!mBluetoothAdapter.isEnabled()) {
                    mBluetoothAdapter.enable();
                    return;
                }
//                setMainProgressBarVisibility(true);
                if(callback!=null)
                {
                    is_connectionInProcess=true;
                    DragonflyBTConnectivityHelper.searchForPairedLacewingDevices(callback,getStoreDeviceName());
                }

            }else{
                requestBluetoothPermissions();
            }
        }
    }

    private void initializeAndStartBarcodeScanning(Bitmap bit) {
        barcodeCapture.setEnabled(true);
        synchronized (dataCaptureContext) {
            BitmapFrameSource bitmapFrameSource = BitmapFrameSource.of(bit);
            bitmapFrameSource.switchToDesiredState(FrameSourceState.ON, null);
            bitmapFrameSource.addListener(MainActivity.this);
            if(dataCaptureContext != null) {
                dataCaptureContext.setFrameSource(bitmapFrameSource);
            }
        }

        /*
          dataCaptureContext = DataCaptureContext.forLicenseKey(SCANDIT_LICENSE_KEY);
//          InputStream imageStream = this.getResources().openRawResource(R.raw.image);
//          Bitmap bitmap = BitmapFactory.decodeStream(imageStream);

          BitmapFrameSource bitmapFrameSource=BitmapFrameSource.of(bit);
          bitmapFrameSource.switchToDesiredState(FrameSourceState.ON,null);
          bitmapFrameSource.addListener(MainActivity.this);
          dataCaptureContext.setFrameSource(bitmapFrameSource);
          BarcodeCaptureSettings barcodeCaptureSettings = new BarcodeCaptureSettings();

          barcodeCaptureSettings.setCodeDuplicateFilter(TimeInterval.millis(2000));
        // The settings instance initially has all types of barcodes (symbologies) disabled.
        // For the purpose of this sample we enable a very generous set of symbologies.
        // In your own app ensure that you only enable the symbologies that your app requires as
        // every additional enabled symbology has an impact on processing times.
        HashSet<Symbology> symbologies = new HashSet<>();
//        symbologies.add(Symbology.EAN13_UPCA);
//        symbologies.add(Symbology.EAN8);
//        symbologies.add(Symbology.UPCE);
        symbologies.add(Symbology.QR);
         symbologies.add(Symbology.CODE39);
         symbologies.add(Symbology.CODE128);
//         symbologies.add(Symbology.INTERLEAVED_TWO_OF_FIVE);
         symbologies.add(Symbology.DATA_MATRIX);
         symbologies.add(Symbology.GS1_DATABAR);
         symbologies.add(Symbology.GS1_DATABAR_EXPANDED);
         symbologies.add(Symbology.GS1_DATABAR_LIMITED);
         barcodeCaptureSettings.enableSymbologies(symbologies);
//        SymbologySettings symbologySettings =
//                barcodeCaptureSettings.getSymbologySettings(Symbology.CODE39);
//
//        HashSet<Short> activeSymbolCounts = new HashSet<>(
//                Arrays.asList(new Short[] { 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 }));
//
//        symbologySettings.setActiveSymbolCounts(activeSymbolCounts);

        // Create new barcode capture mode with the settings from above.
        barcodeCapture = BarcodeCapture.forDataCaptureContext(dataCaptureContext, barcodeCaptureSettings);
        barcodeCapture.setEnabled(true);
        barcodeCapture.getFeedback().setSuccess(
                new Feedback(barcodeCapture.getFeedback().getSuccess().getVibration(), false ? Sound.defaultSound() : null)
        );
        barcodeCapture.getFeedback().setSuccess(
                new Feedback(false ? Vibration.defaultVibration() : null, barcodeCapture.getFeedback().getSuccess().getSound())
        );
        // Register self as a listener to get informed whenever a new barcode got recognized.
        barcodeCapture.addListener(MainActivity.this);
        // To visualize the on-going barcode capturing process on screen, setup a data capture view
        // that renders the camera preview. The view must be connected to the data capture context.
        dataCaptureView = DataCaptureView.newInstance(MainActivity.this, dataCaptureContext);*/
    }


    /*   try {

           Intent intent = new Intent("com.google.zxing.client.android.SCAN");
           intent.putExtra("SCAN_MODE", "QR_CODE_MODE"); // "PRODUCT_MODE for bar codes

           startActivityForResult(intent, 0);

       } catch (Exception e) {

           Uri marketUri = Uri.parse("market://details?id=com.google.zxing.client.android");
           Intent marketIntent = new Intent(Intent.ACTION_VIEW,marketUri);
           startActivity(marketIntent);


       }*/


    private void loadUrlInWebView() {
        Map<String, String> extraHeaders = new HashMap<String, String>();
        extraHeaders.put("x-verification", mServer.getRandomHeader());
        String indexUrl = String.format("http://localhost:%d/index.html", mCurrentPortNumber);
        myWebView.loadUrl(indexUrl, extraHeaders);
    }


    private void downloadUpdates() {
        if (mIsDownloadingUpdates) {
            return;
        }
        mIsDownloadingUpdates = true;
        String url = "";
        //if(BuildConfig.FLAVOR.equals("demo")) { //Developer mode
//         url = "https://pdxpwa.s3.ap-southeast-1.amazonaws.com/build_test.zip";

//            url = "https://vidhi-notification-images.s3.ap-south-1.amazonaws.com/build_11_6_24.zip"; //build5
//       correct one is below
         url = "https://dragonfly-pwa.s3.eu-west-2.amazonaws.com/build_62d.zip";//"+version_number+".zip"; //build5
        /*}else{
            url = "https://pdxpwa.s3.ap-southeast-1.amazonaws.com/build4.zip";
        }*/
//       /**/
        btnDownloadFile.setVisibility(View.GONE);
        FileDownloader fdl = new FileDownloader(ContextCompat.getDataDir(this).getAbsolutePath(), url, "webapp.zip");
        fdl.setDownloaderCallback(new FileDownloader.DownloaderCallback() {
            @Override
            public void onProgress(int progress) {
                runOnUiThread(() -> {
                    downloadProgressUpdate(progress);
                    mIsDownloadingUpdates = true;
                });

            }


            @Override
            public void onFinish() {

                String unpackDirectory = ContextCompat.getDataDir(MainActivity.this).getAbsolutePath() + "/pwa_"+version_number+"/";
//               String unpackDirectory = ContextCompat.getDataDir(MainActivity.this).getAbsolutePath() + "/pwa_test/";

                String downloadDirUpdateFile = ContextCompat.getDataDir(MainActivity.this).getAbsolutePath() + "/webapp.zip";
                if (unpackZip(unpackDirectory, downloadDirUpdateFile)) {
                    runOnUiThread(() -> {
                        File file=new File(ContextCompat.getDataDir(getApplicationContext()).getAbsolutePath() + "/pwa_"+(version_number-1));
                        if(version_number>1)
                        {
                            deleteRecursive(file);
                            mServer.setVersionNumber(version_number);
                        }

                        Toast.makeText(MainActivity.this, "Download Completed and unzipping is successful too", Toast.LENGTH_SHORT).show();
                        loadUrlInWebView();
                        closeDownloadStatusDialog();
                        mIsDownloadingUpdates = false;
                        setData();
                        btnDownloadFile.setVisibility(View.GONE);
                    });

                } else {
                    Log.d("Unzip Failed", "Failed to unzip...");
                }
            }


            @Override
            public void onError(String message) {
                //display error on UI thread
                runOnUiThread(() -> {
//                    File file=new File(ContextCompat.getDataDir(getApplicationContext()).getAbsolutePath() + "/pwa_"+(version_number-1));
//
//                    if(file.exists())
//                    {
//                        Log.e("Download Failed...", message != null ? message : " ");
//                        Toast.makeText(MainActivity.this, "Download failed switching to older version.." + message, Toast.LENGTH_SHORT).show();
//                        version_number=version_number-1;
//                        Intent intent = new Intent(MainActivity.this, MainActivity.class);
//                        intent.putExtra("data", version_number);
//                        startActivity(intent);
//                        finish();
//
//                    }else
                    {
                        closeDownloadStatusDialog();
                        mIsDownloadingUpdates = true;
                        btnDownloadFile.setVisibility(View.VISIBLE);
                    }
               //     Toast.makeText(MainActivity.this, "Something went wrong..." + message, Toast.LENGTH_SHORT).show();
                });
                Log.d("Download Fail...", message != null ? message : " ");
            }
        });
        fdl.start();
    }

    private void deleteRecursive(File file) {
        if (file.isDirectory())
            for (File child : file.listFiles())
                deleteRecursive(child);

        file.delete();
    }

    private void setData() {
        Handler handler = new Handler(Looper.getMainLooper());
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                SharedPreferences prefs = getApplicationContext().
                        getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
                String json = prefs.getString("currentUser","");
                Users users = new Users();
                String data="";
                Gson gson = new Gson();
                if (!TextUtils.isEmpty(json)) {
                    users = gson.fromJson(json,
                            new TypeToken<Users>() {
                            }.getType());

                    data=users.getHeaterData();
                }else
                {
                    data = prefs.getString("loginData","");
                }

                //  String storeString=storeCurrentTime(json);
                myWebView.evaluateJavascript("javascript:setSaveJson(\'" + data + "\');",null);
                Log.e("status","app restated");
                Log.e("savedJson_first",json);
               checkUnuploadTest();//to upload unUploaded result

                // launchAuthO();
            }
        }, 1000);

    }

    private void closeDownloadStatusDialog() {
        if (downloadingUpdatesDialog != null)
            if (downloadingUpdatesDialog.isShowing())
                try {
                    downloadingUpdatesDialog.dismiss();
                    downloadingUpdatesDialog = null;
                } catch (Exception ex) {
                    // do nothing..
                }
    }

    Dialog downloadingUpdatesDialog;

    private void downloadProgressUpdate(int progress) {
        if (downloadingUpdatesDialog == null) {
            downloadingUpdatesDialog = new Dialog(MainActivity.this);
            downloadingUpdatesDialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
            downloadingUpdatesDialog.setCancelable(false);
            downloadingUpdatesDialog.setContentView(R.layout.dialog);
        }
        ProgressBar progressBarDownloadingUpdates = (ProgressBar) downloadingUpdatesDialog.findViewById(R.id.progress_horizontal);
        TextView downloadProgressStatusText = downloadingUpdatesDialog.findViewById(R.id.value123);

        progressBarDownloadingUpdates.setProgress(progress);
        downloadProgressStatusText.setText(String.format("Downloaded %d  ..", progress));
        if (!downloadingUpdatesDialog.isShowing())
            downloadingUpdatesDialog.show();

//        Window window = dialog.getWindow();
//        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
    }


    public static Boolean unzip(String sourceFile, String destinationFolder) {
        ZipInputStream zis = null;
        try {
            zis = new ZipInputStream(new BufferedInputStream(new FileInputStream(sourceFile)));
            ZipEntry ze;
            int count;
            byte[] buffer = new byte[BUFFER_SIZE];
            while ((ze = zis.getNextEntry()) != null) {
                String fileName = ze.getName();
                fileName = fileName.substring(fileName.indexOf("/") + 1);
                File file = new File(destinationFolder, fileName);
                File dir = ze.isDirectory() ? file : file.getParentFile();

                if (!dir.isDirectory() && !dir.mkdirs())
                    throw new FileNotFoundException("Invalid path: " + dir.getAbsolutePath());
                if (ze.isDirectory()) continue;
                FileOutputStream fout = new FileOutputStream(file);
                try {
                    while ((count = zis.read(buffer)) != -1)
                        fout.write(buffer, 0, count);
                } finally {
                    fout.close();
                }

            }
        } catch (IOException ioe) {
            Log.d(TAG, ioe.getMessage());
            return false;
        } finally {
            if (zis != null)
                try {
                    zis.close();
                } catch (IOException e) {

                }
        }
        return true;
    }

    private static boolean unpackZip(String path, String zipPath) {
        InputStream is;
        ZipInputStream zis;
        try {
            File basePath = new File(path);
            basePath.mkdir();
            String filename;
            is = new FileInputStream(zipPath);
            zis = new ZipInputStream(new BufferedInputStream(is));
            ZipEntry ze;
            byte[] buffer = new byte[1024];
            int count;

            while ((ze = zis.getNextEntry()) != null) {
                filename = ze.getName();

                // Need to create directories if not exists, or
                // it will generate an Exception...
                if (ze.isDirectory()) {
                    File fmd = new File(path + filename);
                    fmd.mkdirs();
                    continue;
                }

                FileOutputStream fout = new FileOutputStream(path + filename);

                while ((count = zis.read(buffer)) != -1) {
                    fout.write(buffer, 0, count);
                }

                fout.close();
                zis.closeEntry();
            }

            zis.close();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    //a receiver for a download to finish
    private BroadcastReceiver onDownloadComplete = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            //Fetching the download id received with the broadcast
            long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            //Checking if the received broadcast is for our enqueued download by matching download id n also unzipping if its downloaded
            String downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/pwa/";
            String downloadDirUpdateFile = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/pwa_new/update.zip";
            if (DownloadId == id && unpackZip(downloadDir, downloadDirUpdateFile)) {
                Toast.makeText(MainActivity.this, "Download Completed and unzipping is successful too", Toast.LENGTH_SHORT).show();
                loadUrlInWebView();
            }
        }
    };

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissons, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissons, grantResults);
        switch (requestCode) {
            case REQUEST_CODE_PERMISSION:
                if (grantResults.length > 0) {
                    boolean READ_EXTERNAL_STORAGE = grantResults[0] == PackageManager.PERMISSION_GRANTED;
                    boolean WRITE_EXTERNAL_STORAGE = grantResults[1] == PackageManager.PERMISSION_GRANTED;
                    boolean CAMERA_ALLOWED = grantResults[2] == PackageManager.PERMISSION_GRANTED;

                    if (READ_EXTERNAL_STORAGE && WRITE_EXTERNAL_STORAGE) {
//                        gmmAlgo.readMatFile("file:///android_asset/color_models.mat");
                        String downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/color_models.mat";
                        File modelfile = new File(downloadDir);
                        if(!modelfile.exists()){
                            //Copy all files here
                            //copyAssets();
                            FileUtils.copyFileFromRawToOthers(this, R.raw.color_models, downloadDir);

                            String downlo = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/color_models.mat";
                            File matfile = new File(downlo);
                            if(matfile.exists()) {

                            }else{
                                //Do this at the time of getting permission
                            }
                        }
                    }

                    if(CAMERA_ALLOWED){
                        loadUrlInWebView();
                    }
                }
                break;
            case PERMISSON_STORAGE_CODE: {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                    startDownloadingFiles();
                    gmmAlgo.readMatFile("file:///android_asset/color_models.mat");

                    String downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/color_models.mat";
                    File modelfile = new File(downloadDir);
                    if(!modelfile.exists()){
                        //Copy all files here
                        //copyAssets();
                        FileUtils.copyFileFromRawToOthers(this, R.raw.color_models, downloadDir);
                        String downlo = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/color_models.mat";
                        File matfile = new File(downlo);
                        if(matfile.exists()) {
                        }else{
                            //Do this at the time of getting permission
                        }
                    }
                } else {
                    //Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show();
                }
            }
            break;
            case PERMISSON_CAMERA_CODE:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    loadUrlInWebView();
                } else {
                    //Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show();
                }
            break;
            case PERMISSION_CODE:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                requestIgnoreBatteryOptimization();
                    if (mDeviceSearchCallBack!= null)
                        searchForBluetoothDeviceNew(mDeviceSearchCallBack);
                } else {
                //requestBluetoothPermissions();
                //    Toast.makeText(this, "The bluetooth function is disabled for this version", Toast.LENGTH_LONG).show();
                    Log.d("DRAGONFLY_LOG", "The bluetooth function is disabled for this version");
                }
                break;
            default:
              break;
        }
    }


    WebViewClient webClient = new WebViewClient() {
        @Nullable
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            return super.shouldInterceptRequest(view, request);
        }

        // Override page so it's load on my view only
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {

            return false;
        }


        @Override
        public void onPageStarted(WebView view, String url, Bitmap facIcon) {
        }

        @Override
        public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
            handler.proceed();
        }

        @Override
        public void onPageFinished(WebView view, String url) {

        }
    };

    @Override
    public void handleResult(Result rawResult) {

    }

    public static void setTimeout(Runnable runnable, int delay){
        new Thread(() -> {
            try {
                Thread.sleep(delay);
                runnable.run();
            }
            catch (Exception e){
                System.err.println(e);
            }
        }).start();
    }

    String latestDataMatrixResult = "";

    @Override
    public void framesFromHtmlCamera(Bitmap frame, boolean isQrCodeMode) {
        Log.d("htmlFrame", "Got bitmap");
        /*if (aiAlgo == null) {
            return;
        }*/
        isQrProcess=isQrCodeMode;
        if (gmmAlgo == null) {
            return;
        }
        //start QrCodeRecognition
        startQrCodeRecognitionForFrame(frame, isQrCodeMode);
        if (!isQrCodeMode) {
            if(!TextUtils.isEmpty(dataMatrixString))

            {
                gmmAlgo = new Gmmdetection(getApplicationContext());
           //     gmmAlgo.readMatFile("file:///android_asset/color_models.mat");
                new Thread(new Runnable() {
                    @Override
                    public void run() {
//                    HashMap<Rect, Integer> perTestTubeHueContainer = openCvAlgo.run(frame);
//                    Bitmap bitmap = openCvAlgo.run(frame);
                        //flashLightOn();
                        //aiAlgo.setBitmap(frame);
                        //aiAlgo.startDetect();

                        Bitmap resultimg = null;
                        try {
                            resultimg = gmmAlgo.findColorsGMMCrop(frame);
                        }catch(Exception e){
                            resultimg = null;
                        }
                        JSONObject jsonObject=new JSONObject();

                     if(resultimg != null)
                        {
                            Log.e("alorithmImage","called");
                            String encoded="";
                            algorithmOutput.setImage(resultimg);
                            if(resultimg != null) {
                                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                resultimg.compress(Bitmap.CompressFormat.JPEG, 90, baos); // bm is the bitmap object
                                byte[] b = baos.toByteArray();
                                encoded = Base64.encodeToString(b, Base64.NO_WRAP);
                            }
                            try {
                                jsonObject.put("result","");
                                jsonObject.put("image","data:image/png;base64," +
                                        encoded);
                                jsonObject.put("error","");
                                jsonObject.put("datamatrix",dataMatrixString);

                            } catch (JSONException e) {
                                e.printStackTrace();
                            }

                            Log.e("alorithemOutput","called");
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    if(algorithmOutput != null) {
                                        Log.e("algorithemOutPut",jsonObject.toString());
                                        String json=jsonObject.toString();
                                        String  json1=json.replace("\"", "\\\"");
                                      //  myWebView.evaluateJavascript("javascript:setSaveJson(\'" + json + "\');",null);
                                        Log.e("alorithemOutput","called");
                                        myWebView.evaluateJavascript("javascript:algoritmOutput(\'" + json1 + "\');", null);
                                        dataMatrixString="";
                                        //resultimg.recycle(); //Cleaning up the bitmap
//                                algorithmOutputModels_array.add(algorithmOutput);
//                                 Log.e("algorithmOutputModels_array",algorithmOutputModels_array.size()+"");
//                                 Toast.makeText(getApplicationContext(),"called"+algorithmOutputModels_array.size(),Toast.LENGTH_SHORT).show();
//                                if(algorithmOutputModels_array.size()>2)
//                                {
//
//                                    String avg_dataToString=calculateAvg(algorithmOutputModels_array);
//                                    Log.e("avgdata",avg_dataToString);
//                                    myWebView.evaluateJavascript("javascript:algoritmOutput(\'" + avg_dataToString + "\');", null);
//                                    algorithmOutputModels_array.clear();
//
//                                }
                                        algorithmOutput.setAlgorithm(null);
                                        //setTimeout(() -> flashLightOff(), 1000);
                                    }
                                    if (result != null) {
                                        mImageView.setMinimumHeight(result.getHeight());
                                        mImageView.setMinimumWidth(result.getWidth());
                                        mImageView.setImageBitmap(result);
                                        if(BuildConfig.FLAVOR.equals("demo")) { //Developer mode
                                            mImageView.setVisibility(View.VISIBLE);
                                        }
                                    }
//                            try {
//                                if (perTestTubeHueContainer != null || perTestTubeHueContainer.size() > 4) {
//                                    StringBuilder sb = new StringBuilder();
//
//                                    for (Rect key : perTestTubeHueContainer.keySet()) {
//                                        sb.append(perTestTubeHueContainer.get(key));
//                                        sb.append(",");
//                                    }
//                                    Toast.makeText(MainActivity.this, sb.toString(), Toast.LENGTH_LONG).show();
////                perTestTubeHueContainer.clear();
//                                }
//                            } catch (Exception ex) {
//                                ex.printStackTrace();
//                            }
                                }
                            });
                        }
                         else
                            {
                         algorithmOutput.setAlgorithm(null);
                         if(resultimg != null){
                             resultimg.recycle(); //clean up
                         }
                        }
//                    List<Integer> listOfHues = gmmAlgo.findColorsGMM(frame);//hueResult;//aiAlgo.getResult();//openCvAlgo.run(frame);
//                    if(listOfHues != null) {
//                        algorithmOutput.setAlgorithm(listOfHues);
//                        hueResult = null;
//                    }else{
//                        algorithmOutput.setAlgorithm(null);
//                    }
//                        Gson g = new Gson();
//                        String dataJsonString = g.toJson(algorithmOutput);


//                    if(listOfHues != null){
//
//                        Log.i("test", dataJsonString);
//                    }


                      //  Log.e("image",algorithmOutput.getImage());

                    }
                }).start();
            }

        }
        //frame.recycle(); //clean bitmap here

       /* mImageView.setMinimumHeight(frame.getHeight());
        mImageView.setMinimumWidth(frame.getWidth());
        mImageView.setImageBitmap(frame);*/
    }

    private String calculateAvg(ArrayList<AlgorithmOutputModel> algorithmOutputModels_array) {
        String res="";
        for (AlgorithmOutputModel a:algorithmOutputModels_array)
        {
            Log.e("result",a.getAlgorithm()+"");
        }
        ArrayList<AlgorithmOutputModel>temp=algorithmOutputModels_array;
        List<Integer> l1 = new LinkedList<>();
        ArrayList<Key_value>key_values=new ArrayList<>();
        List<Integer> l2= new ArrayList<Integer>();
        for(int i=0;i<temp.size();i++)
        {
            l1.clear();
            int repeatCount=0;
            l1.addAll(temp.get(i).getAlgorithm());
            for(int j=i+1;j<temp.size();j++)
            {
                l2.clear();
                l2.addAll(temp.get(j).getAlgorithm());
                if(l1.equals(l2))
                {
                  temp.remove(j);
                  repeatCount++;
                }else
                {

                }


            }
            key_values.add(new Key_value(repeatCount,temp.get(i)));
        }
        int largeValue=0;
        int index=0;
        for (int x=0;x<key_values.size();x++)
        {

            Log.e("avgCal",key_values.get(x).getKey()+"---"+key_values.get(x).getValue().getAlgorithm());
            if(x==0)
            {
                largeValue=key_values.get(x).getKey();
                index=x;
            }
             else
            {
                if(key_values.get(x).getKey()>largeValue)
                {
                    largeValue=key_values.get(x).getKey();
                    index=x;
                }
            }
        }

        Gson g = new Gson();
        res = g.toJson(key_values.get(index).getValue());
        return res;

    }

    private void flashLightOff() {
        CameraManager cameraManager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
        try {
            String cameraId = cameraManager.getCameraIdList()[0];
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                cameraManager.setTorchMode(cameraId, false);
            }
        } catch (CameraAccessException e) {
        }catch (IllegalArgumentException e) {
        }
    }

    private void flashLightOn() {
        CameraManager cameraManager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
        try {
            String cameraId = cameraManager.getCameraIdList()[0];
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                cameraManager.setTorchMode(cameraId, true);
                }
            } catch (CameraAccessException e) {
            }catch (IllegalArgumentException e) {
            }
    }


    private void startQrCodeRecognitionForFrame(Bitmap frame, boolean isQrCodeMode) {
        if(dataCaptureContext == null){
            dataCaptureContext = DataCaptureContext.forLicenseKey(Constants.SCANDIT_LICENSE_KEY);
//          InputStream imageStream = this.getResources().openRawResource(R.raw.image);
//          Bitmap bitmap = BitmapFactory.decodeStream(imageStream);
            BarcodeCaptureSettings barcodeCaptureSettings = new BarcodeCaptureSettings();

            barcodeCaptureSettings.setCodeDuplicateFilter(TimeInterval.millis(2000));
            HashSet<Symbology> symbologies = new HashSet<>();
            symbologies.add(Symbology.QR);
            symbologies.add(Symbology.CODE128);
            symbologies.add(Symbology.DATA_MATRIX);
            barcodeCaptureSettings.enableSymbologies(symbologies);
            barcodeCapture = BarcodeCapture.forDataCaptureContext(dataCaptureContext, barcodeCaptureSettings);
            barcodeCapture.setEnabled(true);
            barcodeCapture.getFeedback().setSuccess(new Feedback(barcodeCapture.getFeedback().getSuccess().getVibration(), false ? Sound.defaultSound() : null)
            );
            barcodeCapture.getFeedback().setSuccess(
                    new Feedback(false ? Vibration.defaultVibration() : null, barcodeCapture.getFeedback().getSuccess().getSound())
            );
            // Register self as a listener to get informed whenever a new barcode got recognized.
            barcodeCapture.addListener(MainActivity.this);
            // To visualize the on-going barcode capturing process on screen, setup a data capture view
            // that renders the camera preview. The view must be connected to the data capture context.
            dataCaptureView = DataCaptureView.newInstance(MainActivity.this, dataCaptureContext);
        }
        new Thread(() -> {
         initializeAndStartBarcodeScanning(frame);
      // setQrCodeScanner(frame, 0, isQrCodeMode);
        }).start();
    }

    @Override
    public void cameraReadyToRecord() {
        if (requestPermissionRequired()) {
            myWebView.post(() -> {
                myWebView.evaluateJavascript("javascript:startCapturingFrames(5);", null);

            });
        }
    }

    private boolean requestPermissionRequired() {
        boolean allperms = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            allperms = false;
            if(checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED)
            {
                allperms = true;
            }else
            {
                requestPermissions(  new String[]{Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_BACKGROUND_LOCATION,Manifest.permission.BLUETOOTH,Manifest.permission.BLUETOOTH_SCAN,Manifest.permission.BLUETOOTH_CONNECT,Manifest.permission.BLUETOOTH_PRIVILEGED}, PERMISSON_CAMERA_CODE);
                allperms = false;
            }
            allperms = false;
            if(checkSelfPermission(Manifest.permission.BLUETOOTH)==PackageManager.PERMISSION_GRANTED)
            {
                allperms = true;
            }else
            {
                requestPermissions(new String[]{Manifest.permission.BLUETOOTH}, PERMISSON_STORAGE_CODE);
                allperms = false;
            }
            allperms = false;
            if(checkSelfPermission(Manifest.permission.BLUETOOTH_SCAN)==PackageManager.PERMISSION_GRANTED)
            {
                allperms = true;
            }else
            {
                requestPermissions(new String[]{Manifest.permission.BLUETOOTH_SCAN}, PERMISSON_STORAGE_CODE);
                allperms = false;
            }
            allperms = false;
            if(checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT)==PackageManager.PERMISSION_GRANTED)
            {
                allperms = true;
            }else
            {
                requestPermissions(new String[]{Manifest.permission.BLUETOOTH_CONNECT}, PERMISSON_STORAGE_CODE);
                allperms = false;
            }
            allperms = false;
            if(checkSelfPermission(Manifest.permission.BLUETOOTH_PRIVILEGED)==PackageManager.PERMISSION_GRANTED)
            {
                allperms = true;
            }else
            {
                requestPermissions(new String[]{Manifest.permission.BLUETOOTH_PRIVILEGED}, PERMISSON_STORAGE_CODE);
                allperms = false;
            }
            allperms = false;

            if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                allperms = true;
            } else {
                requestPermissions(new String[]{Manifest.permission.CAMERA}, PERMISSON_CAMERA_CODE);
                allperms = false;
            }
            allperms = false;
            if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                allperms = true;
            } else {
                requestPermissions(new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, PERMISSON_STORAGE_CODE);
                allperms = false;
            }
            allperms = false;
            if (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                allperms = true;
            } else {
                requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, PERMISSON_STORAGE_CODE);
                allperms = false;
            }

        } else {
            return true;
        }
        return allperms;
    }

    @Override
    public void cameraStoppedRecording() {
        Log.e("Camera","Stop Camera Called");


        if(barcodeCapture != null) {
            barcodeCapture.setEnabled(false);
            barcodeCapture.removeListener(this);
        }
        if(dataCaptureContext != null) {
            dataCaptureContext.removeMode(barcodeCapture);
            barcodeCapture = null;
            dataCaptureContext = null;
        }
    }

    @Override
    public void showNewVersionDownloadButton(boolean autoDownload) {
        runOnUiThread(() -> {
            if (!autoDownload) {
                btnDownloadFile.setVisibility(View.VISIBLE);
            } else {
                btnDownloadFile.performClick();
            }
        });

    }

//    private void setQrCodeScanner(Bitmap frame, int rotationDegrees, boolean isQrCodeMode) {
////        if (isCameraReleased) {
////            return;
////        }
//        Log.d("StartingQr", "starting qr scan");
//        try {
//            BarcodeScannerOptions options =
//                    new BarcodeScannerOptions.Builder()
//                            .setBarcodeFormats(
//                                    Barcode.FORMAT_DATA_MATRIX, Barcode.FORMAT_QR_CODE)
//                            .build();
//
//            InputImage input = InputImage.fromBitmap(frame, rotationDegrees);
////            InputImage input = InputImage.fromByteArray(frame, width, height, rotationDegrees, InputImage.IMAGE_FORMAT_NV21);
//
//            BarcodeScanner scanner = BarcodeScanning.getClient(options);
//            Task<List<Barcode>> result = scanner.process(input)
//                    .addOnSuccessListener(new OnSuccessListener<List<Barcode>>() {
//                        @Override
//                        public void onSuccess(List<Barcode> barcodes) {
//                            // Task completed successfully
//                            // ...
//
//                            for (Barcode oneBarCode :
//                                    barcodes) {
//                                String rawValue = oneBarCode.getRawValue();
//                                if (rawValue == null) {
//                                    continue;
//                                }
//                                runOnUiThread(() -> {
//                                    myWebView.post(() -> {
//                                        if (isQrCodeMode)
//                                            myWebView.evaluateJavascript("javascript:qrCodeOutput(\'" + rawValue + "\');", null);
//                                        else {
//                                            latestDataMatrixResult = rawValue;
//                                            Toast.makeText(MainActivity.this, rawValue, Toast.LENGTH_SHORT).show();
//                                            algorithmOutput.setDatamatrix(rawValue);
//                                            myWebView.evaluateJavascript("javascript:dataMatrixOutPut(" + rawValue + ");", null);
//                                        }
//
//                                    });
//                                });
//                                Log.d("OneBarCodeValue", rawValue);
//                            }
//
//                        }
//                    })
//                    .addOnFailureListener(new OnFailureListener() {
//                        @Override
//                        public void onFailure(@NonNull Exception e) {
//                            // Task failed with an exception
//                            // ...
//                            e.printStackTrace();
//                        }
//                    });
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            Log.d("QrParserImage", ex.toString());
//        }
//    }

    private void startServer() {

        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        version_number = prefs.getInt("currentVersion",57);
        int portNumber = generateRandomPort();

        mServer = new HttpFileServer(portNumber, this,version_number);

        try {
            mServer.start();
            mCurrentPortNumber = portNumber;

            } catch (IOException e) {
            e.printStackTrace();
             }

    }

    private void proceednext() {
        startServer();
    }


    private int generateRandomPort() {
        Random rn = new Random();
        int randomPort = 3000 + rn.nextInt(6000);
        return randomPort;

    }

    private void copyAssets() {
        AssetManager assetManager = getAssets();
        String[] files = null;
        try {
            files = assetManager.list("");
        } catch (IOException e) {
            Log.e("tag", e.getMessage());
        }
        for (String filename : files) {
            Log.d("File name => ", filename);
            InputStream in = null;
            OutputStream out = null;
            try {
                in = assetManager.open("static/" + filename);   // if files resides inside the "Files" directory itself
                out = new FileOutputStream(ContextCompat.getDataDir(this).getPath() + "/" + filename);
                copyFile(in, out);
                in.close();
                in = null;
                out.flush();
                out.close();
                out = null;


            } catch (Exception e) {
                Log.e("tag", e.getMessage());
            }
        }
    }

    private void copyFile(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];
        int read;
        while ((read = in.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }
    }

    protected void onResume() {
        super.onResume();
        Log.e("MainActivity","app is foreground");

        if(bitmapFrameSource!=null)
        {
          //  barcodeCapture.setEnabled(true);
      //      bitmapFrameSource.switchToDesiredState(FrameSourceState.ON,null);
        }
      //  gmmAlgo.readMatFile("");
    }

    private void setValueToReact() {
        if(myWebView != null) {
            Handler handler = new Handler(Looper.getMainLooper());
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    SharedPreferences prefs = getApplicationContext().
                            getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
                    String json = prefs.getString("CurrentUser","");
                    Users users = new Users();
                    String data="";
                    Gson gson = new Gson();
                    if (!TextUtils.isEmpty(json)) {
                        users = gson.fromJson(json,
                                new TypeToken<Users>() {
                                }.getType());

                        data=users.getHeaterData();
                    }
                    if(TextUtils.isEmpty(data)||data.equalsIgnoreCase("null"))
                    {
                        data = prefs.getString("loginData","");
                    }
                    data=insertCurrentVersion(data);
                    data = insertSampleTPData(data);
                    // json="{\"AdvData\":{\"useAdvHeaterStoreData\":{\"AdvHeater\":{\"a\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"HeaterId\":[\"a\"],\"allHeaters\":[0]},\"useAdvSampleStoreData\":{\"advSampleCompletedStep\":{\"1\":[]},\"advSamples\":{},\"advSamplesPos\":{},\"samplesNo\":[1],\"samplesReadyForCapture\":[]},\"useAdvSampleTimerStoreData\":{\"AdvSampleTimerPos\":{\"1\":{\"DRY_1\":{\"isPlaying\":false,\"timer\":30},\"Elution_1\":{\"isPlaying\":false,\"timer\":30},\"LYSIS_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_2\":{\"isPlaying\":false,\"timer\":30}}}},\"useAdvTestDataStoreData\":{\"advSampleID\":{},\"advSamplePrepKit\":{\"16436530658\":\"\"},\"advTestPanelID\":{\"16436530658\":\"\"}},\"useAdvTimerStoreData\":{\"activeTimer\":1643653073,\"incubationTimer\":{\"16436530658\":3},\"timerForSamplePos\":{\"16436530658\":{\"heaterTimerEndsAt\":1643653075,\"isPaused\":false,\"pausedAt\":1643653070,\"timerInsertedAt\":1643653070}}}},\"BegData\":{\"useHeaterStoreData\":{\"heater\":{\"1\":\"16436530658\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"useSampleStoreData\":{\"samplePos\":{\"16436530658\":\"1\"},\"samples\":[{\"id\":\"16436530658\"}],\"timeExceededSamples\":{},\"timerMapper\":{},\"voidSamples\":[]}},\"LoginData\":{\"isLogin\":true},\"LoginInfo\":null}";
                    //  String storeString=storeCurrentTime(json);
                    myWebView.evaluateJavascript("javascript:setSaveJson(\'" + data + "\');", new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String s) {
                            if(!s.equalsIgnoreCase("true"))
                            {
                                Log.e("created","value modified");
                                created=1;
                                Handler handler = new Handler(Looper.getMainLooper());
                                handler.postDelayed(new Runnable() {
                                    @Override
                                    public void run() {
                                       setValueToReact();
                                    }
                                },500);
                            }
                            Log.e("return",s);
                        }
                    });
                    Log.e("status","app restated");
                    Log.e("savedJson",json);
                    checkUnuploadTest();//to upload unUploaded result
                    //      getDashBoard();
                    // launchAuthO();
//                    gmmAlgo.readMatFile("");
                }
            }, 2000);
        }
    }

    private String insertCurrentVersion(String data) {
        String res=data;
        try {
            JSONObject jsonObject=new JSONObject(data);
            if(jsonObject.has("LoginInfo")&&jsonObject.get("LoginInfo")instanceof JSONObject)
            {
                JSONObject jsonObject1=jsonObject.getJSONObject("LoginInfo");
                if(jsonObject1.has("current_version"))
                {
                    jsonObject1.remove("current_version");
                }
                jsonObject1.put("current_version",version_number);
                res=jsonObject.toString();
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return res;
    }

    private String insertSampleTPData(String data) {
        String res=data;
        try {
            JSONObject jsonObject=new JSONObject(data);
            JSONObject tempjs = new JSONObject(sample_testpanel_ids);
            jsonObject.put("sample_testpanel_ids",tempjs);
//            res = jsonObject.toString().replace("\\", "");
            res = jsonObject.toString();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return res;
    }

    public void dashboardofflinecall()
    {
        Log.e("ofline Dashboard Called","called");

        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        SharedPreferences.Editor edit = prefs.edit();

        //  String json="{\"AdvData\":{\"useAdvHeaterStoreData\":{\"AdvHeater\":{\"a\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"HeaterId\":[\"a\"],\"allHeaters\":[0]},\"useAdvSampleStoreData\":{\"advSampleCompletedStep\":{\"1\":[]},\"advSamples\":{},\"advSamplesPos\":{},\"samplesNo\":[1],\"samplesReadyForCapture\":[]},\"useAdvSampleTimerStoreData\":{\"AdvSampleTimerPos\":{\"1\":{\"DRY_1\":{\"isPlaying\":false,\"timer\":30},\"Elution_1\":{\"isPlaying\":false,\"timer\":30},\"LYSIS_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_2\":{\"isPlaying\":false,\"timer\":30}}}},\"useAdvTestDataStoreData\":{\"advSampleID\":{},\"advSamplePrepKit\":{},\"advTestPanelID\":{}},\"useAdvTimerStoreData\":{\"activeTimer\":1643651249,\"incubationTimer\":{},\"timerForSamplePos\":{}}},\"BegData\":{\"useHeaterStoreData\":{\"heater\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"useSampleStoreData\":{\"samplePos\":{},\"samples\":[],\"timeExceededSamples\":{},\"timerMapper\":{},\"voidSamples\":[]}},\"LoginData\":{\"isLogin\":true},\"LoginInfo\":{\"auth0_user_id\":\"auth0|61f434e7c725130071fe3f78\",\"auth_data\":{\"debug_run\":true,\"user_agent\":\"WPF APP\"},\"created_at\":\"2022-01-28T18:24:40.085979\",\"id\":\"61f434e8f4341a8a875337ea\",\"no_of_test_runs\":0,\"org_id\":\"61dea2a75bb5036a7ccd0daf\",\"test_runs\":2,\"updated_at\":\"2022-01-28T18:24:40.085993\"}}";
        String json = prefs.getString("users_raw","");

        runOnUiThread(() -> {
            myWebView.post(() -> {
             //   myWebView.evaluateJavascript("javascript:setSaveJson(\'" + json + "\');",null);
             myWebView.evaluateJavascript("javascript:getOfflineData(\'" + json + "\');", null);
            });
        });
        edit.apply();
        edit.commit();
        Log.e("ofline Dashboard Called",json);
    }
    @Override
    protected void onPause() {
        super.onPause();
        Log.e("status","app went backgound");
        if(!logoutCalled)
         setSaveState();
        if(bitmapFrameSource!=null)
        {
            bitmapFrameSource.switchToDesiredState(FrameSourceState.OFF,null);
            barcodeCapture.setEnabled(false);
        }

        // can use edit.apply() but in this case commit is better
    }
    public void setSaveState() {

        myWebView.evaluateJavascript("javascript:getSaveJson();", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String s) {
                  if(!s.equalsIgnoreCase("null"))
                  {
                      SharedPreferences prefs = getApplicationContext().
                              getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
                      SharedPreferences.Editor edit = prefs.edit();

                      //  String json="{\"AdvData\":{\"useAdvHeaterStoreData\":{\"AdvHeater\":{\"a\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"HeaterId\":[\"a\"],\"allHeaters\":[0]},\"useAdvSampleStoreData\":{\"advSampleCompletedStep\":{\"1\":[]},\"advSamples\":{},\"advSamplesPos\":{},\"samplesNo\":[1],\"samplesReadyForCapture\":[]},\"useAdvSampleTimerStoreData\":{\"AdvSampleTimerPos\":{\"1\":{\"DRY_1\":{\"isPlaying\":false,\"timer\":30},\"Elution_1\":{\"isPlaying\":false,\"timer\":30},\"LYSIS_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_2\":{\"isPlaying\":false,\"timer\":30}}}},\"useAdvTestDataStoreData\":{\"advSampleID\":{},\"advSamplePrepKit\":{},\"advTestPanelID\":{}},\"useAdvTimerStoreData\":{\"activeTimer\":1643651249,\"incubationTimer\":{},\"timerForSamplePos\":{}}},\"BegData\":{\"useHeaterStoreData\":{\"heater\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"useSampleStoreData\":{\"samplePos\":{},\"samples\":[],\"timeExceededSamples\":{},\"timerMapper\":{},\"voidSamples\":[]}},\"LoginData\":{\"isLogin\":true},\"LoginInfo\":{\"auth0_user_id\":\"auth0|61f434e7c725130071fe3f78\",\"auth_data\":{\"debug_run\":true,\"user_agent\":\"WPF APP\"},\"created_at\":\"2022-01-28T18:24:40.085979\",\"id\":\"61f434e8f4341a8a875337ea\",\"no_of_test_runs\":0,\"org_id\":\"61dea2a75bb5036a7ccd0daf\",\"test_runs\":2,\"updated_at\":\"2022-01-28T18:24:40.085993\"}}";
                      String json = prefs.getString("CurrentUser","");
                      Users users = new Users();

                      Gson gson = new Gson();
                      if (!TextUtils.isEmpty(json)) {
                          users = gson.fromJson(json,
                                  new TypeToken<Users>() {
                                  }.getType());


                      }
                      String temp=checkLoginInfo(s);
                      users.setHeaterData(temp);
                      // edit.clear();
                      if (prefs.contains("CurrentUser")) {
                          edit.remove("CurrentUser");

                      }
                      edit.putString("CurrentUser", gson.toJson(users));
                      edit.apply();

                      Log.e("savedJson",s);
                      edit.commit();

                  }
                //String res= createJson(s);


            }






        });

    }

    private String checkLoginInfo(String s) {

   //   s="{\"AdvData\":{\"useAdvHeaterStoreData\":{\"AdvHeater\":{\"a\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"HeaterId\":[\"a\"],\"allHeaters\":[0]},\"useAdvSampleStoreData\":{\"advSampleCompletedStep\":{},\"advSamples\":{},\"advSamplesPos\":{},\"samplesNo\":[],\"samplesReadyForCapture\":[]},\"useAdvSampleTimerStoreData\":{\"AdvSampleTimerPos\":{}},\"useAdvTestDataStoreData\":{\"advSampleID\":{},\"advSamplePrepKit\":{},\"advTestPanelID\":{}},\"useAdvTimerStoreData\":{\"activeTimer\":1650612391,\"incubationTimer\":{},\"timerForSamplePos\":{}}},\"BegData\":{\"useHeaterStoreData\":{\"begSamples\":{},\"heater\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"useSampleStoreData\":{\"samplePos\":{},\"samples\":[],\"timeExceededSamples\":{},\"timerMapper\":{},\"voidSamples\":[]}},\"LoginData\":{\"isLogin\":false},\"LoginInfo\":null,\"Mode\":{\"mode\":false}}";
        try {
            JSONObject jsonObject=new JSONObject(s);
            if (!(jsonObject.has("LoginInfo")&&jsonObject.get("LoginInfo")instanceof JSONObject))
            {

                {
                    SharedPreferences prefs = getApplicationContext().
                            getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
                    String json = prefs.getString("loginData","");
                    JSONObject jsonObject1=new JSONObject(json);
                    JSONObject jsonObject2=jsonObject1.getJSONObject("LoginInfo");
                    jsonObject.remove("LoginInfo");
                    jsonObject.put("LoginInfo",jsonObject2);
                    s=jsonObject.toString();
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
       return s;
    }


    private String createJson(String result) {
        Log.e("creatJson","called");
        JSONObject jsonObject=new JSONObject();
        JSONObject loginObject=new JSONObject();
        JSONObject userObject=new JSONObject();
        try {
            loginObject.put("isLogin",true);


            jsonObject.put("LoginData",loginObject);
            jsonObject.put("LoginInfo",new JSONObject(result));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.e("stringJson",jsonObject.toString());
        return jsonObject.toString();
    }
    private void checkUnuploadTest() {


        String token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Mzc0MDA4ODcsIm5iZiI6MTYzNzQwMDg4NywianRpIjoiYjdiNTc3YWItMjI0Mi00NDYxLThmNGItNzJkZjc0ZjJjMjE2IiwiZXhwIjoxNjM3NDAxNzg3LCJpZGVudGl0eSI6IlZpdjIwMjEtMTEtMjBUMDk6MzQ6NDcuNjA5MzE1IiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hetnuDSYFlVQElAha6xn2wTWWaBAIrY3swztuNOr6-E";

        ArrayList<TestResults>testResults= BackgroundService.getAllTest(getApplicationContext(),token);
        Log.e("unUploadedResult",testResults.size()+"");
        if(testResults.size()!=0)
        {
            scheduleJob();
        }
        if ((progressBar != null) && progressBar.isShowing()&&!MainActivity.this.isFinishing()) {
            progressBar.dismiss();
            progressBar = null;
        }
    }

    private void scheduleJob() {
        jobScheduler = (JobScheduler) getSystemService(JOB_SCHEDULER_SERVICE);
        ComponentName jobService = new ComponentName(getPackageName(), UploadService.class.getName());
        JobInfo jobInfo = new JobInfo.Builder(MYJOBID, jobService).setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY).build();
        jobScheduler.schedule(jobInfo);

    }
    public void switchUser()
    {
        callFrm1="switchUser";
        logoutCall();

//        userDialog = new Dialog(MainActivity.this);
//        userDialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
//        userDialog.setCancelable(false);
//        userDialog.setContentView(R.layout.dialog_switch_user);
//        recyclerView=userDialog.findViewById(R.id.recyclerView);
//        ImageView closeImage;
//        closeImage=userDialog.findViewById(R.id.closeImg);
//        RecyclerView_switchUser recyclerView_switchUser;
//        //gethearter
//        runOnUiThread(() -> {
//            myWebView.post(() -> {
//
//                myWebView.evaluateJavascript("javascript:getSaveJson();", new ValueCallback<String>() {
//                    @Override
//                    public void onReceiveValue(String s) {
//
//                        SharedPreferences prefs = getApplicationContext().
//                                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
//                        SharedPreferences.Editor edit = prefs.edit();
//
//                        //  String json="{\"AdvData\":{\"useAdvHeaterStoreData\":{\"AdvHeater\":{\"a\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"HeaterId\":[\"a\"],\"allHeaters\":[0]},\"useAdvSampleStoreData\":{\"advSampleCompletedStep\":{\"1\":[]},\"advSamples\":{},\"advSamplesPos\":{},\"samplesNo\":[1],\"samplesReadyForCapture\":[]},\"useAdvSampleTimerStoreData\":{\"AdvSampleTimerPos\":{\"1\":{\"DRY_1\":{\"isPlaying\":false,\"timer\":30},\"Elution_1\":{\"isPlaying\":false,\"timer\":30},\"LYSIS_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_2\":{\"isPlaying\":false,\"timer\":30}}}},\"useAdvTestDataStoreData\":{\"advSampleID\":{},\"advSamplePrepKit\":{},\"advTestPanelID\":{}},\"useAdvTimerStoreData\":{\"activeTimer\":1643651249,\"incubationTimer\":{},\"timerForSamplePos\":{}}},\"BegData\":{\"useHeaterStoreData\":{\"heater\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"useSampleStoreData\":{\"samplePos\":{},\"samples\":[],\"timeExceededSamples\":{},\"timerMapper\":{},\"voidSamples\":[]}},\"LoginData\":{\"isLogin\":true},\"LoginInfo\":{\"auth0_user_id\":\"auth0|61f434e7c725130071fe3f78\",\"auth_data\":{\"debug_run\":true,\"user_agent\":\"WPF APP\"},\"created_at\":\"2022-01-28T18:24:40.085979\",\"id\":\"61f434e8f4341a8a875337ea\",\"no_of_test_runs\":0,\"org_id\":\"61dea2a75bb5036a7ccd0daf\",\"test_runs\":2,\"updated_at\":\"2022-01-28T18:24:40.085993\"}}";
//                        String json = prefs.getString("currentUser","");
//                        Users users =new Users();
//
//                        Gson gson = new Gson();
//                        if (!TextUtils.isEmpty(json)) {
//                            users = gson.fromJson(json,
//                                    new TypeToken<Users>() {
//                                    }.getType());
//
//
//                        }
//                        if(users!=null)
//                        users.setHeaterData(s);
//                        Log.e("savedJson",s);
//                        if (prefs.contains("currentUser")) {
//                            edit.remove("currentUser");
//
//                        }
//                        edit.putString("currentUser", gson.toJson(users));
//
//
//
//                        LinkedHashMap<String,Users>userMap=Utils.getUserList(MainActivity.this);
//                        userMap.replace(users.getId(),users);
//                        if (prefs.contains("users")) {
//                            edit.remove("users");
//
//                        }
//
//                        edit.putString("users", gson.toJson(userMap));
//                        edit.apply();
//                        edit.commit();
//                    }
//
//
//
//
//
//
//                });
//
//
//            });
//        });
//
//        //saveittoheater
//
//        recyclerView_switchUser = new RecyclerView_switchUser(MainActivity.this, Utils.getUserList(MainActivity.this) );
//        recyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
//        recyclerView.setAdapter(recyclerView_switchUser);
//
//
//
////        Button dialogButton = (Button) dialog.findViewById(R.id.btn_dialog);
//        closeImage.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                Log.e("close","clicked");
//                userDialog.dismiss();
//            }
//        });
//
//         userDialog.show();

//        logoutCalled=true;
//        WebAuthProvider.logout(auth0).withScheme("demo").start(MainActivity.this, new Callback<Void, AuthenticationException>() {
//            @Override
//            public void onSuccess(Void unused) {
//
//                SharedPreferences prefs = getApplicationContext().
//                        getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
//                String json = prefs.getString("CurrentUser","");
//                Users users = new Users();
//                String data="";
//                Gson gson = new Gson();
//                if (!TextUtils.isEmpty(json)) {
//                    users = gson.fromJson(json,
//                            new TypeToken<Users>() {
//                            }.getType());
//                    users.setLogin(false);
//                    //   data=users.getHeaterData();
//                }
//                SharedPreferences.Editor edit = prefs.edit();
//
//                if (prefs.contains("CurrentUser")) {
//                    edit.remove("CurrentUser");
//
//                }
//                edit.putString("CurrentUser", gson.toJson(users));
//                edit.apply();
////                SharedPreferences prefs = getApplicationContext().getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
////                SharedPreferences.Editor edit = prefs.edit();
////                edit.clear();
////                edit.apply();
//                startActivity(new Intent(MainActivity.this,loginAuth.class));
//                finish();
//            }
//
//            @Override
//            public void onFailure(@NotNull AuthenticationException e) {
//
//            }
//        });
        Log.e("switchUser","iscalled");
    }
    public void logoutCall()
    {
        if(!logoutCalled)
        {
            runOnUiThread(() -> {
                progressBar=new ProgressDialog(MainActivity.this);
                progressBar.setMessage("Please wait");
                progressBar.show();
            });
            logoutCalled=true;
            removeLoginDataFromServer();
            WebAuthProvider.logout(auth0).withScheme("demo").start(MainActivity.this, new Callback<Void, AuthenticationException>() {
                @Override
                public void onSuccess(Void unused) {
                    if(callFrm1.equalsIgnoreCase("switchUser"))
                    {
                        callFrm1="";
                        myWebView.evaluateJavascript("javascript:getSaveJson();", new ValueCallback<String>() {
                            @Override
                            public void onReceiveValue(String s) {
                                if(s==null)
                                {}
                                //String res= createJson(s);
                                SharedPreferences prefs = getApplicationContext().
                                        getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
                                SharedPreferences.Editor edit = prefs.edit();

                                //  String json="{\"AdvData\":{\"useAdvHeaterStoreData\":{\"AdvHeater\":{\"a\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"HeaterId\":[\"a\"],\"allHeaters\":[0]},\"useAdvSampleStoreData\":{\"advSampleCompletedStep\":{\"1\":[]},\"advSamples\":{},\"advSamplesPos\":{},\"samplesNo\":[1],\"samplesReadyForCapture\":[]},\"useAdvSampleTimerStoreData\":{\"AdvSampleTimerPos\":{\"1\":{\"DRY_1\":{\"isPlaying\":false,\"timer\":30},\"Elution_1\":{\"isPlaying\":false,\"timer\":30},\"LYSIS_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_2\":{\"isPlaying\":false,\"timer\":30}}}},\"useAdvTestDataStoreData\":{\"advSampleID\":{},\"advSamplePrepKit\":{},\"advTestPanelID\":{}},\"useAdvTimerStoreData\":{\"activeTimer\":1643651249,\"incubationTimer\":{},\"timerForSamplePos\":{}}},\"BegData\":{\"useHeaterStoreData\":{\"heater\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"useSampleStoreData\":{\"samplePos\":{},\"samples\":[],\"timeExceededSamples\":{},\"timerMapper\":{},\"voidSamples\":[]}},\"LoginData\":{\"isLogin\":true},\"LoginInfo\":{\"auth0_user_id\":\"auth0|61f434e7c725130071fe3f78\",\"auth_data\":{\"debug_run\":true,\"user_agent\":\"WPF APP\"},\"created_at\":\"2022-01-28T18:24:40.085979\",\"id\":\"61f434e8f4341a8a875337ea\",\"no_of_test_runs\":0,\"org_id\":\"61dea2a75bb5036a7ccd0daf\",\"test_runs\":2,\"updated_at\":\"2022-01-28T18:24:40.085993\"}}";
                                String json = prefs.getString("CurrentUser","");
                                Users users = new Users();

                                Gson gson = new Gson();
                                if (!TextUtils.isEmpty(json)) {
                                    users = gson.fromJson(json,
                                            new TypeToken<Users>() {
                                            }.getType());

                                    users.setLogin(false);

                                }
                                users.setHeaterData(s);
                                // edit.clear();
                                if (prefs.contains("CurrentUser")) {
                                    edit.remove("CurrentUser");

                                }
                                edit.putString("CurrentUser", gson.toJson(users));
                                edit.apply();

                                Log.e("savedJson",s);
                                edit.commit();
                            }
                        });
//                        SharedPreferences prefs = getApplicationContext().
//                                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
//                        String json = prefs.getString("CurrentUser","");
//                        Users users = new Users();
//                        String data="";
//                        Gson gson = new Gson();
//                        if (!TextUtils.isEmpty(json)) {
//                            users = gson.fromJson(json,
//                                    new TypeToken<Users>() {
//                                    }.getType());
//                            users.setLogin(false);
//                            //   data=users.getHeaterData();
//
//                        }
//                        SharedPreferences.Editor edit = prefs.edit();
//
//                        if (prefs.contains("CurrentUser")) {
//                            edit.remove("CurrentUser");
//
//
//                        }
//                        edit.putString("CurrentUser", gson.toJson(users));
//                        edit.apply();
                        runOnUiThread(() -> {
                            progressBar.dismiss();
                        });
                        startActivity(new Intent(MainActivity.this,loginAuth.class));
                        finish();

                    }else
                    {

                        SharedPreferences prefs = getApplicationContext().
                                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
                        String json = prefs.getString("CurrentUser","");
                        Users users = new Users();
                        String data="";
                        Gson gson = new Gson();
                        if (!TextUtils.isEmpty(json)) {
                            users = gson.fromJson(json,
                                    new TypeToken<Users>() {
                                    }.getType());
                            users.setLogin(false);
                            //   data=users.getHeaterData();

                        }
                        SharedPreferences.Editor edit = prefs.edit();

                        if (prefs.contains("CurrentUser")) {
                            edit.remove("CurrentUser");

                        }
                        if (prefs.contains("loginData")) {
                            edit.remove("loginData");

                        }
                        edit.apply();
                        edit.commit();
                        runOnUiThread(() -> {
                            progressBar.dismiss();
                        });
                        startActivity(new Intent(MainActivity.this,loginAuth.class));
                        finish();
                    }


                }

                @Override
                public void onFailure(@NotNull AuthenticationException e) {
                    Log.e("logout","fail");
                }
            });
        }


        Log.e("logout","islcalled");
    }

    public void insertDataToDb(String json) {

        Log.e("dataFromReact",json);
        String token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Mzc0MDA4ODcsIm5iZiI6MTYzNzQwMDg4NywianRpIjoiYjdiNTc3YWItMjI0Mi00NDYxLThmNGItNzJkZjc0ZjJjMjE2IiwiZXhwIjoxNjM3NDAxNzg3LCJpZGVudGl0eSI6IlZpdjIwMjEtMTEtMjBUMDk6MzQ6NDcuNjA5MzE1IiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hetnuDSYFlVQElAha6xn2wTWWaBAIrY3swztuNOr6-E";
        String data="1234";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHH:mm:ss", Locale.getDefault());
        String currentDateandTime = sdf.format(new Date());
        Users users=Utils.getUser(getApplicationContext());
        BackgroundService.insertTest(new TestResults(users.getId(),json,currentDateandTime),getApplicationContext());

    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }

    @Override
    public void onBarcodeScanned(
            @NonNull BarcodeCapture barcodeCapture,
            @NonNull BarcodeCaptureSession session,
            @NonNull FrameData frameData
    ) {
        if (session.getNewlyRecognizedBarcodes().isEmpty())
            return;

        com.scandit.datacapture.barcode.data.Barcode barcode = session.getNewlyRecognizedBarcodes().get(0);

        // Stop recognizing barcodes for as long as we are displaying the result. There won't be any
        // new results until the capture mode is enabled again. Note that disabling the capture mode
        // does not stop the camera, the camera continues to stream frames until it is turned off.
        barcodeCapture.setEnabled(false);

        // If you are not disabling barcode capture here and want to continue scanning, consider
        // setting the codeDuplicateFilter when creating the barcode capture settings to around 500
        // or even -1 if you do not want codes to be scanned more than once.

        // Get the human readable name of the symbology and assemble the result to be shown.
        String symbology = SymbologyDescription.create(barcode.getSymbology()).getReadableName();
        final String result = barcode.getData();
        Log.e("dataMatrixResult",result);
         if(isQrProcess)
         {
             runOnUiThread(() -> {
                 myWebView.post(() -> {
//                     for(int k=0;k<result.length();k++){
//                         String t = "\\u" + Integer.toHexString(result.charAt(k) | 0x10000).substring(1);
//                         System.out.println(t);
//                     }

                     String [] finalresult = result.split("(?i)\u001D");
//                     if(finalresult.length != 3) { //older version
                         myWebView.evaluateJavascript("javascript:qrCodeOutput(\'" + result + "\');", null);
//                     }else{
//                         String testString = String.join("&", finalresult);
//                         myWebView.evaluateJavascript("javascript:qrCodeOutput(\'" + testString + "\');", null);
//                     }
                 });
             });
         }
         else
         {
             dataMatrixString=result;
         }

    }



    @Override
    public void onObservationStarted(@NotNull BarcodeCapture barcodeCapture) {
    Log.e("scanning","observaytionStarted");

//        InputStream imageStream = this.getResources().openRawResource(R.raw.image);
//        Bitmap bitmap = BitmapFactory.decodeStream(imageStream);
//        //   camera.switchToDesiredState(FrameSourceState.ON,null);
//        dataCaptureContext.setFrameSource(BitmapFrameSource.of(bitmap));
    }

    @Override
    public void onObservationStopped(@NotNull BarcodeCapture barcodeCapture) {
        barcodeCapture.getFeedback().toString();

    }

    @Override
    public void onSessionUpdated(@NotNull BarcodeCapture barcodeCapture, @NotNull BarcodeCaptureSession barcodeCaptureSession, @NotNull FrameData frameData) {

    }

    @Override
    public void onFrameOutput(@NotNull FrameSource frameSource, @NotNull FrameData frameData) {

    }

    @Override
    public void onObservationStarted(@NotNull FrameSource frameSource) {
    }

    @Override
    public void onObservationStopped(@NotNull FrameSource frameSource) {

    }
    @Override
    public void onStatusChanged(
            @NonNull DataCaptureContext dataCaptureContext, @NonNull ContextStatus contextStatus
    ) {
      boolean  isLicenseValid = contextStatus.isValid();
      if(isLicenseValid)
      {
          Log.e("isLicenseValid","true");
      }else {
          Log.e("isLicenseValid","false");
      }
    }
    @Override
    public void onStateChanged(@NotNull FrameSource frameSource, @NotNull FrameSourceState frameSourceState) {
        Log.e("frame","statechange");


    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        {
            if(progressBar != null&&progressBar.isShowing())
            {
                    progressBar.dismiss();
                    progressBar= null;
            }

        }
        if(myWebView!=null)
        {
            myWebView.destroy();
        }

    }
    public  void exportCSV(String json)
    {
        createNotificationChannel();
        Toast.makeText(getApplicationContext(),"Exporting to Dragonfly folder in downloads",Toast.LENGTH_LONG).show();
        try {
            JSONObject jsonObject=new JSONObject(json);
            if(jsonObject.has("data")&&jsonObject.get("data")instanceof JSONArray)
            {
                JSONArray jsonArray=jsonObject.getJSONArray("data");
                String[] rowArray = new String[jsonArray.length()+1];
                rowArray[0]="SampleID,SerialNo,Date,Time,User,Panel,DetectedTargets,Comments,flag,heatingExpired,prepkitExpired,testPanelExpired,image_captured";

                for(int j=0;j<jsonArray.length();j++)
                {
                    JSONObject mainObject=jsonArray.getJSONObject(j);
                    StringBuilder stringBuilder=new StringBuilder();
                    String dateString="",time="";
                    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:sss");
                    try {
                         Date date = format.parse((mainObject.has("created_at")?mainObject.getString("created_at"):""));
                         dateString = new SimpleDateFormat("MM/dd/yyyy").format(date);
                         time = new SimpleDateFormat("HH:mm:ss").format(date);


                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                    stringBuilder.append("\n"+(mainObject.has("sampleID")?mainObject.getString("sampleID"):"")+","
                            +mainObject.getString("serialNo")+","
                            +dateString+","
                            +time+","
                            + (mainObject.has("name")?mainObject.getString("name"):",") +","+
                               getPanelName(mainObject.getString("testerId"))+","+getDetectedTargets(mainObject)+","+
                            (mainObject.has("comments")?mainObject.getString("comments"):"")+","+
                            (mainObject.has("flag")?mainObject.getBoolean("flag"):"")+","+
                            (mainObject.has("heatingexpired")?mainObject.getBoolean("heatingexpired"):"")+","+
                            (mainObject.has("prepkitexpired")?mainObject.getBoolean("prepkitexpired"):"") +","+
                            (mainObject.has("testpanelexpired")?mainObject.getBoolean("testpanelexpired"):"")+","+
                            (mainObject.has("image_captured")?mainObject.getBoolean("image_captured"):" ")+"\r\n");
                    rowArray[j+1]=stringBuilder.toString();
                }
                creatFile(rowArray);
            }


        } catch (JSONException e) {
            e.printStackTrace();
        }

        Log.e("exportData",json);
    }

    private String getDetectedTargets(JSONObject mainObject) throws JSONException
    {
        String targets=" ";
        if(mainObject.getString("covid").equalsIgnoreCase("true"))
        {
            targets="SARS-CoV-2 ";
        }
        if(mainObject.getString("influenzaA").equalsIgnoreCase("true"))
        {
            targets+=" FluA ";
        }
        if(mainObject.getString("influenzaB").equalsIgnoreCase("true"))
        {
            targets+=" FluB ";
        }
        if(mainObject.getString("rsv").equalsIgnoreCase("true"))
        {
            targets+=" RSV ";
        }
        if(mainObject.getString("rhino").equalsIgnoreCase("true"))
        {
            targets+=" HRV ";
        }
        return targets;
    }

    private String getPanelName(String testerId) {
        String panel="";
        if(testerId.equalsIgnoreCase("100051"))
        {
            panel="Respiratory";
        }else if(testerId.equalsIgnoreCase("100040"))
        {
            panel="SARS CoV-2";
        }
        return panel;
    }

    private void writeToFile(File file, String[] rowArr, boolean append) {
        CSVWriter csvWrite = null;
        Cursor curCSV = null;
        int count = 0;
        try {
            csvWrite = new CSVWriter(new FileWriter(file, false));
            count = rowArr.length;

            for(int i=0;i<count;i++)
            {
                String []columnArr=rowArr[i].split(",");
                csvWrite.writeNext(columnArr);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            if(csvWrite != null){
                try {
                    csvWrite.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
//                pushNotification();
            }
            if( curCSV != null ){
                curCSV.close();
            }
        }
    }
    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "pdx";
            String description = "To notify on file created";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);


            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private void pushNotification() {
        String path = Environment.getExternalStorageDirectory() + "/" + "Download/" + "/";
        Uri uri = Uri.parse(path);
        Intent intent = new Intent(Intent.ACTION_VIEW);

        intent.setDataAndType(uri, "*/*");
        PendingIntent contentIntent = PendingIntent.getActivity(getMainActivity(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(getMainActivity(),CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher_round)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setContentIntent(contentIntent)
                .setAutoCancel(true);
        builder.setContentTitle("Results Exported Successfully");
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getMainActivity());
        builder.setChannelId(CHANNEL_ID);
        builder.setStyle(new NotificationCompat.BigTextStyle().bigText("Click here view File"));
        notificationManager.notify(1, builder.build());






    }

//    private void createFolder() {
//        final File folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/");
//        if(!folder.exists() )
//        {
//
//            folder.mkdir();
//            creatFile();
//        }else
//        {
//            creatFile();
//        }
//
//    }

    private void creatFile(String[] array) {

        try {
            //
            //      FileOutputStream out = mContext.openFileOutput("CSV_Data"+".csv", Context.MODE_PRIVATE);

            //store the data in CSV file by passing String Builder data
            //   out.write(data1.toString().getBytes());

            //   out.close();
            Context context =getApplicationContext() ;
         //   final File newFile = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/FaceDetection_Data");
            final File folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly");
            if(folder.exists())
            {

                File file = new File(folder,"Data_"+System.currentTimeMillis()+ "" +".csv");
                writeToFile(file,array, false);

            }else

            {
                folder.mkdir();
                File file = new File(folder,"Data_"+System.currentTimeMillis()+".csv");
                writeToFile(file,array, false);


            }
        } catch (Exception e) {
            Toast.makeText(getApplicationContext(),"failed to write csv",Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }








//        String[] rowArr=new String[1];
//        final File folder1 = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/export_data.csv");
//        if(!folder1.exists() )
//        {
//
//            //  folder1.mkdir();
//            File file = new File(new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/"),"data_"+Calendar.getInstance() +".csv");
//            //rowArr[0]="Image_name,Result,Time,Initial Image,failure stage ";
//            rowArr[0]="UserName, UserImage, gaf";
//            //     file.mkdir();
//            writeToFile(file,rowArr, false);
//
//        }
    }
    public String getImageFromDevice(String id)
    {
        String image="";
    //    id="2022050909:27:54";
        DbHandler dbHandler =new DbHandler(getApplicationContext());
        TestResults testResults=dbHandler.getTestBasedOnId(id);
        try {
            JSONObject jsonObject=new JSONObject(testResults.getTestResult());
            if(jsonObject.has("data")&&jsonObject.get("data")instanceof JSONObject)
            {
                JSONObject jsonObject1 = jsonObject.getJSONObject("data");
                if(jsonObject1.has("image"))
                {
                    image=jsonObject1.getString("image");
                }

            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return image;
    }
    public String exportdataFromDevice(String json) {
           JSONArray jsonArray=new JSONArray();
           String fromDate = "",toDate = "",userId="";
        try {
            JSONObject jsonObject =new JSONObject(json);
            fromDate=jsonObject.has("from_date")?jsonObject.getString("from_date"):"";
           // Date from_date = new SimpleDateFormat("yyyy-MM-dd").parse(fromDate);
          //  fromDate = new SimpleDateFormat("yyyyMMddHH:mm:ss").format(from_date);
            toDate=jsonObject.has("to_date")?jsonObject.getString("to_date"):"";
           // Date to_date = new SimpleDateFormat("yyyy-MM-dd").parse(toDate);
          //  toDate = new SimpleDateFormat("yyyyMMddHH:mm:ss").format(to_date);
         userId=jsonObject.has("user_id")?jsonObject.getString("user_id"):"";

        } catch (JSONException  e) {
            e.printStackTrace();
        }

        DbHandler dbHandler =new DbHandler(getApplicationContext());
            ArrayList<TestResults>testResults=dbHandler.getResultsBasedOnDate(fromDate,toDate,userId);
            for (TestResults testResults1:testResults)
            {
                try {
                    JSONObject jsonObject=new JSONObject(testResults1.getTestResult());
                    if(jsonObject.has("data")&&jsonObject.get("data")instanceof JSONObject)
                    {
                        JSONObject jsonObject1 = jsonObject.getJSONObject("data");
                        Date date = new SimpleDateFormat("yyyyMMddHH:mm:ss").parse(testResults1.getId());
                        String dateString = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:sss").format(date);
                        jsonObject1.put("created_at", dateString);
                        jsonObject1.remove("image");
                        JSONObject jsonObject2=new JSONObject();
                        jsonObject2.put("$oid",jsonObject1.getString("id"));
                        jsonObject1.remove("id");
                        jsonObject1.put("_id",jsonObject2);
                        jsonObject1.put("image",testResults1.getId());
                        jsonObject1.put("orgIdOfUser",jsonObject1.getString("org_id"));
                        jsonObject1.put("comments","");
                        jsonObject1.put("error",false);
                        jsonObject1.put("name","sachin");
                        jsonArray.put(jsonObject1);
                    }
                } catch (ParseException  | JSONException e) {
                    e.printStackTrace();
                }
            }
       return jsonArray.toString();
       // Log.e("errro",testResults.size()+"");
    }
    public String getUserResultsFromDevice(String json) {
        int current_page=0,total_row;
        int number_of_rows=10;
        try {
            JSONObject jsonObject=new JSONObject(json);
            current_page=jsonObject.getInt("current_page");
            number_of_rows=jsonObject.getInt("number_of_rows_per_page");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        JSONArray jsonArray = new JSONArray();
        DbHandler dbHandler = new DbHandler(getApplicationContext());
        ArrayList<TestResults> testResults = dbHandler.getAllResults_without_condition(number_of_rows+"", String.valueOf((current_page-1)*number_of_rows));
        total_row=testResults.size();
        for (TestResults testResults1 : testResults) {
            try {
                JSONObject jsonObject = new JSONObject(testResults1.getTestResult());
                if (jsonObject.has("data") && jsonObject.get("data") instanceof JSONObject) {
                    JSONObject jsonObject1 = jsonObject.getJSONObject("data");
                    Date date = new SimpleDateFormat("yyyyMMddHH:mm:ss").parse(testResults1.getId());
                    String dateString = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:sss").format(date);
                    jsonObject1.put("created_at", dateString);
                    jsonObject1.remove("image");
                    JSONObject jsonObject2=new JSONObject();
                    jsonObject2.put("$oid",jsonObject1.getString("user_id"));
                    jsonObject1.remove("id");
                    jsonObject1.put("_id",jsonObject2);
                    jsonObject1.put("image",testResults1.getId());
                    jsonObject1.put("orgIdOfUser",jsonObject1.getString("org_id"));
                    if(!jsonObject1.has("name"))
                    {
                        jsonObject1.put("name","");
                    }
                    if(!jsonObject1.has("comments"))
                    {
                        jsonObject1.put("comments","");
                    }

                    jsonObject1.put("error",false);

                    jsonArray.put(jsonObject1);
                }

            } catch (ParseException | JSONException e) {
                e.printStackTrace();
            }
        }
        ArrayList<TestResults>testResults_total=dbHandler.getAllResults_without_condition_noPagging();
        try {
            JSONObject jsonObject3=new JSONObject();
            JSONObject jsonObject4=new JSONObject();
            jsonObject4.put("total_rows",total_row);
            jsonObject3.put("number_of_pages",(testResults_total.size()/number_of_rows));
            jsonArray.put(jsonObject3);
            jsonArray.put(jsonObject4);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        Log.e("allDataFromDevice",jsonArray.toString());
//        try {
//            return jsonArray.toString(4);
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }
    return jsonArray.toString();
    }

    public String getInfectiondataFromDevice(String json)
    {
        JSONObject finalObject=new JSONObject();
        DbHandler dbHandler =new DbHandler(getApplicationContext());
        ArrayList<TestResults>testResults=dbHandler.getAllResults_without_condition_noPagging();
        int covid=0,influenzaA=0,influenzaB=0,rsv=0,rhio=0,invalid=0,noInfection=0;

        for (TestResults testResults1:testResults)
        {
            try {
                JSONObject jsonObject = new JSONObject(testResults1.getTestResult());
                if(jsonObject.has("data")&&jsonObject.get("data")instanceof JSONObject)
                {
                    JSONObject jsonObject1=jsonObject.getJSONObject("data");
                    boolean no_infection=true;
                    if((jsonObject1.has("covid")?jsonObject1.getBoolean("covid"):false ))
                    {
                        covid++;
                        no_infection=false;
                    }if(jsonObject1.has("influenzaA")?jsonObject1.getBoolean("influenzaA"):false )
                    {
                        influenzaA++;
                        no_infection=false;
                    }
                    if(jsonObject1.has("influenzaB")?jsonObject1.getBoolean("influenzaB"):false )
                    {
                        influenzaB++;
                        no_infection=false;
                    }
                    if( ( jsonObject1.has("rsv")?jsonObject1.getBoolean("rsv"):false ))
                    {
                        rsv++;
                        no_infection=false;
                    }
                   if(( jsonObject1.has("rhino")?jsonObject1.getBoolean("rhino"):false ))
                    {
                        rhio++;
                        no_infection=false;
                    }
                    if(( jsonObject1.has("invalid")?jsonObject1.getBoolean("invalid"):false ))
                    {
                        invalid++;
                        no_infection=false;
                    }
                   if(no_infection){
                        noInfection++;
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        try {
            finalObject.put("noinfection",noInfection);
            finalObject.put("covid",covid);
            finalObject.put("influenzaA",influenzaA);
            finalObject.put("influenzaB",influenzaB);
            finalObject.put("rhio",rhio);
            finalObject.put("invalid",invalid);
            Log.e("infectionData",finalObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }

         return finalObject.toString();
    }
    public String getDashboardresultsFromDevice(String json)
    {

        JSONObject finalObject= new JSONObject();
        DbHandler dbHandler =new DbHandler(getApplicationContext());
        int count_positive=0,count_negative=0,count_noresult=0;
        ArrayList<TestResults>testResults=dbHandler.getAllResults_without_condition_noPagging();
        int january=0,february=0,march=0,april=0,may=0,june=0,july=0,august=0,september=0,october=0,november=0,december=0;

        for (TestResults testResults1:testResults)
        {
            try {
                JSONObject jsonObject=new JSONObject(testResults1.getTestResult());
                if(jsonObject.has("data")&&jsonObject.get("data")instanceof JSONObject)
                {
                    JSONObject jsonObject1=jsonObject.getJSONObject("data");
                    if((jsonObject1.has("covid")?jsonObject1.getBoolean("covid"):false )||(
                            jsonObject1.has("influenzaA")?jsonObject1.getBoolean("influenzaA"):false ) ||
                            ( jsonObject1.has("influenzaB")?jsonObject1.getBoolean("influenzaB"):false )||
                            ( jsonObject1.has("rsv")?jsonObject1.getBoolean("rsv"):false )||
                            ( jsonObject1.has("rhino")?jsonObject1.getBoolean("rhino"):false )
                    )
                    {
                        count_positive++;
                    }else
                    {
                        if((jsonObject1.has("invalid")?jsonObject1.getBoolean("invalid"):false ))
                        {
                            count_noresult++;
                        }else {
                            count_negative++;
                        }
                    }
                    Date date =  new SimpleDateFormat("yyyyMMddHH:mm:ss").parse(testResults1.getId());
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(date);
                    int month = cal.get(Calendar.MONTH)+1;
                    switch(month){
                        case 1: //January
                            january++;
                            break;
                        case 2: //January
                            february++;
                            break;
                        case 3: //January
                            march++;
                            break;
                        case 4: //January
                            april++;
                            break;
                        case 5: //January
                            may++;
                            break;
                        case 6: //January
                            june++;
                            break;
                        case 7: //January
                            july++;
                            break;
                        case 8: //January
                            august++;
                            break;
                        case 9: //January
                            september++;
                            break;
                        case 10: //January
                            october++;
                            break;
                        case 11: //January
                            november++;
                            break;
                        case 12: //January
                            december++;
                            break;
                    }
                }
            } catch (ParseException |JSONException e) {
                e.printStackTrace();
            }
        }
        LocalDate now = LocalDate.now();
        LocalDate thirty = now.minusDays( 9 );
        LocalDate sixty = now.minusDays( 122 );
        String toDate = now.toString();
        {
            try {
                ArrayList<TestResults>testResults_today=dbHandler.getResultsBasedOnDate(toDate,toDate,"0");
                finalObject.put("testtoday",testResults_today.size());
                String fromDate = thirty.toString();
                testResults_today=dbHandler.getResultsBasedOnDate(fromDate,toDate,"0");
                finalObject.put("testmonth",testResults_today.size());
                fromDate = sixty.toString();
                testResults_today=dbHandler.getResultsBasedOnDate(fromDate,toDate,"0");
                finalObject.put("testyear",testResults_today.size());
                JSONObject graphData_object=new JSONObject();
                graphData_object.put("january",january);
                graphData_object.put("february",february);
                graphData_object.put("march",march);
                graphData_object.put("april",april);
                graphData_object.put("may",may);
                graphData_object.put("june",june);
                graphData_object.put("july",july);
                graphData_object.put("august",august);
                graphData_object.put("september",september);
                graphData_object.put("october",october);
                graphData_object.put("november",november);
                graphData_object.put("december",december);

                finalObject.put("graphdata",graphData_object);

                JSONObject pieData_object=new JSONObject();
                pieData_object.put("positive",count_positive);
                pieData_object.put("negative",count_negative);
                pieData_object.put("noresult",count_noresult);
                finalObject.put("piedata",pieData_object);
            } catch (JSONException e) {
                e.printStackTrace();
            }


        }
        Log.e("resultData",finalObject.toString());
    return finalObject.toString();
    }
    public String getUserListFromDevice(String json)
    {
        HashMap<String,Users>usersHashMap=Utils.getUserList(getApplicationContext());
        Gson gson = new Gson();
        JSONArray jsonArray=new JSONArray();
        String output=gson.toJson(usersHashMap);
        for (Map.Entry<String, Users> hashMap:usersHashMap.entrySet())
        {
            JSONObject jsonObject=new JSONObject();
            try {
                jsonObject.put("name",hashMap.getValue().getName());
                jsonObject.put("org_id",hashMap.getValue().getOrgId());
                jsonObject.put("auth0_user_id","auth0|"+hashMap.getValue().getId());
                jsonObject.put("id",hashMap.getValue().getId());

            } catch (JSONException e) {
                e.printStackTrace();
            }
          jsonArray.put(jsonObject);
        }
       Log.e("userList",jsonArray.toString());


        return jsonArray.toString();
    }
    public void backupState(String s)
    {
        if(!s.equalsIgnoreCase("null"))
        {
            SharedPreferences prefs = getApplicationContext().
                    getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
            SharedPreferences.Editor edit = prefs.edit();

            //  String json="{\"AdvData\":{\"useAdvHeaterStoreData\":{\"AdvHeater\":{\"a\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"HeaterId\":[\"a\"],\"allHeaters\":[0]},\"useAdvSampleStoreData\":{\"advSampleCompletedStep\":{\"1\":[]},\"advSamples\":{},\"advSamplesPos\":{},\"samplesNo\":[1],\"samplesReadyForCapture\":[]},\"useAdvSampleTimerStoreData\":{\"AdvSampleTimerPos\":{\"1\":{\"DRY_1\":{\"isPlaying\":false,\"timer\":30},\"Elution_1\":{\"isPlaying\":false,\"timer\":30},\"LYSIS_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_1\":{\"isPlaying\":false,\"timer\":30},\"WASH_2\":{\"isPlaying\":false,\"timer\":30}}}},\"useAdvTestDataStoreData\":{\"advSampleID\":{},\"advSamplePrepKit\":{},\"advTestPanelID\":{}},\"useAdvTimerStoreData\":{\"activeTimer\":1643651249,\"incubationTimer\":{},\"timerForSamplePos\":{}}},\"BegData\":{\"useHeaterStoreData\":{\"heater\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"4\":\"\"}},\"useSampleStoreData\":{\"samplePos\":{},\"samples\":[],\"timeExceededSamples\":{},\"timerMapper\":{},\"voidSamples\":[]}},\"LoginData\":{\"isLogin\":true},\"LoginInfo\":{\"auth0_user_id\":\"auth0|61f434e7c725130071fe3f78\",\"auth_data\":{\"debug_run\":true,\"user_agent\":\"WPF APP\"},\"created_at\":\"2022-01-28T18:24:40.085979\",\"id\":\"61f434e8f4341a8a875337ea\",\"no_of_test_runs\":0,\"org_id\":\"61dea2a75bb5036a7ccd0daf\",\"test_runs\":2,\"updated_at\":\"2022-01-28T18:24:40.085993\"}}";
            String json = prefs.getString("CurrentUser","");
            Users users = new Users();

            Gson gson = new Gson();
            if (!TextUtils.isEmpty(json)) {
                users = gson.fromJson(json,
                        new TypeToken<Users>() {
                        }.getType());
            }
            String temp=checkLoginInfo(s);
            users.setHeaterData(temp);
            // edit.clear();
            if (prefs.contains("CurrentUser")) {
                edit.remove("CurrentUser");

            }
            edit.putString("CurrentUser", gson.toJson(users));
            edit.apply();

            Log.e("savedJson",s);
            edit.commit();

        }
    }
    private void CheckBlueToothState(){
        if(IsDeviceConnected&&connected_Bt_device!=null)
        {

            dialogStatusTV.setVisibility(View.GONE);
            bt_devices.add(connected_Bt_device);
            recyclerView_switchUser.notifyDataSetChanged();
            bt_connected_device_linearLayout.setVisibility(View.VISIBLE);

            return;
        }
        if (mBluetoothAdapter == null){
            mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();

        }
        dialogStatusTV.setText("Starting the process");
        dialogStatusTV.setVisibility(View.VISIBLE);
        connected_Bt_device=null;
        if (mBluetoothAdapter == null){
            mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
            dialogStatusTV.setText("Please retry");
            Log.e("bluetooth","Bluetooth NOT support");
        }else{
            if(mBluetoothAdapter.isEnabled())
            {
                if (mDeviceSearchCallBack != null)
                {
                    dialogStatusTV.setText("Searching for Paired Devices");
                    searchForBluetoothDeviceNew(mDeviceSearchCallBack);
                }

                final Handler handler = new Handler(Looper.getMainLooper());
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if(bt_devices.size()==0&&!IsDeviceConnected) {

                            if (mBluetoothAdapter.isEnabled()) {
                                if (mBluetoothAdapter.isDiscovering())
                                {
                                    mBluetoothAdapter.cancelDiscovery();
                                }
//                            if (mBluetoothAdapter.getScanMode() != BluetoothAdapter.SCAN_MODE_CONNECTABLE_DISCOVERABLE) {
//                                //    System.out.println(BluetoothAdapter.SCAN_MODE_CONNECTABLE_DISCOVERABLE);
//                            }
                            boolean m = mBluetoothAdapter.startDiscovery();
                            if (m) {
                                dialogStatusTV.setText("Searching for nearby Devices");
                                dialogStatusTV.setVisibility(View.VISIBLE);
                                recyclerView.setVisibility(View.GONE);
                                Log.e("bluetooth", "Bluetooth is currently in device discovery process.");
                            } else {
                                if (bt_devices.size() == 0) {
                                    dialogStatusTV.setText("Please turn on location, if not");
                                    recyclerView.setVisibility(View.GONE);
                                }
                            }
                        }
                        }
                    }
                }, 3000);
            }else
            {
                Log.e("bluetooth","Bluetooth is NOT Enabled!");
                Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                getMainActivity().startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
            }
        }
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_ENABLE_BT && resultCode == RESULT_OK) {
            if(userDialog.isShowing())
            {
                userDialog.dismiss();
            }
            showBTDialog();

        }

    }

    public void checkForNewPanelsLatest(String token){
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler_task = new Handler(Looper.getMainLooper());
        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        SharedPreferences.Editor edit = prefs.edit();

        executor.execute(() -> {
            InputStream is = null;
            String contentAsString="";
            int responseCode;
            try {
                URL url = new URL(Constants.get_app_configuration);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setReadTimeout(50000 /* milliseconds */);
                conn.setConnectTimeout(55000 /* milliseconds */);
                conn.setRequestMethod("GET");
                conn.setRequestProperty("X-AuthorityToken",Constants.auth_token);
                conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                conn.setRequestProperty("X-AccessToken",token);
                conn.connect();
                responseCode = conn.getResponseCode();
                if(responseCode == 200){
                    is = conn.getInputStream();
                }else{
                    is = conn.getErrorStream();
                }

                contentAsString = Constants.convertStreamToString(is);

                Log.e("Response Code","---->"+responseCode);
                if (prefs.contains("sample_test_panel_ids")) {
                    edit.remove("sample_test_panel_ids");
                }
//                contentAsString = contentAsString.replace("\\", "");
                contentAsString = contentAsString.replace("\n", "").replace("\r", "");
                JSONObject js = new JSONObject(contentAsString);
                JSONObject sampletsinfo = js.getJSONObject("results");
                sample_testpanel_ids = sampletsinfo.toString();
                edit.putString("sample_test_panel_ids",sample_testpanel_ids);
                edit.apply();
                edit.commit();

                setValueToReact();

            } catch (ProtocolException e) {
                setValueToReact();
                Log.e("PDXEXCEPTION","---->"+e.getMessage());
            } catch (MalformedURLException e) {
                setValueToReact();
                Log.e("PDXEXCEPTION","---->"+e.getMessage());
            } catch (IOException e) {
                setValueToReact();
                Log.e("PDXEXCEPTION","---->"+e.getMessage());
            } catch (JSONException e) {
                Log.e("PDXEXCEPTION","---->"+e.getMessage());
            } finally {
                if (is != null) {
                    try {
                        is.close();
                    } catch (IOException e) {
                        Log.e("PDXEXCEPTION","---->"+e.getMessage());
                    }
                }
            }
            handler_task.post(() -> {
                //UI Thread work here
                Log.e("test", "test");
            });
        });
    }

    public void initBluetooth()
    {
         runOnUiThread(() -> {
             bt_devices.clear();

             if(!isBluetoothHeadsetConnected())
             {
                 showBTDialog();
             }

             else
             {
                 Log.e("BT","device connected");
             }
         });
        Log.e("Bluetooth","initCalled");
    }
    public void disconnectBluetoothDevice(String device)
    {
        Log.e("Bluetooth_unpair",device);
        DragonflyBTConnectivityHelper.unPairDevice(device);
    }
    public void checkForUpdate()
    {
//        Log.e("update","checking for update");
        checkInternetConnectivity();
    }
    private void checkInternetConnectivity() {
        progressBar=new ProgressDialog(MainActivity.this);
        progressBar.setMessage("Please wait");
        progressBar.show();
        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        version_number = prefs.getInt("currentVersion",57);
        SharedPreferences.Editor edit = prefs.edit();
        ConnectivityManager connectivityManager = (ConnectivityManager)
                getSystemService(getApplicationContext().CONNECTIVITY_SERVICE);
        if (connectivityManager.getActiveNetworkInfo() != null && connectivityManager.
                getActiveNetworkInfo().isConnected() ) {
            new Get_Header_AsyncTask() {
                @Override
                public void onPostExecute(String result) {
                    if (getResponseCode() == 200 || getResponseCode() == 201) {
                        Log.e("<==== Result", "==========>" + result);
                        try {
                            int new_version = 0;
                            JSONObject jsonObject=new JSONObject(result);
                            if(jsonObject.has("version"))
                            {
                                new_version=Integer.parseInt(jsonObject.getString("version"));
                            }
                            Log.e("<==== Result", "==========>" + version_number);

                            if(new_version!=version_number)
                            {
                                version_number=new_version;
                                if (prefs.contains("currentVersion")) {
                                    edit.remove("currentVersion");

                                }

                                edit.putInt("currentVersion",new_version);
                                edit.apply();
                                edit.commit();
                                if(progressBar!=null)
                                progressBar.dismiss();

                                downloadUpdates();
                            }
                            else
                            {
                                progressBar.dismiss();
                                Toast.makeText(getMainActivity(),"Application is Up to date",Toast.LENGTH_SHORT).show();
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    } else {
                        Log.e("error","error");
                        progressBar.dismiss();
                    }
                }
            }.execute(Constants.get_version_number, "X-AuthorityToken",Constants.auth_token);
        }
        else
        {
            progressBar.dismiss();
            Toast.makeText(getApplicationContext(),"No internet connectivity",Toast.LENGTH_SHORT).show();
        }
    }
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }

    public MainActivityCallback getInterfaceInstance() {
        return mainActivityCallback;
    }
    public void storeInSharedPreference(String key, String s1)
    {

        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        SharedPreferences.Editor edit = prefs.edit();
        if (prefs.contains(key)) {
            edit.remove(key);

        }

        edit.putString(key,s1);
        edit.apply();
        edit.commit();
        Log.e("lastConnectedDevice",s1);
    }
    private String getStoreDeviceName()
    {
        String res=null;
        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        res=prefs.getString("lastConnectedDevice",null);
        if(res!=null)
        Log.e("q",res);
        return res;
    }
    public static boolean isBluetoothHeadsetConnected() {
        BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        return mBluetoothAdapter != null && mBluetoothAdapter.isEnabled()
                && mBluetoothAdapter.getProfileConnectionState(BluetoothHeadset.HEADSET) == BluetoothHeadset.STATE_CONNECTED;
    }


    public boolean checkBTDeviceConnected() {
        Set<BluetoothDevice> pairedDevices = BluetoothAdapter.getDefaultAdapter().getBondedDevices();
        Log.e("paired_devices",""+pairedDevices.size());
        if (pairedDevices.size() > 1) {

            return IsDeviceConnected;
        } else
        {
            return IsDeviceConnected;
        }
    }

    public void removeLoginDataFromServer(){
        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        String loginData = prefs.getString("CurrentUser","");
        if(loginData != null) {
            if (loginData.length() > 0) {
                try {
                    JSONObject jsonObject = new JSONObject(loginData);
                    String heaterData = jsonObject.getString("heaterData");
                    if (heaterData != null && heaterData.length() > 0) {
                        JSONObject heaterObj = new JSONObject(heaterData);
                        if (heaterObj != null) {
                            JSONObject loginInfo = heaterObj.getJSONObject("LoginInfo");
                            if (loginInfo != null) {
                                String authToken = loginInfo.getString("auth0_access_token");
                                ExecutorService executor = Executors.newSingleThreadExecutor();
                                Handler handler_task = new Handler(Looper.getMainLooper());
                                SharedPreferences.Editor edit = prefs.edit();
                                executor.execute(() -> {
                                    InputStream is = null;
                                    String contentAsString="";
                                    int responseCode;
                                    try {
                                        URL url = new URL(Constants.auth0logout);
                                        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                                        conn.setReadTimeout(50000 /* milliseconds */);
                                        conn.setConnectTimeout(55000 /* milliseconds */);
                                        conn.setRequestMethod("POST");
                                        conn.setRequestProperty("X-AuthorityToken",Constants.auth_token);
                                        conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                                        conn.setRequestProperty("X-AccessToken",authToken);
                                        conn.connect();
                                        responseCode = conn.getResponseCode();
                                        if(responseCode == 200){
                                            is = conn.getInputStream();
                                        }else{
                                            is = conn.getErrorStream();
                                        }

                                        contentAsString = Constants.convertStreamToString(is);

                                        Log.e("Response Code","---->"+responseCode);
                                        if (prefs.contains("CurrentUser")) {
                                            edit.remove("CurrentUser");
                                        }
                                        JSONObject js = new JSONObject(contentAsString);
                                        edit.apply();
                                        edit.commit();

                                    } catch (ProtocolException e) {
                                        Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                    } catch (MalformedURLException e) {
                                        Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                    } catch (IOException e) {
                                        Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                    } catch (JSONException e) {
                                        Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                    } finally {
                                        if (is != null) {
                                            try {
                                                is.close();
                                            } catch (IOException e) {
                                                Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                            }
                                        }
                                    }
                                    handler_task.post(() -> {
                                        //UI Thread work here
                                        Log.e("test", "test");
                                    });
                                });

                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
    }

}
