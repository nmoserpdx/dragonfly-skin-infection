package com.protondx.dragonfly.models.lacewingconnectivitymodel;



import java.util.List;

public class SerialCommandResponseModel {
    private String error;
    private String message;
    private List<Integer> messageArray;

    public SerialCommandResponseModel(String error, String message, List<Integer> messageArray) {
        this.error = error;
        this.message = message;
        this.messageArray = messageArray;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Integer> getMessageArray() {
        return messageArray;
    }

    public void setMessageArray(List<Integer> messageArray) {
        this.messageArray = messageArray;
    }
}
