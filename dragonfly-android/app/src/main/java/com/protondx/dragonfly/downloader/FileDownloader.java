package com.protondx.dragonfly.downloader;

import androidx.annotation.NonNull;

import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;

public class FileDownloader extends Thread implements Runnable {
    private String url;
    private String path;
    private DownloaderCallback listener = null;
    private String filename;

    public FileDownloader(String path, String url, @NonNull String filename) {
        this.path = path;
        this.url = url;
        this.filename = filename;
    }

    public void run() {
        try {
            URL url = new URL(this.url);
            URLConnection urlConnection = url.openConnection();
            urlConnection.connect();

//            String filename = urlConnection.getHeaderField("Content-Disposition");
//            // your filename should be in this header... adapt the next line for your case
//            filename = filename.substring(filename.indexOf("filename")+10, filename.length()-2);

            int total = urlConnection.getContentLength();
            int count;

            InputStream input = new BufferedInputStream(url.openStream());
            OutputStream output = new FileOutputStream(path + "/" + filename);

            byte data[] = new byte[4096];
            long current = 0;

            while ((count = input.read(data)) != -1) {
                current += count;
                if (listener != null) {
                    listener.onProgress((int) ((current * 100) / total));
                }
                output.write(data, 0, count);
            }

            output.flush();

            output.close();
            input.close();

            if (listener != null) {
                listener.onFinish();
            }
        } catch (Exception e) {
            if (listener != null)
                listener.onError(e.getMessage());
        }
    }

    public void setDownloaderCallback(DownloaderCallback listener) {
        this.listener = listener;
    }

    public interface DownloaderCallback {
        void onProgress(int progress);

        void onFinish();

        void onError(String message);
    }
}
