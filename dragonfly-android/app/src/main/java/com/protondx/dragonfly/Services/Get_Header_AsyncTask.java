package com.protondx.dragonfly.Services;


import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;


public class Get_Header_AsyncTask extends AsyncTask<String, String, String> {
    static int responseCode;

    @Override
    protected String doInBackground(String... urls) {
        try {
            return String.valueOf(fetchDetailedInfo(urls[0],urls[1],urls[2]));
        } catch (IOException e) {
            e.printStackTrace();
            return null;

        }
    }

    private String fetchDetailedInfo(String newurl,String header , String header1) throws IOException {
        InputStream is = null;
        String contentAsString="";
        try {

            URL url = new URL(newurl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(50000 /* milliseconds */);
            conn.setConnectTimeout(55000 /* milliseconds */);
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
         //   conn.setRequestProperty(header, header1);
            conn.setRequestProperty("X-AuthorityToken",Constants.auth_token);
            Log.e("URL : ",""+newurl);
            // Starts the query
            conn.connect();
            responseCode = conn.getResponseCode();
            if(responseCode == 200){
                is = conn.getInputStream();
            }else{
                is = conn.getErrorStream();
            }

            contentAsString = convertStreamToString(is);

            Log.e("Response Code","---->"+responseCode);
            return contentAsString;
        } finally {
            if (is != null) {
                is.close();
            }
        }
    }




    public static int getResponseCode() {
        return responseCode;
    }
    private String convertStreamToString(InputStream is) throws UnsupportedEncodingException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"), 8);
        StringBuilder sb = new StringBuilder();
        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return sb.toString();
    }
}



