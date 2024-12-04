package com.protondx.dragonfly.fileserver;

import android.content.Context;
import android.content.res.AssetManager;
import android.util.Log;

import androidx.core.content.ContextCompat;

import com.protondx.dragonfly.IMainActivityInterface;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import fi.iki.elonen.NanoHTTPD;

public class HttpFileServer extends NanoHTTPD {
    private final Context mContext;
    private String randomHeader;
    private  int version_numberw;
    private IMainActivityInterface mainActivityInterfaceImpl;

    public HttpFileServer(int port, Context activityContext,int version_number) {
        super(port);
        generateRandomVerificationHeader();
        mContext = activityContext;
        version_numberw=version_number;
        mainActivityInterfaceImpl = (IMainActivityInterface) mContext;
    }

    private void generateRandomVerificationHeader() {
        randomHeader = UUID.randomUUID().toString();
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();
        String verificationHeader = session.getHeaders().get("x-verification");
        if (!uri.contains("index") || verificationHeader != null && verificationHeader.equals(getRandomHeader())) {
            Log.d("HttpUri", uri);
            AssetManager assets = mContext.getAssets();
            if (uri == "/") {
                uri = "index.html";
            }
            if (uri.startsWith("/")) {
                uri = uri.substring(1);
            }
            try {

//                InputStream fileInputStream = assets.open(uri);
               String sourceDirectory = (ContextCompat.getDataDir(mContext).getAbsolutePath() + "/pwa_"+version_numberw);
//               String sourceDirectory = (ContextCompat.getDataDir(mContext).getAbsolutePath() + "/pwa_test");

                Log.d("LookingFor..", sourceDirectory + '/' + uri);
                InputStream fileInputStream = new FileInputStream(sourceDirectory + '/' + uri);
                String mimeType = NanoHTTPD.getMimeTypeForFile(sourceDirectory + '/' + uri);

//            BufferedInputStream bis = new BufferedInputStream(fileInputStream);
//            ByteArrayOutputStream buf = new ByteArrayOutputStream();
//            for (int result = bis.read(); result != -1; result = bis.read()) {
//                buf.write((byte) result);
//            }
                return newFixedLengthResponse(Response.Status.OK, mimeType, fileInputStream, fileInputStream.available());
            } catch (IOException e) {
                e.printStackTrace();
            }
            mainActivityInterfaceImpl.showNewVersionDownloadButton(true);
            return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Please wait while we download additional software...");
        }

        return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Invalid Request!!. Wrong Headers...." + verificationHeader);
//        return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Chor Chor Chor Chor!!. Wrong Headers...." + verificationHeader);

    }
    public void setVersionNumber(int v)
    {
        version_numberw=v;
    }
    public String getRandomHeader() {
        return randomHeader;
    }
}

