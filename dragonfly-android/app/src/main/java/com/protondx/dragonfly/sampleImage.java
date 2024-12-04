//
//
//package com.protondx.dragonfly;
//
//import static com.protondx.dragonfly.gmm.Gmmdetection.*;
//
//import android.Manifest;
//import android.app.Activity;
//import android.app.Dialog;
//import android.app.ProgressDialog;
//import android.content.ClipData;
//import android.content.Intent;
//import android.content.pm.PackageManager;
//import android.database.Cursor;
//import android.graphics.Bitmap;
//import android.graphics.BitmapFactory;
//import android.graphics.Color;
//import android.graphics.RectF;
//import android.media.MediaMetadataRetriever;
//import android.media.MediaPlayer;
//import android.media.MediaRecorder;
//import android.net.Uri;
//import android.os.AsyncTask;
//import android.os.Build;
//import android.os.Bundle;
//import android.os.Environment;
//import android.os.Handler;
//import android.os.Looper;
//import android.os.PersistableBundle;
//import android.provider.MediaStore;
//import android.util.Log;
//import android.util.Pair;
//import android.view.View;
//import android.view.Window;
//import android.widget.Button;
//import android.widget.ImageView;
//import android.widget.ProgressBar;
//import android.widget.TextView;
//import android.widget.Toast;
//
//import androidx.annotation.NonNull;
//import androidx.annotation.Nullable;
//import androidx.annotation.RequiresApi;
//import androidx.appcompat.app.AppCompatActivity;
//import androidx.core.app.ActivityCompat;
//import androidx.core.content.ContextCompat;
//import androidx.core.content.FileProvider;
//
//import com.google.firebase.components.BuildConfig;
//import com.opencsv.CSVWriter;
//import com.protondx.dragonfly.Services.Constants;
//
//import com.protondx.dragonfly.downloader.FileDownloader;
//import com.protondx.dragonfly.gmm.ApriltagNative;
//import com.protondx.dragonfly.gmm.CropCard;
//import com.protondx.dragonfly.gmm.Gmmdetection;
//
//import com.scandit.datacapture.barcode.capture.BarcodeCapture;
//import com.scandit.datacapture.barcode.capture.BarcodeCaptureListener;
//import com.scandit.datacapture.barcode.capture.BarcodeCaptureSession;
//import com.scandit.datacapture.barcode.capture.BarcodeCaptureSettings;
//import com.scandit.datacapture.barcode.capture.SymbologySettings;
//import com.scandit.datacapture.barcode.data.Barcode;
//import com.scandit.datacapture.barcode.data.Symbology;
//import com.scandit.datacapture.barcode.data.SymbologyDescription;
//import com.scandit.datacapture.barcode.tracking.capture.BarcodeTracking;
//import com.scandit.datacapture.barcode.ui.overlay.BarcodeCaptureOverlay;
//import com.scandit.datacapture.barcode.ui.overlay.BarcodeCaptureOverlayStyle;
//import com.scandit.datacapture.core.capture.DataCaptureContext;
//import com.scandit.datacapture.core.data.FrameData;
//import com.scandit.datacapture.core.source.BitmapFrameSource;
//import com.scandit.datacapture.core.source.Camera;
//import com.scandit.datacapture.core.source.CameraSettings;
//import com.scandit.datacapture.core.source.FrameSource;
//import com.scandit.datacapture.core.source.FrameSourceListener;
//import com.scandit.datacapture.core.source.FrameSourceState;
//import com.scandit.datacapture.core.source.VideoResolution;
//import com.scandit.datacapture.core.ui.DataCaptureView;
//import com.scandit.datacapture.core.ui.style.Brush;
//import com.scandit.datacapture.core.ui.viewfinder.RectangularViewfinder;
//import com.scandit.datacapture.core.ui.viewfinder.RectangularViewfinderStyle;
//
//import org.jetbrains.annotations.NotNull;
//import org.opencv.android.InstallCallbackInterface;
//import org.opencv.android.LoaderCallbackInterface;
//import org.opencv.android.OpenCVLoader;
//import org.opencv.android.Utils;
//import org.opencv.core.Mat;
//import org.opencv.imgproc.Imgproc;
//
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.FileWriter;
//import java.io.IOException;
//import java.io.InputStream;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.Calendar;
//import java.util.HashMap;
//import java.util.HashSet;
//import java.util.List;
//
//public class sampleImage extends AppCompatActivity implements BarcodeCaptureListener, FrameSourceListener {
//    Button btn;
//    static ImageView imageView;
//    int SELECT_IMAGE=100;
//    int PICK_IMAGE_MULTIPLE = 1;
//    ProgressDialog progressBar;
//    ArrayList<Uri> mArrayUri=new ArrayList<>();
//    int position = 0;
//    Dialog downloadingUpdatesDialog;
//    private boolean mIsDownloadingUpdates;
//    private static final int STORAGE_PERMISSION_CODE = 101;
//    String TAG="pdx";
//    static String fileName="";
////    OpenCvAlgorithm openCvAlgo;
////    AIAlgorithm aiAlgorithm;
//    TextView outputfile = null;
//    public boolean chosenAI = false;
//    private static final int REQUEST_EXTERNAL_STORAGE = 1;
//    private static String[] PERMISSIONS_STORAGE = {
//            Manifest.permission.READ_EXTERNAL_STORAGE,
//            Manifest.permission.WRITE_EXTERNAL_STORAGE
//    };
//    public static final String SCANDIT_LICENSE_KEY = "AWIx1DykHXrvQf/IgxpY6jQ3xOlxLbHSRhnGJ5RtTv83DYu9Xn9wJGx35dWoW/JeoE14VEdbK4/pZ0UirTaUZShSrJZ2bEE+Kwek2Ll4bP3jbzmIglSLOv9DejjZRCP1I30E6fZdp/cBeczVOEWBdml2PRsWa0N57EkUNVJ/oZpvVXzfqCLbf6VZFzLNdS8cYn2V0tJx/bShTICP4lQept9xAvF0deA4qkR93yV3J3xzVo9PZGhwMPBQQAVWfhPe2nMUSP5CC7QjZJ9EXTY/oY5k+cXMVqOstGS7KgpSHRy7d4HpOHflutlLlxe1WYVV4HEyASFis3QWf2pVT2vSIDZdAFaPfLQBf2LnAapP3aJLeatPF1aZGNd9Zii6SJEvym4gVyF3XaUYQ1WUtHXwoNkrbt2SXJsd/lNokkpymYz0KWHPXl8kLl1UaTvkcGlnoUvHz7pucR6rAVIWymGc9yhzlLOYZeXqk3HXhBVNP3J+IyNRRWRRvWdWJ5CYVK2rkEUQ1Osj68g+Oq9FLzePkbOh+7Er1Nk7Ru+KQagqzq5AsvSip32DNpZ0QndOacfU1mnf1k5lSLEXfXKdqBoyZMVdnwOlfcDlS45SPyYxUvyyrjwXktS5gIHw3sI+3FzN7WbZXsY7yj3DeeSFxwIaqB4o1D95N0ftXnsI88oQCiyqEJoBCDghZFdvdUYc90ySbyWuC4JPb+tM0BwFlIA30QOIptxNq1G1KKN7c9v9EAKZWPTmuRaK9WNi6YBmtyxBuAvURf4xVnW1TeBJIKAzKU+eG35U7ZsL7Xq6e13tStBf2tBxapEsun35/7+aHEhmv0Bi736CpUZ5DTkYSCn6+C7S+VCn+5QqZLyogSGznvKhi8dCMc2wHavXocl8ZLcWqyoMMeFVwYZXwKZyG64dOTXajgCKEzp2AQESPrHljCiovbpKxg3j/rIGEK5ZH0EE6Puh0f3hv4zCmNRtTaDAXLmJAw0pXAMMcizgs1arF4CE2Qx22PHxwv4Nv9fCFRYQNrR2fSJrE53HYvhK7nrxSni21Rka2nahG+n3fZk3Gr1MO4zqs3i9oKYo/s+4Gf1YTT+6lZcHMJysaTxq+iaZvU9MKae0voTxnckn39X9tZcK3RKsLANoYwxqGneImiuPM2Rynw5BlGldcFaiGEnOMrbDoV8iNotEVjppcKwn8gHCzzc9v3Pm3CxiiGFUUnZ+";
//
//    private DataCaptureContext dataCaptureContext;
//    private BarcodeCapture barcodeCapture;
//    private DataCaptureView dataCaptureView;
//    Gmmdetection gmmAlgo = null;
//    Camera camera;
//    public static void verifyStoragePermissions(Activity activity) {
//        // Check if we have write permission
//        int permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE);
//
//        if (permission != PackageManager.PERMISSION_GRANTED) {
//            // We don't have permission so prompt the user
//            ActivityCompat.requestPermissions(
//                    activity,
//                    PERMISSIONS_STORAGE,
//                    REQUEST_EXTERNAL_STORAGE
//            );
//        }
//    }
//
//    public void assessVideos(String pathname){
//        String path = Environment.getExternalStorageDirectory().getAbsolutePath() + "/Download/Dragonfly/videos/" + pathname;
//        MediaMetadataRetriever media = new MediaMetadataRetriever();
//        File f = new File(path);
////        HashMap test = new HashMap<String, String>();
////        test.put("ANANd", "Anand");
//        try {
//            media.setDataSource(path);
//            //ArrayList<Bitmap> rev=new ArrayList<Bitmap>();
////Create a new Media Player
//            MediaPlayer mp = MediaPlayer.create(getBaseContext(), Uri.parse(path));
//
//            int millis = mp.getDuration() * 1000;
//            for(int i=1000000;i< millis;i+=100000) {
//                Bitmap bitmap = media.getFrameAtTime(i, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
//                List results = gmmAlgo.findColorsGMM(bitmap);
//                //Log.d("result", String.valueOf(results.size()));
//                String [] t = pathname.split(" ");
//                if(results != null) {
//                    StringBuilder str = new StringBuilder();
//                    for(int k=0;k<results.size();k++){
//                        int res = (int)results.get(k);
//                        if(res == 1){
//                            str.append('P');
//                        }else{
//                            str.append('Y');
//                        }
//                    }
//                    if (t[0].compareToIgnoreCase(str.toString()) == 0) {
//                        writeCSVNew(Long.toString(Gmmdetection.currentFrame), "PASS", Long.toString(Gmmdetection.totaltiming), Long.toString(CropCard.apriltagtiming),
//                                Long.toString(Gmmdetection.croptiming), Long.toString(Gmmdetection.gmmtiming), Boolean.toString(CropCard.apriltag1), Boolean.toString(CropCard.apriltag2),
//                        Boolean.toString(CropCard.apriltag3), Boolean.toString(CropCard.apriltag4));
//                    } else {
//                        writeCSVNew(Long.toString(Gmmdetection.currentFrame), "FAIL", Long.toString(Gmmdetection.totaltiming), Long.toString(CropCard.apriltagtiming),
//                                Long.toString(Gmmdetection.croptiming), Long.toString(Gmmdetection.gmmtiming), Boolean.toString(CropCard.apriltag1), Boolean.toString(CropCard.apriltag2),
//                                Boolean.toString(CropCard.apriltag3), Boolean.toString(CropCard.apriltag4));
//                    }
//                }else{
//                    writeCSVNew(pathname, "FAIL", Long.toString(0), Long.toString(0),
//                            Long.toString(0), Long.toString(0), Boolean.toString(CropCard.apriltag1), Boolean.toString(CropCard.apriltag2),
//                            Boolean.toString(CropCard.apriltag3), Boolean.toString(CropCard.apriltag4));
//                }
//                outputfile.setText("Completed frame of File : " + pathname + " Frame: " + i);
//                CropCard.apriltag1 = false;
//                CropCard.apriltag2 = false;
//                CropCard.apriltag3 = false;
//                CropCard.apriltag4 = false;
//            }
//        }catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//    public static void setImage(Bitmap bmp,String name,String num,String folder1) {
//        Calendar calendar = Calendar.getInstance();
//        long time= calendar.getTimeInMillis();
//
//     /*   imageView.setImageBitmap(bmp);*/
//        try {
//            final File folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/"+folder1);
////
//            File file = new File(folder,name);
//            FileOutputStream out = new FileOutputStream(file);
//            bmp.compress(Bitmap.CompressFormat.JPEG, 100, out);
//            out.flush();
//            out.close();
////            String[] rowArr=new String[2];
////            rowArr[0]=name+","+num;
//          /*  final File file1=new File(Environment.getExternalStorageDirectory(),"/Download/Proton/output/april_tag");
//            writeToFile(file1,rowArr,true);*/
//       //     final File newFile = new File(Environment.getExternalStorageDirectory(),"/Download/Proton/output/output_data.csv");
//
//         //   writeToFile(newFile,rowArr, true);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//    }
//
//    public static void writeCSVNew(String fileName, String result, String total_time, String april_time, String crop_time, String gmm_time,
//                                   String ap1, String ap2, String ap3, String ap4) {
//        String[] rowArr=new String[1];
//        rowArr[0]=fileName+","+result+","+total_time+","+april_time+","+crop_time+","+gmm_time + "," + ap1 + "," + ap2 + "," +ap3 + "," + ap4;
//        final File newFile = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/output_data.csv");
//        writeToFile(newFile,rowArr, true);
//    }
//
//    public static void writeCSV(String fileName, String sucess, String time) {
//        String[] rowArr=new String[1];
//        rowArr[0]=fileName+","+sucess+","+time;
//        final File newFile = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/output_data.csv");
//
//        writeToFile(newFile,rowArr, true);
//
//    }
//
//
//    private boolean fileExists() {
//      boolean result=false;
//        final File newFile = new File(getApplicationContext().getFilesDir(),"/" + "color_models.mat");
//        if(newFile.exists())
//        {
//            result=true;
//        }
//    return result;
//    }
//
//    private void downloadUpdates() {
//        if (mIsDownloadingUpdates) {
//            return;
//        }
//        mIsDownloadingUpdates = true;
//
//        String url = "";
//        url = "https://pdxpwa.s3.ap-southeast-1.amazonaws.com/color_models.mat";
//        FileDownloader fdl = new FileDownloader(ContextCompat.getDataDir(this).getAbsolutePath(), url, "files/color_models.mat");
//        fdl.setDownloaderCallback(new FileDownloader.DownloaderCallback() {
//            @Override
//            public void onProgress(int progress) {
//                runOnUiThread(() -> {
//                    downloadProgressUpdate(progress);
//                    mIsDownloadingUpdates = true;
//                });
//
//            }
//
//
//            @Override
//            public void onFinish() {
//               // closeDialog();
//
//
//            }
//
//
//            @Override
//            public void onError(String message) {
//                //display error on UI thread
//                runOnUiThread(() -> {
//                    mIsDownloadingUpdates = false;
//                    Toast.makeText(sampleImage.this, "Something went wrong..." + message, Toast.LENGTH_SHORT).show();
//                });
//                Log.d("Download Fail...", message != null ? message : " ");
//            }
//        });
//        fdl.start();
//    }
//
//    private void closeDialog() {
//        if (downloadingUpdatesDialog != null)
//            if (downloadingUpdatesDialog.isShowing())
//                try {
//                    downloadingUpdatesDialog.dismiss();
//                    downloadingUpdatesDialog = null;
//                } catch (Exception ex) {
//                    // do nothing..
//                }
//    }
//
//
//    private void downloadProgressUpdate(int progress) {
//        if (downloadingUpdatesDialog == null) {
//            downloadingUpdatesDialog = new Dialog(sampleImage.this);
//            downloadingUpdatesDialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
//            downloadingUpdatesDialog.setCancelable(false);
//            downloadingUpdatesDialog.setContentView(R.layout.dialog);
//        }
//        ProgressBar progressBarDownloadingUpdates = (ProgressBar) downloadingUpdatesDialog.findViewById(R.id.progress_horizontal);
//        TextView downloadProgressStatusText = downloadingUpdatesDialog.findViewById(R.id.value123);
//
//        progressBarDownloadingUpdates.setProgress(progress);
//        downloadProgressStatusText.setText(String.format("Downloaded %d  ..", progress));
//        if (!downloadingUpdatesDialog.isShowing())
//            downloadingUpdatesDialog.show();
//       if(progress==100)
//       {
//           closeDialog();
//       }
////        Window window = dialog.getWindow();
////        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
//    }
//    LoaderCallbackInterface mOpenCVCallBack = new LoaderCallbackInterface() {
//        @Override
//        public void onManagerConnected(int status) {
//            if (status == LoaderCallbackInterface.SUCCESS) {
////                openCvAlgo = new OpenCvAlgorithm(getApplicationContext());
////                if(chosenAI){
////                    aiAlgorithm = new AIAlgorithm(getApplicationContext());
////                }
////                runOnUiThread(new Runnable() {
////                    @Override
////                    public void run() {
////                        //   Toast.makeText(MainActivity.this, "Analyser engine initiated!", Toast.LENGTH_SHORT).show();
////                    }
////                });
////                ApriltagNative.native_init();
//
//            }
//
//        }
//
//        @Override
//        public void onPackageInstall(int operation, InstallCallbackInterface callback) {
//
//        }
//    };
//        private void initAttributes() {
//            Log.e("applicationId", getApplicationContext().getPackageName() );
//
//            //     btn=findViewById(R.id.btn);
//        imageView=findViewById(R.id.imageView);
//     //   createFolder();
////        btn.setOnClickListener(new View.OnClickListener() {
////            @Override
////            public void onClick(View view) {
////
////                mArrayUri.clear();
////
////                progressBar=new ProgressDialog(sampleImage.this);
////                progressBar.setMessage("Please wait");
////                progressBar.show();
////                final File folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/input");
////                final int[] i = {folder.listFiles().length};
////              /*  File dir= new File(folder,);*/
////
////                for (File f : folder.listFiles()) {
////                    if (f.isFile())
////                    {
////                        String name = f.getName();
////                        fileName=name;
////                        Log.i("file names", name);
////                        File file = new File(folder,name);
////                        BitmapFactory.Options bitmapOptions = new BitmapFactory.Options();
////                        Bitmap bitmap = BitmapFactory.decodeFile(file.getAbsolutePath(), bitmapOptions);
////                        if(bitmap!=null)
////                        {
////                            final Handler handler = new Handler();
////                            Bitmap finalBitmap = bitmap;
////
////                          /*  Mat mat = new Mat();
////                            Bitmap bmp32 = bitmap.copy(Bitmap.Config.ARGB_8888, true);
////                            Utils.bitmapToMat(bmp32, mat);    */
////                          /*     Mat finalbitmap = new Mat();
////                            Bitmap bmp32 = bitmap.copy(Bitmap.Config.ARGB_8888, true);
////                            Utils.bitmapToMat(bmp32, finalbitmap);*/
////
////
//////
//////                            handler.postDelayed(new Runnable() {
//////                                @RequiresApi(api = Build.VERSION_CODES.O)
//////                                @Override
//////                                public void run() {
//////                                    if(chosenAI){
//////                                        try {
//////                                         //   startAIDetect(finalBitmap);
//////                                        } catch (InterruptedException e) {
//////                                            e.printStackTrace();
//////                                        }
//////                                        List result = aiAlgorithm.getResult();
////////                                        Log.d("test", fileName);
////////                                        Log.d("test", result.toString());
//////                                    }else {
//////                                        Gmmdetection gmmdetection = new Gmmdetection(sampleImage.this);
//////                                        gmmdetection.detectGMMNew(name, finalBitmap);
//////                                        /* gmmdetection.findCardHomographyCV(finalBitmap,name);*/
//////                                        i[0]--;
//////                                        if (i[0] == 1) {
//////                                            progressBar.dismiss();
//////                                        }
//////                                    }
//////                                }
//////                            }, 500);
////                        }
////
////
////                    }
////
////                }
////                if(folder.listFiles().length==0)
////
////                {
////                    progressBar.dismiss();
////                }
////            }
////        });
//    }
//
//    private void testBed() {
//        btn=findViewById(R.id.btn);
//        imageView=findViewById(R.id.imageView);
//        createFolder();
//        btn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//                mArrayUri.clear();
//                gmmAlgo = new Gmmdetection(getApplicationContext());
//                gmmAlgo.readMatFile("file:///android_asset/color_models.mat");
//
//                progressBar=new ProgressDialog(sampleImage.this);
//                progressBar.setMessage("Please wait");
//                progressBar.show();
//                final File folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/videos");
//                final int[] i = {folder.listFiles().length};
//                /*  File dir= new File(folder,);*/
//
//                for (File f : folder.listFiles()) {
//                    if (f.isFile())
//                    {
//                        String name = f.getName();
//                        fileName=name;
//                        Log.i("file names", name);
//                        File file = new File(folder,name);
//                        if(name!=null)
//                        {
//                            final Handler handler = new Handler();
//                            handler.postDelayed(new Runnable() {
//                                @RequiresApi(api = Build.VERSION_CODES.O)
//                                @Override
//                                public void run() {
//                                    //assessVideos(name);
//                                    new AsyncCaller().execute(name);
//                                        /* gmmdetection.findCardHomographyCV(finalBitmap,name);*/
//                                        i[0]--;
//                                        if (i[0] == 0) {
//                                            Log.d("completed", "test complete");
//                                            progressBar.dismiss();
//                                        }
//                                }
//                            }, 500);
//                        }
//
//
//                    }
//
//                }
//                if(folder.listFiles().length==0)
//
//                {
//                    progressBar.dismiss();
//                }
//            }
//        });
//    }
//
//    private void startAIDetect(Bitmap bmp) throws InterruptedException {
////        String directory = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath();
////        File dir = new File(directory + "/Dragonfly/Input");
////        File[] directoryListing = dir.listFiles();
////        if (directoryListing != null) {
////            for (File child : directoryListing) {
////                // Do something with child
////                Bitmap bitmap = BitmapFactory.decodeFile(child.getAbsolutePath());
////                fileName = child.getName();
//                Mat output = new Mat();
//                Utils.bitmapToMat(bmp, output);
//                long start_time = System.currentTimeMillis();
//                //Imgproc.cvtColor(output, output, Imgproc.COLOR_RGBA2RGB);
////                CropCard crop = new CropCard(output);
////                Mat card = crop.prepImgTestCV(true); //Get card here
////                Bitmap bmp1 = Bitmap.createBitmap(card.cols(), card.rows(), Bitmap.Config.ARGB_8888);
////                Utils.matToBitmap(card, bmp1); //This bmp needs to be saved //Sachin
////                aiAlgorithm.setBitmap(bmp1);
////                aiAlgorithm.startDetect();
////                Thread.sleep(5000);
//         //   }
//       // }
//    }
//
//    private void createFolder() {
//        String[] rowArr=new String[2];
//        final File folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/");
//        if(!folder.exists() )
//        {
//
//            folder.mkdir();
//            final File folder1 = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output");
//            if(!folder1.exists() )
//            {
//
//                folder1.mkdir();
//
//
//            }
//            final File folder2 = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/input");
//            if(!folder2.exists() )
//            {
//
//                folder2.mkdir();
//
//
//            }
//
//
//        }else
//        {
//            final File folder2 = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/input");
//            if(!folder2.exists() )
//            {
//
//                folder2.mkdir();
//
//
//            }
//            final File folder7= new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/");
//            if(!folder7.exists() )
//            {
//
//                 folder7.mkdir();
//
//
//            }
//            final File folder1 = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/output_data.csv");
//            if(!folder1.exists() )
//            {
//
//              //  folder1.mkdir();
//                File file = new File(new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/"),"output_data.csv");
//                //rowArr[0]="Image_name,Result,Time,Initial Image,failure stage ";
//                rowArr[0]="Image_name,Result,Total_Time,April_Time,Crop_Time,GMM_Time,AP_1,AP_2,AP3,AP_4";
//           //     file.mkdir();
//                writeToFile(file,rowArr, false);
//
//            }
//
//            final File folder3 = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/crop");
//            {
//                if(!folder3.exists())
//                {
//                    folder3.mkdir();
//                }
//            }
//
//            final File folder4 = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/mask");
//            {
//                if(!folder4.exists())
//                {
//                    folder4.mkdir();
//                }
//            }
//            final  File folder5= new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/tube");
//            {
//                if(!folder5.exists())
//                {
//                    folder5.mkdir();
//                }
//            }
//            final  File folder6= new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/april_tag");
//            {
//                if(!folder6.exists())
//                {
//                    folder6.mkdir();
//                }
//            }
//        }
//
//    }
////    public void onActivityResult(int requestCode, int resultCode, Intent data) {
////        super.onActivityResult(requestCode, resultCode, data);
////        if (requestCode == SELECT_IMAGE) {
////            if (resultCode == Activity.RESULT_OK) {
////                if (data != null) {
////                    try {
////                        Bitmap bitmap = MediaStore.Images.Media.getBitmap(getApplicationContext().getContentResolver(), data.getData());
////                        Gmmdetection.findCardHomographyCV(bitmap);
////                       // imageView.fsetImageBitmap(bitmap);
////                    } catch (IOException e) {
////                        e.printStackTrace();
////                    }
////                }
////            } else if (resultCode == Activity.RESULT_CANCELED)  {
////                Toast.makeText(getApplicationContext(), "Canceled", Toast.LENGTH_SHORT).show();
////            }
////        }
////    }
//
//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//        // When an Image is picked
//        if (requestCode == PICK_IMAGE_MULTIPLE && resultCode == RESULT_OK && null != data) {
//            // Get the Image from data
//            if (data.getClipData() != null) {
//                ClipData mClipData = data.getClipData();
//                int cout = data.getClipData().getItemCount();
//                for (int i = 0; i < cout; i++) {
//                    // adding imageuri in array
//                    Uri imageurl = data.getClipData().getItemAt(i).getUri();
//                    mArrayUri.add(imageurl);
//
//                }
//                // setting 1st selected image into image switcher
//                imageView.setImageURI(mArrayUri.get(0));
//                position = 0;
//            } else {
//                Uri imageurl = data.getData();
//                mArrayUri.add(imageurl);
//                imageView.setImageURI(mArrayUri.get(0));
//                position = 0;
//            }
//            processImage();
//        } else {
//            // show this if no image is selected
//            Toast.makeText(this, "You haven't picked Image", Toast.LENGTH_LONG).show();
//        }
//    }
//
//    private void processImage() {
//        progressBar=new ProgressDialog(sampleImage.this);
//        progressBar.setMessage("Please wait");
//        progressBar.show();
//        for (int i=0;i<mArrayUri.size();i++)
//        {
//
//            Bitmap bitmap = null;
//            try {
//                bitmap = MediaStore.Images.Media.getBitmap(getApplicationContext().getContentResolver(),mArrayUri.get(i) );
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//
//            final Handler handler = new Handler();
//            Bitmap finalBitmap = bitmap;
//            int finalI = i;
//            handler.postDelayed(new Runnable() {
//                @Override
//                public void run() {
//
//                //    Gmmdetection.findCardHomographyCV(finalBitmap);
//                    if(finalI ==mArrayUri.size()-1)
//                    {
//                        progressBar.dismiss();
//                    }
//                }
//            }, 500);
//
//        }
//
//
//    }
//
//
//    private static void writeToFile(File file, String[] rowArr, boolean append) {
//        CSVWriter csvWrite = null;
//        Cursor curCSV = null;
//        int count = 0;
//        try {
//            if(append) {
//                csvWrite = new CSVWriter(new FileWriter(file, true));
//                count = 1;
//            }else{
//                csvWrite = new CSVWriter(new FileWriter(file, false));
//                count = 2;
//            }
//
//            for(int i=0;i<count;i++)
//            {
//                String []columnArr=rowArr[i].split(",");
//                csvWrite.writeNext(columnArr);
//            }
//
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        finally {
//            if(csvWrite != null){
//                try {
//                    csvWrite.close();
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            }
//            if( curCSV != null ){
//                curCSV.close();
//            }
//        }
//    }
//    public void checkPermission(String permission, int requestCode)
//    {
//        if (ContextCompat.checkSelfPermission(sampleImage.this, permission) == PackageManager.PERMISSION_DENIED) {
//
//            // Requesting the permission
//            ActivityCompat.requestPermissions(sampleImage.this, new String[] { permission }, requestCode);
//        }
//
//    }
//    @Override
//    public void onRequestPermissionsResult(int requestCode,
//                                           @NonNull String[] permissions,
//                                           @NonNull int[] grantResults)
//    {
//        super.onRequestPermissionsResult(requestCode,
//                permissions,
//                grantResults);
//
//     if (requestCode == STORAGE_PERMISSION_CODE) {
//            if (grantResults.length > 0
//                    && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//               // Toast.makeText(getApplicationContext(), "Storage Permission Granted", Toast.LENGTH_SHORT).show();
//            } else {
//
//                Toast.makeText(getApplicationContext(), "Storage Permission Denied", Toast.LENGTH_SHORT).show();
//            }
//        }
//    }
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//        setContentView(R.layout.sample_image);
//        outputfile = findViewById(R.id.output);
//        initializeAndStartBarcodeScanning();
//        checkPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, STORAGE_PERMISSION_CODE);
//        initAttributes();
//        //testBed();
//        verifyStoragePermissions(sampleImage.this);
//        if(!fileExists())
//        {
//            downloadUpdates();
//        }
//
//        if (!OpenCVLoader.initDebug()) {
//            Log.d(TAG, "Internal OpenCV library not found. Using OpenCV Manager for initialization");
//            OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_3_0_0, this, mOpenCVCallBack);
//        } else {
//           // openCvAlgo = new OpenCvAlgorithm(getApplicationContext());
//            Log.d(TAG, "OpenCV library found inside package. Using it!");
//            mOpenCVCallBack.onManagerConnected(LoaderCallbackInterface.SUCCESS);
//        }
//
//    }
//    private void initializeAndStartBarcodeScanning() {
//        // Create data capture context using your license key.
//        dataCaptureContext = DataCaptureContext.forLicenseKey(Constants.SCANDIT_LICENSE_KEY);
//        CameraSettings cameraSettings = BarcodeTracking.createRecommendedCameraSettings();
//        // Adjust camera settings - set Full HD resolution.
//        cameraSettings.setPreferredResolution(VideoResolution.FULL_HD);
//
//        // Use the default camera with the recommended camera settings for the BarcodeCapture mode
//        // and set it as the frame source of the context. The camera is off by default and must be
//        // turned on to start streaming frames to the data capture context for recognition.
//        // See resumeFrameSource and pauseFrameSource below.
//        camera = Camera.getDefaultCamera(cameraSettings);
//
//        camera = Camera.getDefaultCamera(BarcodeCapture.createRecommendedCameraSettings());
////        InputStream imageStream = this.getResources().openRawResource(R.raw.image);
////        Bitmap bitmap = BitmapFactory.decodeStream(imageStream);
//        camera.switchToDesiredState(FrameSourceState.ON,null);
////        BitmapFrameSource bitmapFrameSource=BitmapFrameSource.of(ca);
////        bitmapFrameSource.switchToDesiredState(FrameSourceState.ON,null);
////        bitmapFrameSource.addListener(this);
////        dataCaptureContext.setFrameSource(bitmapFrameSource);
//        if (camera != null) {
//            dataCaptureContext.setFrameSource(camera);
//          //  dataCaptureContext.setFrameSource(BitmapFrameSource.of(bitmap));
//        } else {
//            throw new IllegalStateException("Sample depends on a camera, which failed to initialize.");
//        }
//
//        // The barcode capturing process is configured through barcode capture settings
//        // which are then applied to the barcode capture instance that manages barcode recognition.
//        BarcodeCaptureSettings barcodeCaptureSettings = new BarcodeCaptureSettings();
//
//        // The settings instance initially has all types of barcodes (symbologies) disabled.
//        // For the purpose of this sample we enable a very generous set of symbologies.
//        // In your own app ensure that you only enable the symbologies that your app requires as
//        // every additional enabled symbology has an impact on processing times.
//        HashSet<Symbology> symbologies = new HashSet<>();
////        symbologies.add(Symbology.EAN13_UPCA);
////        symbologies.add(Symbology.EAN8);
////        symbologies.add(Symbology.UPCE);
//        symbologies.add(Symbology.QR);
//
//        //symbologies.add(Symbology.CODE39);
//        symbologies.add(Symbology.CODE128);
//       // symbologies.add(Symbology.INTERLEAVED_TWO_OF_FIVE);
//        symbologies.add(Symbology.DATA_MATRIX);
////        symbologies.add(Symbology.GS1_DATABAR);
////        symbologies.add(Symbology.GS1_DATABAR_EXPANDED);
////        symbologies.add(Symbology.GS1_DATABAR_LIMITED);
//        barcodeCaptureSettings.enableSymbologies(symbologies);
//
//        // Some linear/1d barcode symbologies allow you to encode variable-length data.
//        // By default, the Scandit Data Capture SDK only scans barcodes in a certain length range.
//        // If your application requires scanning of one of these symbologies, and the length is
//        // falling outside the default range, you may need to adjust the "active symbol counts"
//        // for this symbology. This is shown in the following few lines of code for one of the
//        // variable-length symbologies.
//        SymbologySettings symbologySettings =
//                barcodeCaptureSettings.getSymbologySettings(Symbology.CODE39);
//
//        HashSet<Short> activeSymbolCounts = new HashSet<>(
//                Arrays.asList(new Short[] { 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 }));
//
//        symbologySettings.setActiveSymbolCounts(activeSymbolCounts);
//
//        // Create new barcode capture mode with the settings from above.
//        barcodeCapture = BarcodeCapture.forDataCaptureContext(dataCaptureContext, barcodeCaptureSettings);
//        barcodeCapture.setEnabled(true);
//        // Register self as a listener to get informed whenever a new barcode got recognized.
//        barcodeCapture.addListener(this);
//
//        // To visualize the on-going barcode capturing process on screen, setup a data capture view
//        // that renders the camera preview. The view must be connected to the data capture context.
//        dataCaptureView = DataCaptureView.newInstance(this, dataCaptureContext);
//
//        // Add a barcode capture overlay to the data capture view to render the location of captured
//        // barcodes on top of the video preview.
//        // This is optional, but recommended for better visual feedback.
//        BarcodeCaptureOverlay overlay = BarcodeCaptureOverlay.newInstance(
//                barcodeCapture,
//                dataCaptureView,
//                BarcodeCaptureOverlayStyle.FRAME
//        );
//       overlay.setViewfinder(new RectangularViewfinder(RectangularViewfinderStyle.SQUARE));
////
////        // Adjust the overlay's barcode highlighting to match the new viewfinder styles and improve
////        // the visibility of feedback. With 6.10 we will introduce this visual treatment as a new
////        // style for the overlay.
//        Brush brush = new Brush(Color.TRANSPARENT, Color.WHITE, 3f);
//        overlay.setBrush(brush);
//
//        setContentView(dataCaptureView);
//    }
//    @Override
//    public void onBarcodeScanned(
//            @NonNull BarcodeCapture barcodeCapture,
//            @NonNull BarcodeCaptureSession session,
//            @NonNull FrameData frameData
//    ) {
//        if (session.getNewlyRecognizedBarcodes().isEmpty()) return;
//
//        Barcode barcode = session.getNewlyRecognizedBarcodes().get(0);
//
//        // Stop recognizing barcodes for as long as we are displaying the result. There won't be any
//        // new results until the capture mode is enabled again. Note that disabling the capture mode
//        // does not stop the camera, the camera continues to stream frames until it is turned off.
//    //    barcodeCapture.setEnabled(false);
//
//        // If you are not disabling barcode capture here and want to continue scanning, consider
//        // setting the codeDuplicateFilter when creating the barcode capture settings to around 500
//        // or even -1 if you do not want codes to be scanned more than once.
//
//        // Get the human readable name of the symbology and assemble the result to be shown.
//        String symbology = SymbologyDescription.create(barcode.getSymbology()).getReadableName();
//        final String result = "Scanned: " + barcode.getData() + " (" + symbology + ")";
//        Log.e("ScannResult",result);
//
//        runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//
//              //  showResult(result);
//            }
//        });
//    }
//
//    @Override
//    public void onObservationStarted(@NotNull BarcodeCapture barcodeCapture) {
//    Log.e("barcode","observationStarted");
//    }
//
//    @Override
//    public void onObservationStopped(@NotNull BarcodeCapture barcodeCapture) {
//        Log.e("barcode","observationStopped");
//
//    }
//
//    @Override
//    public void onSessionUpdated(@NotNull BarcodeCapture barcodeCapture, @NotNull BarcodeCaptureSession barcodeCaptureSession, @NotNull FrameData frameData) {
//
//    }
//
//    @Override
//    public void onFrameOutput(@NotNull FrameSource frameSource, @NotNull FrameData frameData) {
//     //   Log.e("Frame","frameOutputGot");
//
//    }
//
//    @Override
//    public void onObservationStarted(@NotNull FrameSource frameSource) {
//        Log.e("Frame","ObservationStarted");
//
//    }
//
//    @Override
//    public void onObservationStopped(@NotNull FrameSource frameSource) {
//
//    }
//
//    @Override
//    public void onStateChanged(@NotNull FrameSource frameSource, @NotNull FrameSourceState frameSourceState) {
//        Log.e("Frame","Statechanged");
//    }
//
//    private class AsyncCaller extends AsyncTask<String, Void, Void>
//    {
//        @Override
//        protected void onPreExecute() {
//            super.onPreExecute();
//        }
//        @Override
//        protected Void doInBackground(String... params) {
//            assessVideos(params[0]);
//            outputfile.setText("Testing file : " + params[0]);
//            return null;
//        }
//
//        @Override
//        protected void onPostExecute(Void result) {
//            super.onPostExecute(result);
//        }
//
//    }
//}
//
