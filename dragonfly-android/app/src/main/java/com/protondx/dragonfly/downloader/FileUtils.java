package com.protondx.dragonfly.downloader;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RawRes;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class FileUtils {

    @NonNull
    public static final void copyFileFromRawToOthers(@NonNull final Context context, @RawRes int id, @NonNull final String targetPath) {
        InputStream in = context.getResources().openRawResource(id);
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(targetPath);
            byte[] buff = new byte[1024];
            int read = 0;
            while ((read = in.read(buff)) > 0) {
                out.write(buff, 0, read);
            }
        } catch (Exception e) {
            Log.e("Copy", "Unable to copy file with copyFileFromRawToOthers(...)\n" + e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
                if (out != null) {
                    out.close();
                }
            } catch (IOException e) {
                Log.e("Copy", "Unable to copy file with copyFileFromRawToOthers(...)\n" + e.getMessage());
                e.printStackTrace();
            }
        }
    }

}
