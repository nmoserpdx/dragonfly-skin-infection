package com.protondx.dragonfly;

import android.content.Context;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class JsInterface {

    private final IMainActivityInterface mCallback;
    private final Context mContext;

    public JsInterface(IMainActivityInterface callback, Context ctx) {
        this.mCallback = callback;
        mContext = ctx;
    }

    public JsInterface(Context mainActivityInterface) {
        this.mCallback = (IMainActivityInterface) mainActivityInterface;
        mContext = mainActivityInterface;
    }

    @JavascriptInterface
    public void  logoutCall()
    {
        mCallback.logoutCall();

    }
    @JavascriptInterface
    public void  switchUser()
    {

      mCallback.switchUser();

    }

    @JavascriptInterface
    public void dashboardofflinecall(){
        mCallback.dashboardofflinecall();
    }

    @JavascriptInterface
    public String getDashboardresultsFromDevice(String json)
    {

     return mCallback.getDashboardresultsFromDevice(json);

    }
    @JavascriptInterface
    public String getInfectiondataFromDevice(String json)
    {

        return mCallback.getInfectiondataFromDevice(json);

    }
    @JavascriptInterface
    public String getUserResultsFromDevice(String json)
    {

        return mCallback.getUserResultsFromDevice(json);

    }
    @JavascriptInterface
    public String getImageFromDevice(String id)
    {

        return mCallback.getImageFromDevice(id);

    }
    @JavascriptInterface
    public String getUserListFromDevice(String json)
    {

        return mCallback.getUserListFromDevice(json);

    }
    @JavascriptInterface
    public String exportdataFromDevice(String json)
    {

        return mCallback.exportdataFromDevice(json);

    }
    @JavascriptInterface
    public void exportCSV(String json)
    {

        mCallback.exportCSV(json);
    }
    @JavascriptInterface
    public void backupState(String json)
    {

        mCallback.backupState(json);
    }
    @JavascriptInterface
    public void insertDataToDb(String json)
    {
        mCallback.insertDataToDb(json);
    }
    @JavascriptInterface
    public void htmlCameraReadyToRecord(boolean isReady){
        if(mCallback!=null){
            if(isReady){
                mCallback.cameraReadyToRecord();
            }
            else{
                mCallback.cameraStoppedRecording();
            }
        }
    }

    @JavascriptInterface
    public void framesFromHtml(String frame,boolean isQrCode) {
        if(frame==null){
            Log.e("FramesNull","Camera Frame is Null");
            return;
        }
//        Log.d("FramesClass",frame.getClass().getName());
//        Log.d("Frame", String.valueOf(frame));

        if(mCallback!=null){
            try{
                String imgData = frame.substring(frame.indexOf(","));
                InputStream stream = new ByteArrayInputStream(Base64.decode(imgData, Base64.DEFAULT));
                mCallback.framesFromHtmlCamera(BitmapFactory.decodeStream(stream),isQrCode);
            }
            catch (Exception ex){
                ex.printStackTrace();
            }
//            mCallback.framesFromHtmlCamera();
        }
    }
    @JavascriptInterface
    public void initBluetooth()
    {
       // mCallback.ShowNoBluetoothMode();

       mCallback.initBluetooth();
    }
    @JavascriptInterface
    public void disconnectBluetoothDevice(String name)
    {

        mCallback.disconnectBluetoothDevice(name);
    }
    @JavascriptInterface
    public void checkForBTDevice()
    {
        // mCallback.ShowNoBluetoothMode();
        mCallback.checkForBTDevice();
    }
    @JavascriptInterface
    public void checkForUpdate()
    {
        mCallback.checkForUpdate();
    }
    @JavascriptInterface
    public void setDemoMode(boolean value)
    {
        mCallback.setDemoMode(value);
    }
    @JavascriptInterface
    public boolean isDemoMode()
    {
       return mCallback.isDemoMode();
    }
    @JavascriptInterface
    public void restartApp(){
        mCallback.restartApp();
    };


}
