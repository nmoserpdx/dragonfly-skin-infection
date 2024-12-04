package com.protondx.dragonfly;

import android.graphics.Bitmap;

import androidx.annotation.NonNull;

import com.protondx.dragonfly.interfaces.ILaceWingDeviceSearchInterface;
import com.scandit.datacapture.core.capture.DataCaptureContext;
import com.scandit.datacapture.core.common.ContextStatus;

import javax.xml.transform.Result;

public interface IMainActivityInterface {
    void handleResult(Result rawResult);

    public void framesFromHtmlCamera(Bitmap frame,boolean isQrCodeMode);
    public void cameraReadyToRecord();
    public void cameraStoppedRecording();
    public void dashboardofflinecall();
    public void insertDataToDb(String json);
    public void logoutCall();
    public void switchUser();

    void onStatusChanged(
            @NonNull DataCaptureContext dataCaptureContext, @NonNull ContextStatus contextStatus
    );

    public void exportCSV(String json);
    public String getDashboardresultsFromDevice(String json);
    public String getInfectiondataFromDevice(String json);
    public String getUserListFromDevice(String json);
    public String getImageFromDevice(String id);
    public String exportdataFromDevice(String id);
    public String getUserResultsFromDevice(String json);
    public void backupState(String json);
    public void initBluetooth();
    public void disconnectBluetoothDevice(String name);
    public void checkForUpdate();
    void showNewVersionDownloadButton(boolean autoDownload);
    public void checkForBTDevice();
    void getPairedLacewingDevices(ILaceWingDeviceSearchInterface searchCallback);
    void setDemoMode(boolean value);
    boolean isDemoMode();
    void ShowNoBluetoothMode();
    void restartApp();
}
