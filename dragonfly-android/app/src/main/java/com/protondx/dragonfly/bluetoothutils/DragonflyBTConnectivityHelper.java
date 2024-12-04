package com.protondx.dragonfly.bluetoothutils;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.os.ParcelUuid;
import android.util.Log;
import android.webkit.WebView;

import androidx.annotation.NonNull;

import com.protondx.dragonfly.interfaces.ILaceWingBluetoothInterface;
import com.protondx.dragonfly.interfaces.ILaceWingDeviceSearchInterface;
import com.protondx.dragonfly.models.lacewingconnectivitymodel.SerialCommandResponseModel;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class DragonflyBTConnectivityHelper extends DragonflyBTSerialConnectionHelper {
    private static List<BluetoothSocket> mBleDevicesSocket;
    private final ILaceWingBluetoothInterface mCallBackInterface;
    private BluetoothDevice currentDevice;
    private WebView webView;


    public DragonflyBTConnectivityHelper(@NonNull ILaceWingBluetoothInterface callBackInterface, @NonNull BluetoothDevice device, @NonNull WebView wv) {
        super(callBackInterface);
        this.mCallBackInterface = callBackInterface;
        this.currentDevice = device;
        //opening socket for ble
        this.webView = wv;
        //            new Timer().scheduleAtFixedRate(new TimerTask() {
//                @Override
//                public void run() {
//                    Log.e("timer","sending command");
//                    MLacewingDeviceConnection.runCommand(socket,"^&043&^");                }
//            }, 1000, 20000);
        super.connectToALacewing(device);
    }



    public static void searchForPairedLacewingDevices(ILaceWingDeviceSearchInterface callback,String connectedDevice) {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter.isEnabled()) {
         //   bluetoothAdapter.startDiscovery();

            Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
            List<BluetoothDevice> pairedLacewingDevices = new ArrayList<>();

            if (pairedDevices.size() > 0) {
                // There are paired devices. Get the name and address of each paired device.
                for (BluetoothDevice device : pairedDevices) {
                    if(device.getUuids()==null){
                        continue;
                    }
                    String lastDevice="EY-015P";
                    if(connectedDevice!=null)
                    {
                        lastDevice=connectedDevice;
                    }
                    if(device.getAlias().contains(lastDevice)){
                        for(ParcelUuid oneUuid : device.getUuids()){
                            Log.e("UUID_TAG",oneUuid.toString());
                            pairedLacewingDevices.add(device);
                        }
                    }
//                    for(ParcelUuid oneUuid : device.getUuids()){
//                        if(oneUuid.toString().equals(myBleUUid.toString())){
//                            pairedLacewingDevices.add(device);
//                        }
//                    }
                    String deviceName = device.getName();
                    String deviceHardwareAddress = device.getAddress(); // MAC address
                    Log.d("BLUETOOTH_PAIRED", deviceName + "<<---->>" + deviceHardwareAddress);

                }
                if (callback != null) {
                    callback.onPairedDevicesFound(pairedLacewingDevices);
                }
            }
        }
    }


//    public  void runCommandOnDevice(String commandToExecute, int param1,int param2,int callId){
//        byte[] command = LacewingCommandHelper.getCommandToExecute(commandToExecute,param1,param2);
//
//            ExecuteCommand(command,callId);
//
//    }
//    public  void runCommandOnDevice(String commandToExecute, int param1,int param2,int callId,ILaceWingBluetoothInterface callback){
//        byte[] command = LacewingCommandHelper.getCommandToExecute(commandToExecute,param1,param2);
//
//            ExecuteCommand(command,callId,callback);
//
//
//    }
    public SerialCommandResponseModel runCommandOnDevice(String commandToExecute, int param1, int param2){
        byte[] command = DragonflyBTHelper.getCommandToExecute(commandToExecute,param1,param2);
        if(CurrentDeviceSocket.isConnected()) {
            return ExecuteCommandNew(command);
        }
        else {
            return new SerialCommandResponseModel("Bluetooth Socket is not connected",null,null);
        }

    }
    public SerialCommandResponseModel runCommandOnDevice_new(String commandToExecute,BluetoothSocket CurrentDeviceSockets ){
        byte[] command = DragonflyBTHelper.getCommandToExecute_new(commandToExecute);
        CurrentDeviceSocket=CurrentDeviceSockets;
        if(CurrentDeviceSockets.isConnected()) {
            return ExecuteCommandNew(commandToExecute.getBytes());
        }
        else {
            return new SerialCommandResponseModel("Bluetooth Socket is not connected",null,null);
        }

    }
    public void sendDataToUI(String data){
        if(data != null && data.length() > 0) {
            String temp = data.replaceAll("(\\r|\\n)", "");
            webView.post(() -> {
                webView.evaluateJavascript("javascript:qrCodeOutput(\'" + temp + "\');", null);
            });
        }
    }

    public void closeDeviceConnection(){
        try {
            CurrentDeviceSocket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public static void unPairDevice(String deviceName)
    {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter.isEnabled()) {
            Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
            List<BluetoothDevice> pairedLacewingDevices = new ArrayList<>();

            if (pairedDevices.size() > 0) {
                for (BluetoothDevice device : pairedDevices) {
                    if(device.getUuids()==null){
                        continue;
                    }
                    if(device.getAddress().equalsIgnoreCase(deviceName)){
                        try {
                            Method m = device.getClass()
                                    .getMethod("removeBond", (Class[]) null);
                            m.invoke(device, (Object[]) null);
                        } catch (Exception e) {
                            Log.e("BLUETOOTH_UNPAIRED", e.getMessage());
                        }
                    }

                }

            }
        }



    }
    public void runCommand( BluetoothDevice device,BluetoothSocket socket, String s)
    {
        OutputStream outStream = null;
        bluetoothAdapter.cancelDiscovery();
        if(socket==null)
        {
                        try {
                            socket = device.createInsecureRfcommSocketToServiceRecord(myBleUUid);
            } catch (IOException e) {
                Log.e("BT", "ON START: Socket creation failed.", e);
            }
        }

        Log.e("socket is","executing command");
        if(socket==null)
        {
            Log.e("socket is","null");
            return;
        }
        try {
            outStream = socket.getOutputStream();
            if(outStream!=null)
            {
                try
                {
                    outStream.write(s.getBytes());
                    outStream.flush(); // Try flush to force sending data in buffer
                    Log.d("BT", "sendTestByte: OutputStream write succeeded.");
                } catch (IOException e)
                {
                    Log.e("BT", "sendTestByte: OutputStream writefailed.", e);
                }
            }else
            {
                Log.e("BT", "outStream is null");

            }

        } catch (IOException e) {
            Log.e("BT", "sendTestByte: OutputStream creation failed.", e);
        }
    }
}
