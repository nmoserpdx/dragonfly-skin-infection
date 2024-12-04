package com.protondx.dragonfly.bluetoothutils;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.util.Log;

import com.protondx.dragonfly.interfaces.ILaceWingConnectivityInterface;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

public class connectionThread extends Thread {

    private final BluetoothSocket mmSocket;
    private final BluetoothDevice mmDevice;
    private BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    private boolean mIsBluetoothBusy;

    static UUID myBleUUid = UUID.fromString("00001101-0000-1000-8000-00805f9b34fb");
    private final ILaceWingConnectivityInterface mCallbackInterface;
    private InputStream currentInputStream = null;

    public connectionThread(BluetoothDevice device, ILaceWingConnectivityInterface mCallbackInterface) {
        this.mCallbackInterface = mCallbackInterface;
        // Use a temporary object that is later assigned to mmSocket
        // because mmSocket is final.
        BluetoothSocket tmp = null;
        mmDevice = device;

        try {
            // Get a BluetoothSocket to connect with the given BluetoothDevice.
            // MY_UUID is the app's UUID string, also used in the server code.
            tmp = device.createInsecureRfcommSocketToServiceRecord(myBleUUid);

        } catch (IOException e) {
            Log.e("Bluetooth", "Socket's create() method failed", e);
        }
        mmSocket = tmp;
    }

    public void run() {
        // Cancel discovery because it otherwise slows down the connection.
        bluetoothAdapter.cancelDiscovery();

        try {
            // Connect to the remote device through the socket. This call blocks
            // until it succeeds or throws an exception.
            if(mmSocket!=null&&mmDevice!=null)
            {
                mmSocket.connect();
                mCallbackInterface.onLaceWingConnected(mmDevice);

                mCallbackInterface.onLaceWingConnected(mmDevice,mmSocket);
            }


        } catch (IOException connectException) {
            // Unable to connect; close the socket and return.
            try {
                mmSocket.close();
                mCallbackInterface.onLacewingConnectionFailed(mmDevice);
            } catch (IOException closeException) {
                Log.e("Bluetooth", "Could not close the client socket", closeException);
            }
            return;
        }

        // The connection attempt succeeded. Perform work associated with
        // the connection in a separate thread.
        new Thread(new Runnable() {
            @Override
                  public void run() {
                receiveDataFromSocket();
                           }
       }).start();


    }

    // Closes the client socket and causes the thread to finish.
    public void cancel() {
        try {
            mmSocket.close();
        } catch (IOException e) {
            Log.e("Bluetooth", "Could not close the client socket", e);
        }
    }

    protected void receiveDataFromSocket(){
        //Testing data access
        //InputStream inputStream = null;
        if(mmSocket!=null)
        {
            try {
                currentInputStream = mmSocket.getInputStream();
            } catch (IOException e) {
                e.printStackTrace();
                mIsBluetoothBusy=false;
            }
            String dataString = "";
            StringBuilder dataArrayStringBuilder = new StringBuilder();
            byte[] buffer = new byte[0];
            while (mmSocket.isConnected()) {
                try {
                    int bytesToRead = 4096;
                    try {
                        bytesToRead = currentInputStream.available();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    buffer = new byte[bytesToRead];
                    currentInputStream.read(buffer, 0, buffer.length);
                    String string = new String(buffer, StandardCharsets.UTF_8);
                    //Push this string to React for parsing
                    if(string.length() > 0) {
                        mCallbackInterface.onReceiveData(string);
                        // sendDataToUI(string);
                        Log.d("Bluetooth_PDX", string);
                    }
                }catch (IOException e) {
                    e.printStackTrace();
                    mIsBluetoothBusy=false;
                    try{
                        ////finalinputStream.close());
                    }
                    catch (Exception ex){
                        ex.printStackTrace();
                    }
                }
            }
        }

    }
}
