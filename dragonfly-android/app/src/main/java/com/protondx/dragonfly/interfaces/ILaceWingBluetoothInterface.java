package com.protondx.dragonfly.interfaces;

import android.bluetooth.BluetoothDevice;

import com.protondx.dragonfly.models.lacewingconnectivitymodel.SerialCommandResponseModel;

import java.util.List;

public interface ILaceWingBluetoothInterface extends ILaceWingConnectivityInterface {
    void onSerialCommandResponse(SerialCommandResponseModel response, int callId);
}
