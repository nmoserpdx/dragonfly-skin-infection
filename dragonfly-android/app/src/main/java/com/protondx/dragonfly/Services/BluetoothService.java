package com.protondx.dragonfly.Services;

import static com.protondx.dragonfly.MainActivity.getMainActivity;

import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;
import android.view.View;

import androidx.annotation.Nullable;

import com.protondx.dragonfly.interfaces.MainActivityCallback;

public class BluetoothService extends Service {
    private BluetoothAdapter mBluetoothAdapter;
    private static final int REQUEST_ENABLE_BT = 1;
    private MainActivityCallback mainActivityCallback;
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("BT SERVICE", "SERVICE STARTED");
//        bluetoothIn = new Handler() {
//
//            public void handleMessage(android.os.Message msg) {
//                Log.d("DEBUG", "handleMessage");
//                if (msg.what == handlerState) {                                     //if message is what we want
//                    String readMessage = (String) msg.obj;                                                                // msg.arg1 = bytes from connect thread
//                    recDataString.append(readMessage);
//
//                    Log.d("RECORDED", recDataString.toString());
//                    // Do stuff here with your data, like adding it to the database
//                }
//                recDataString.delete(0, recDataString.length());                    //clear all string data
//            }
//        };


        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();  // get Bluetooth adapter
        mainActivityCallback=getMainActivity().getInterfaceInstance();
        CheckBlueToothState();
        return super.onStartCommand(intent, flags, startId);
    }
    @Override
    public void onDestroy() {
        super.onDestroy();
//        bluetoothIn.removeCallbacksAndMessages(null);
//        stopThread = true;
//        if (mConnectedThread != null) {
//            mConnectedThread.closeStreams();
//        }
//        if (mConnectingThread != null) {
//            mConnectingThread.closeSocket();
//        }
        Log.d("SERVICE", "onDestroy");
    }

    private void CheckBlueToothState(){
        if (mBluetoothAdapter == null){
            Log.e("bluetooth","Bluetooth NOT support");
        }else{
            if (mBluetoothAdapter.isEnabled()){
                if (mBluetoothAdapter.isDiscovering()) {
                    mBluetoothAdapter.cancelDiscovery();
                }
                if(mBluetoothAdapter.getScanMode()!= BluetoothAdapter.SCAN_MODE_CONNECTABLE_DISCOVERABLE){
                    //    System.out.println(BluetoothAdapter.SCAN_MODE_CONNECTABLE_DISCOVERABLE);
                }
                boolean m=mBluetoothAdapter.startDiscovery();
                if(m){
                    mainActivityCallback.onStartsearch("Searching for nearby Devices");
                    Log.e("bluetooth","Bluetooth is currently in device discovery process.");
                }else{
                    Log.e("bluetooth","Bluetooth is Enabled.");
//                    if (mDeviceSearchCallBack != null)
//                        searchForBluetoothDeviceNew(mDeviceSearchCallBack);

                }
            }else{
                Log.e("bluetooth","Bluetooth is NOT Enabled!");
                Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                getMainActivity().startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
            }
        }
    }
}
