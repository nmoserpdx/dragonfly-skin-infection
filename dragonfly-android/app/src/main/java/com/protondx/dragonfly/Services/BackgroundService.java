package com.protondx.dragonfly.Services;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

import com.protondx.dragonfly.MainActivity;
import com.protondx.dragonfly.database.DbHandler;
import com.protondx.dragonfly.datamodels.AppConfiguration;
import com.protondx.dragonfly.datamodels.TestResults;
import com.protondx.dragonfly.fileserver.HttpFileServer;

import java.util.ArrayList;

public class BackgroundService extends Service {
    private Boolean isRunning=false;
    private int portNumber;

    public static HttpFileServer mServer;
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {

        return null;
    }

    public static  void insertTest(TestResults data, Context ctx)
    {
        DbHandler dbHandler =new DbHandler(ctx);
        dbHandler.insertData(data);
        return;
    }
    public static ArrayList<TestResults>getAllTest(Context ctx,String data)
    {
        ArrayList<TestResults>testResults=new ArrayList<>();
        DbHandler dbHandler =new DbHandler(ctx);
        testResults= dbHandler.getAllResults(data);
        return testResults;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.e("serviceStatus", "Service Started");
        if(intent!=null&&intent.hasExtra("port"))
        {
            portNumber=intent.getIntExtra("port",0);
        }
        DbHandler dbHandler =new DbHandler(getApplicationContext());

     //   startServer();
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.e("serviceStatus", "Service Destroyed");
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {

        Log.e("status","app killed");

        final MainActivity mainActivity = MainActivity.getMainActivity();

        if(mainActivity!=null)
        {
            mainActivity.setSaveState();
        }
        else {
            Log.e("service","activity is null");
        }
        stopSelf();
    }




//    private void startServer() {
//
//        mServer = new HttpFileServer(portNumber, getApplicationContext());
//
//        try {
//            mServer.start();
//
//
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//    }
}
