package com.protondx.dragonfly.interfaces;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;

import java.util.List;

public interface ILaceWingDeviceSearchInterface{
    void onDeviceSearchSuccess();
    void onDeviceSearchFailed();
    void connectDevice(BluetoothDevice device);

    void onPairedDevicesFound(List<BluetoothDevice> pairedLacewingDevices);
}
