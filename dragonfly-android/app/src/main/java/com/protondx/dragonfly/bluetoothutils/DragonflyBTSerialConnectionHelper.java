package com.protondx.dragonfly.bluetoothutils;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.ContentUris;
import android.os.ParcelUuid;
import android.util.Log;
import android.webkit.WebView;

import androidx.annotation.NonNull;

import com.protondx.dragonfly.interfaces.ILaceWingBluetoothInterface;
import com.protondx.dragonfly.models.lacewingconnectivitymodel.SerialCommandResponseModel;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public abstract class DragonflyBTSerialConnectionHelper {
    private final ILaceWingBluetoothInterface mCallbackInterface;
    protected BluetoothSocket CurrentDeviceSocket;
    static UUID myBleUUid = UUID.fromString("00001101-0000-1000-8000-00805f9b34fb");
    BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    private boolean mIsBluetoothBusy;
    private InputStream currentInputStream = null;

    public DragonflyBTSerialConnectionHelper(@NonNull ILaceWingBluetoothInterface callBackInterface) {
        this.mCallbackInterface = callBackInterface;

    }

    protected SerialCommandResponseModel ExecuteCommandNew(byte[] command) {
        if(mIsBluetoothBusy){
            Log.d("SERIAL_BUSY","Bluetooth is busy");
            return new SerialCommandResponseModel("Bluetooth is busy",null,null);
        }
        mIsBluetoothBusy = true;

        InputStream inputStream = null;
        OutputStream outputStream = null;
        try {
            inputStream = CurrentDeviceSocket.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
            mIsBluetoothBusy=false;
            return new SerialCommandResponseModel("Problem Getting stream " + e.getMessage(), null, null);

        }
        try {
            outputStream = CurrentDeviceSocket.getOutputStream();
        } catch (IOException e) {
            e.printStackTrace();
            mIsBluetoothBusy=false;
            return new SerialCommandResponseModel("Problem Getting out stream " + e.getMessage(), null, null);

        }
//        try {
//            inputStream.reset();
//        } catch (IOException e) {
//            e.printStackTrace();
//            return;
//        }
//        byte[] commandToExecute = hexStringToByteArray("000100000000");
        try {

            InputStream finalInputStream = inputStream;
            long skipped = inputStream.skip(inputStream.available());
            Log.d("Skipped_InputStream", String.valueOf(skipped));

            outputStream.write(command);
            outputStream.flush();
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
//            outputStream.close();

            boolean isStartingReading = false;
            boolean isReadingStringData = false;
            boolean isReadingDataArray = false;
            byte[] buffer = new byte[0];

            String dataString = "";
            StringBuilder dataArrayStringBuilder = new StringBuilder();
            while (true) {
                try {
                    int bytesToRead = 4096;
                    try {
                        bytesToRead = finalInputStream.available();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    buffer = new byte[bytesToRead];
                    finalInputStream.read(buffer, 0, buffer.length);
                    String string = new String(buffer, StandardCharsets.UTF_8);

                    if (string.contains("$")) {
                        string = string.substring(string.indexOf("$") + 1);
                        Log.d("DEVICE_OP", string);
                        isStartingReading = true;
                    }
                    if (isStartingReading) {
                        isStartingReading = false;
                        if (string.contains("[")) {
                            string = string.replace("[", "");
                            isReadingDataArray = true;
                            isReadingStringData = false;

                        } else {
                            isReadingStringData = true;
                            isReadingDataArray = false;
                        }
                    }
                    if (isReadingStringData) {
                        if (string.contains("#")) {

                            dataString += string.replace("#", "");

                            String finalDataString = dataString;
                            mIsBluetoothBusy=false;
//                            ////finalinputStream.close());
                            return new SerialCommandResponseModel(null, finalDataString, null);

                        } else {
                            dataString += string;
                        }


                    }
                    if (isReadingDataArray) {
                        if (string.contains("#")) {
                            string = string.replace('#', ' ').trim();
                            string = string.replace(']', ' ').trim();

                            dataArrayStringBuilder.append(string);
                            Log.d("Array_DATA", String.format("reps is- %s", dataArrayStringBuilder.toString()));
                            mIsBluetoothBusy=false;
                            ////finalinputStream.close());
                            return new SerialCommandResponseModel(null, null, getIntegerArrayFromString(dataArrayStringBuilder.toString()));
                        } else {
                            dataArrayStringBuilder.append(string);
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    mIsBluetoothBusy=false;
                    try{
                        ////finalinputStream.close());
                    }
                    catch (Exception ex){
                        ex.printStackTrace();
                    }
                    return new SerialCommandResponseModel(e.getMessage(), null, null);

                }
            }


        } catch (IOException e) {
            e.printStackTrace();
            mIsBluetoothBusy=false;

            return new SerialCommandResponseModel("Problem Executing " + e.getMessage(), null, null);
        }


    }

//    protected void ExecuteCommand(byte[] command, int callId, ILaceWingBluetoothInterface callback) {
//        InputStream inputStream = null;
//        OutputStream outputStream = null;
//        try {
//            inputStream = CurrentDeviceSocket.getInputStream();
//        } catch (IOException e) {
//            e.printStackTrace();
//            mCallbackInterface.onSerialCommandResponse(new SerialCommandResponseModel("Problem Getting stream " + e.getMessage(), null, null), callId);
//            return;
//        }
//        try {
//            outputStream = CurrentDeviceSocket.getOutputStream();
//        } catch (IOException e) {
//            e.printStackTrace();
//            callback.onSerialCommandResponse(new SerialCommandResponseModel("Problem Getting out stream " + e.getMessage(), null, null), callId);
//            return;
//        }
////        try {
////            inputStream.reset();
////        } catch (IOException e) {
////            e.printStackTrace();
////            return;
////        }
////        byte[] commandToExecute = hexStringToByteArray("000100000000");
//        try {
//            outputStream.write(command);
//            InputStream finalInputStream = inputStream;
//            Thread responseThread = new Thread(new Runnable() {
//                @Override
//                public void run() {
//                    boolean isStartingReading = false;
//                    boolean isReadingStringData = false;
//                    boolean isReadingDataArray = false;
//                    byte[] buffer = new byte[0];
//
//                    String dataString = "";
//                    StringBuilder dataArrayStringBuilder = new StringBuilder();
//                    while (true) {
//                        try {
//                            int bytesToRead = 1024;
//                            try {
//                                bytesToRead = finalInputStream.available();
//                            } catch (IOException e) {
//                                e.printStackTrace();
//                            }
//                            buffer = new byte[bytesToRead];
//                            finalInputStream.read(buffer, 0, buffer.length);
//                            String string = new String(buffer, StandardCharsets.UTF_8);
//
//                            if (string.contains("$")) {
//                                string = string.substring(string.indexOf("$") + 1);
//                                Log.d("DEVICE_OP", string);
//                                isStartingReading = true;
//                            }
//                            if (isStartingReading) {
//                                isStartingReading = false;
//                                if (string.contains("[")) {
//                                    string = string.replace("[", "");
//                                    isReadingDataArray = true;
//                                    isReadingStringData = false;
//
//                                } else {
//                                    isReadingStringData = true;
//                                    isReadingDataArray = false;
//                                }
//                            }
//                            if (isReadingStringData) {
//                                if (string.contains("#")) {
//
//                                    dataString += string.replace("#", "");
//
//                                    String finalDataString = dataString;
//                                    callback.onSerialCommandResponse(new SerialCommandResponseModel(null, finalDataString, null), callId);
//                                    break;
//                                } else {
//                                    dataString += string;
//                                }
//
//
//                            }
//                            if (isReadingDataArray) {
//                                if (string.contains("#")) {
//                                    string = string.replace("]", "");
//                                    string = string.replace("#", "");
//                                    dataArrayStringBuilder.append(string);
//                                    Log.d("Array_DATA", String.format("reps is- %s", dataArrayStringBuilder.toString()));
//                                    callback.onSerialCommandResponse(new SerialCommandResponseModel(null, null, getIntegerArrayFromString(dataArrayStringBuilder.toString())), callId);
//
//                                    break;
//                                } else {
//                                    dataArrayStringBuilder.append(string);
//                                }
//                            }
//                        } catch (IOException e) {
//                            e.printStackTrace();
//                            callback.onSerialCommandResponse(new SerialCommandResponseModel(e.getMessage(), null, null), callId);
//                            break;
//                        }
//                    }
//                }
//            });
//            responseThread.start();
//            responseThread.join();
//
//        } catch (IOException | InterruptedException e) {
//            e.printStackTrace();
//            callback.onSerialCommandResponse(new SerialCommandResponseModel("Problem Executing " + e.getMessage(), null, null), callId);
//            return;
//        }
//    }
//
//    protected void ExecuteCommand(byte[] command, int callId) {
//        ExecuteCommand(command, callId, mCallbackInterface);
//    }

    private List<Integer> getIntegerArrayFromString(String arrayString) {
        String[] arrayData = arrayString.split(",");
        List<Integer> parsedIntArray = new ArrayList<>();
        for (String dataInt :
                arrayData) {
            try {

                dataInt = dataInt.trim();
                dataInt = dataInt.replace("[","").replace("]","").replace("#","").replace("$","");
                parsedIntArray.add(Integer.parseInt(dataInt));
            } catch (NumberFormatException exception) {
                exception.printStackTrace();
            }
        }
        return parsedIntArray;
    }


    protected void connectToALacewing(BluetoothDevice device) {

       // bluetoothAdapter.cancelDiscovery();
        if(device!=null)

        {
            try{
                ParcelUuid[] uuidsService = device.getUuids();
                for (ParcelUuid oneUuid:uuidsService){
                    Log.d("UUIDS",oneUuid.getUuid().toString());
                }
                new connectionThread(device,mCallbackInterface).start();
            }catch (Exception e)
            {

            }

        }





//        new Thread(new Runnable() {
//            @Override
//            public void run() {
//                BluetoothSocket socket = null;
//                try {
//
//                    socket = device.createInsecureRfcommSocketToServiceRecord(myBleUUid);
//                    CurrentDeviceSocket = socket;
////            socket = device.createRfcommSocketToServiceRecord(myBleUUid);
//                } catch (IOException e) {
//                    e.printStackTrace();
//                    closeSocket();
//                    CurrentDeviceSocket = null;
//                    mCallbackInterface.onLacewingConnectionFailed(device);
//                    return;
//                }
//                if (socket == null) {
//                    closeSocket();
//                    CurrentDeviceSocket = null;
//                    mCallbackInterface.onLacewingConnectionFailed(device);
//                    return;
//                }
//
//                try {
//                    CurrentDeviceSocket.connect();
//                    mCallbackInterface.onLaceWingConnected(device);
//                    receiveDataFromSocket();
//                } catch (IOException e) {
//                    e.printStackTrace();
//                    closeSocket();
//                    mCallbackInterface.onLacewingConnectionFailed(device);
//                    return;
//                }
//            }
//        }).start();


    }

    public void closeSocket(){
        if(CurrentDeviceSocket != null) {
            try {
                if(currentInputStream != null) {
                    currentInputStream.close();
                }
                CurrentDeviceSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public abstract void sendDataToUI(String data);

    protected void receiveDataFromSocket(){
        //Testing data access
        //InputStream inputStream = null;
        try {
            currentInputStream = CurrentDeviceSocket.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
            mIsBluetoothBusy=false;
        }
        String dataString = "";
        StringBuilder dataArrayStringBuilder = new StringBuilder();
        byte[] buffer = new byte[0];
        while (CurrentDeviceSocket.isConnected()) {
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
                    sendDataToUI(string);
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
