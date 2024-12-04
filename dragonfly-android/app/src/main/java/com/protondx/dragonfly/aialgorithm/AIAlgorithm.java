//package com.protondx.dragonfly.aialgorithm;
//
//import android.content.Context;
//import android.graphics.Bitmap;
//import android.graphics.Canvas;
//import android.graphics.Color;
//import android.graphics.Paint;
//import android.graphics.RectF;
//import android.os.Handler;
//import android.os.HandlerThread;
//
//import com.protondx.dragonfly.MainActivity;
//
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.Collections;
//import java.util.HashSet;
//import java.util.LinkedList;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//import java.util.TreeMap;
//import java.util.logging.LogRecord;
//
//public class AIAlgorithm {
//
//    public static final float MINIMUM_CONFIDENCE_TF_OD_API = 0.8f;
//    public static final int TF_OD_API_INPUT_SIZE = 416;
//    private static final boolean TF_OD_API_IS_QUANTIZED = false;
//    private static final String TF_OD_API_MODEL_FILE = "yolov4-416-fp32.tflite";//"yolov4-416-new.tflite";
//    private static final String TF_OD_API_LABELS_FILE = "file:///android_asset/coco.txt";
//
//    private Classifier detector;
//
//    Bitmap sourceBitmap = null;
//    Bitmap cropBitmap = null;
//
//    Context context = null;
//    private List<String> resultArray = null;
//    private List<Integer> finalResult = null;
////    Handler handler = null;
////    HandlerThread handlerThread = null;
//
//    String[] resultAverage = null;
//    int averageCount = 0;
//    boolean processingImg = false;
//    int AVERAGING_NUMBER = 4;
//
//    public AIAlgorithm(Context ctx){
//        this.context = ctx;
//
//        try {
//            detector =
//                    YoloV4Classifier.create(
//                            ctx.getAssets(),
//                            TF_OD_API_MODEL_FILE,
//                            TF_OD_API_LABELS_FILE,
//                            TF_OD_API_IS_QUANTIZED);
//        } catch (final IOException e) {
//            e.printStackTrace();
//            //LOGGER.e(e, "Exception initializing classifier!");
////            Toast toast =
////                    Toast.makeText(
////                            getApplicationContext(), "Classifier could not be initialized", Toast.LENGTH_SHORT);
////            toast.show();
////            finish();
//        }
//
//        //handlerThread = new HandlerThread("detect");
//        //handlerThread.start();
//
//    }
//
//    public void setBitmap(Bitmap srcbmp){
//        this.sourceBitmap = srcbmp;
//        this.cropBitmap = Utils.processBitmap(sourceBitmap, TF_OD_API_INPUT_SIZE);
//    }
//
//    public void startDetect(){
//        //handler = new android.os.Handler(handlerThread.getLooper());
//        if(!processingImg) {
//            new Thread(() -> {
//                processingImg = true;
//                final List<Classifier.Recognition> results = detector.recognizeImage(this.cropBitmap);
//
//                /*handler = new Handler();
//                handler.post(new Runnable() {
//                    @Override
//                    public void run() {*/
//                        handleResult(results);
//                    /*}
//                });*/
//            }).start();
//        }
//    }
//
//    public List getResult(){
//        return finalResult;
//    }
//
//    private void handleResult(List<Classifier.Recognition> results) {
//
//        float minimumConfidence = MINIMUM_CONFIDENCE_TF_OD_API;
//
//        Map sortMap = new TreeMap();
//        for (final Classifier.Recognition result : results) {
//            if(results.size() == 8) {
//                final RectF location = result.getLocation();
//                if (location != null && result.getConfidence() >= minimumConfidence) {
//                    if(result.getDetectedClass() == 0){ //yellow
//                        sortMap.put(result.getId(), "Y ");
//                    }else if(result.getDetectedClass() == 1) { //pink
//                        sortMap.put(result.getId(), "P ");
//                    }else{
//                        sortMap.put(result.getId(), "N ");
//                    }
//
//                    result.setLocation(location);
//                }
//            }
//        }
//
//        //Collection<Integer> correctValues = sortMap.values();
//        //int[] targetArray = correctValues.toArray(new Integer[]);
//        if(results.size() == 8) {
//            resultArray = new LinkedList<>(sortMap.values());
//
//            if(resultAverage == null) {
//                resultAverage = new String[AVERAGING_NUMBER];
//                for(int i=0;i<AVERAGING_NUMBER;i++){
//                    resultAverage[i] = "";
//                }
//            }
//
//            for (String value : resultArray) {
//                if(value != null && value.trim() != null) {
//                    resultAverage[averageCount] += value.trim();
//                }
//            }
//            averageCount++;
//            if(averageCount ==AVERAGING_NUMBER){ //Return result here
//                finalResult = new ArrayList<Integer>();
//                List asList = Arrays.asList(resultAverage);
//                Set<String> mySet = new HashSet<>(asList);
//                String resultVal = "";
//
//                int maxfreq = 0;
//                for(String s: mySet) {
//                    if (Collections.frequency(asList, s) > maxfreq) {
//                        if (s != "") {
//                            maxfreq = Collections.frequency(asList, s);
//                            resultVal = s; //Max value
//                        }
//                    }
//                    System.out.println(s + " " + Collections.frequency(asList, s));
//                }
//
//                if(resultVal != null) {
//                    for (int i = 0; i < resultVal.length(); i++) {
//                        if (resultVal.charAt(i) == 'Y') {
//                            finalResult.add(0);
//                        } else if (resultVal.charAt(i) == 'P') {
//                            finalResult.add(1);
//                        } else if (resultVal.charAt(i) == 'N') {
//                            finalResult.add(0);
//                        }
//                    }
//                }
//
//                resultAverage = null;
//                averageCount = 0;
//                resultArray = null;
//                MainActivity.hueResult = finalResult;
//            }
//
//        }
//        processingImg = false;
//    }
//}
