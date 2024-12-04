package com.protondx.dragonfly.interfaces;

public class ApiInterfaces {
    interface ICommonApiResponse{
        void onSuccess();
        void onFailure(int statusCode);
    }
}
