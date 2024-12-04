package com.protondx.dragonfly.interfaces;

import android.os.Bundle;

public interface IMainActivityInterface {
    void setMainProgressBarVisibility(boolean visible);
    void showToastMessage(String messsage);
    void getPairedLacewingDevices(ILaceWingDeviceSearchInterface searchCallback);
    void requestPermission(int permissionRequestCode, IPermissionResultCallback callback);
    IPreparedSampleDisplayInterface addNewPreparedSample();
    boolean getIsDebugMode();
    void setDebugMode(boolean isDebugEnabled);
}
