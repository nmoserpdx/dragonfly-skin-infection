package com.protondx.dragonfly.interfaces;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;

public interface ILaceWingConnectivityInterface{
    void onLaceWingConnected(BluetoothDevice device);
    void onLaceWingConnected(BluetoothDevice device, BluetoothSocket socket);

    void onLacewingConnectionFailed(BluetoothDevice device);
    void onReceiveData(String value);
}
