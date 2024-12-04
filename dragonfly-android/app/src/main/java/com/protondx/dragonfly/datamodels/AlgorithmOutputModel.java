package com.protondx.dragonfly.datamodels;

import android.graphics.Bitmap;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

public class AlgorithmOutputModel {
    private String datamatrix;
    private List<Integer> algorithm;
    private String image;
    private String error;
    public AlgorithmOutputModel() {

    }
    public AlgorithmOutputModel(String datamatrix, List<Integer> algorithm) {
        this.datamatrix = datamatrix;
        this.algorithm = algorithm;
    }

    public String getDatamatrix() {
        return datamatrix;
    }

    public void setDatamatrix(String datamatrix) {
        this.datamatrix = datamatrix;
    }

    public List<Integer> getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(List<Integer> algorithm) {
        if(algorithm != null) {
            this.algorithm = new ArrayList<>(algorithm);
        }else{
            this.algorithm = new ArrayList<>();
        }
        //this.algorithm = algorithm;
    }

    public String getImage() {
        return image;
    }

    public void setImage(Bitmap image) {
        if(image != null) {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            image.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
            this.image = encoded;
        }
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

}
