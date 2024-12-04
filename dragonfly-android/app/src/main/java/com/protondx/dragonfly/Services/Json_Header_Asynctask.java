package com.protondx.dragonfly.Services;

import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;


public class Json_Header_Asynctask extends AsyncTask<String, String, String> {
    static int responseCode;

    @Override
    protected String doInBackground(String... urls) {
        try {
            return String.valueOf(fetchDetailedInfo(urls[0],urls[1] ,urls[2]));
        } catch (IOException e) {
            e.printStackTrace();
            return null;

        }
    }


    private String fetchDetailedInfo(String newurl, String header , String json) throws IOException {
        InputStream is = null;
        try {

            URL url = new URL(newurl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(100000 /* milliseconds */);
            conn.setConnectTimeout(105000 /* milliseconds */);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("X-AuthorityToken",Constants.auth_token);
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
            conn.setRequestProperty("X-AccessToken",header);
            conn.setDoInput(true);
            conn.setDoOutput(true);
            Log.e("x-auth-token : ",""+header);
            Log.e("URL : ",""+newurl);
            Log.e("JSON =",""+json);
            OutputStream os = conn.getOutputStream();
            BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(os, "UTF-8"));

            writer.write(json);

            writer.flush();
            writer.close();
            os.close();
            conn.connect();
            responseCode = conn.getResponseCode();
            if(responseCode == 200){
                is = conn.getInputStream();
            }else{
                is = conn.getErrorStream();
            }

            String contentAsString = convertStreamToString(is);

            Log.e("Response Code","---->"+responseCode);
            return contentAsString;
        } finally {
            if (is != null) {
                is.close();
            }
        }
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
    public static int getResponseCode() {
        return responseCode;
    }
}