package com.protondx.dragonfly.Services;

import android.app.job.JobParameters;
import android.app.job.JobService;
import android.util.Log;

import com.protondx.dragonfly.database.DbHandler;
import com.protondx.dragonfly.datamodels.TestResults;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class UploadService extends JobService {
    private static String TAG="pdx_uploadService";
    private int uploadInprocess=0;
    @Override
    public boolean onStartJob(JobParameters jobParameters) {

        Log.d(TAG,"job Started");
        doBackgroudTask(jobParameters);
        return true;
    }

    private void doBackgroudTask(JobParameters jobParameters) {

        new Thread(new Runnable() {
            @Override
            public void run() {
                checkData();
                jobFinished(jobParameters,false);
            }
        }).start();
    }

    private void checkData() {
        String token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Mzc0MDA4ODcsIm5iZiI6MTYzNzQwMDg4NywianRpIjoiYjdiNTc3YWItMjI0Mi00NDYxLThmNGItNzJkZjc0ZjJjMjE2IiwiZXhwIjoxNjM3NDAxNzg3LCJpZGVudGl0eSI6IlZpdjIwMjEtMTEtMjBUMDk6MzQ6NDcuNjA5MzE1IiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hetnuDSYFlVQElAha6xn2wTWWaBAIrY3swztuNOr6-E";

        DbHandler dbHandler =new DbHandler(UploadService.this);
        ArrayList<TestResults>testResults= dbHandler.getAllResults(token);
        Log.e("unUploadedResult",testResults.size()+"");

        for (int i=0;i<testResults.size();i++)
        {

                UploadToServer(testResults.get(i));
            try{

                Thread.sleep(1000);
            }catch(InterruptedException ex){
               Log.e("uploadService",ex.toString());
            }

        }




    }

    private void UploadToServer(TestResults testResults) {

        String token="";
        String data="";
        try {
            JSONObject jsonObject=new JSONObject(testResults.getTestResult());
            if(jsonObject.has("data")&&jsonObject.getJSONObject("data")instanceof JSONObject)
            {
                JSONObject jsonObject1=jsonObject.getJSONObject("data");
                data=jsonObject1.toString();
            }
            if(jsonObject.has("config")&&jsonObject.getJSONObject("config")instanceof JSONObject)
            {
                JSONObject jsonObject2=jsonObject.getJSONObject("config");
                if(jsonObject2.has("headers")&&jsonObject2.get("headers")instanceof JSONObject)
                {

                        JSONObject jsonObject3 = jsonObject2.getJSONObject("headers");
                        token = jsonObject3.has("X-AccessToken") ? jsonObject3.getString("X-AccessToken") : "";

                }

            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        new Json_Header_Asynctask()
        {
            @Override
            public void onPostExecute(String result) {
                if (getResponseCode() == 200 || getResponseCode() == 201) {
                    Log.e("<==== Result", "==========>" + result);
                   DbHandler dbHandler =new DbHandler(UploadService.this);
                   dbHandler.deleteresult(testResults.getId());
                    Log.d(TAG,"Uploaded");





                }
                else
                {
                Log.e(TAG,"UploadFailed");
                }

            }
        }.execute(Constants.add_Result,token,data);



    }



    @Override
    public boolean onStopJob(JobParameters jobParameters) {
        Log.e(TAG,"job cancelled before completion");
        return true;
    }

}
