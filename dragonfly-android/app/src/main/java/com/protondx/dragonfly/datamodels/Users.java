package com.protondx.dragonfly.datamodels;

import java.io.Serializable;

public class Users implements Serializable {
    private String orgId,name,email,id;
    private int no_of_test;
    private String permission_gr;
    private String tests;
    private String heaterData="";
    private String token="";
    private boolean isLogin=false;

    public void setLogin(boolean login) {
        isLogin = login;
    }

    public boolean isLogin() {
        return isLogin;
    }

    public Users() {

    }

    public void setHeaterData(String heaterData) {
        this.heaterData = heaterData;
    }

    public String getHeaterData() {
        return heaterData;
    }

    public Users(String orgId, String name, String email, String id, int no_of_test, String permission_gr, String tests, String heaterData,boolean isLogin,String token) {
        this.orgId = orgId;
        this.name = name;
        this.email = email;
        this.id = id;
        this.no_of_test = no_of_test;
        this.permission_gr = permission_gr;
        this.tests = tests;
        this.heaterData = heaterData;
        this.isLogin=isLogin;
        this.token=token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setNo_of_test(int no_of_test) {
        this.no_of_test = no_of_test;
    }

    public void setPermission_gr(String permission_gr) {
        this.permission_gr = permission_gr;
    }

    public void setTests(String tests) {
        this.tests = tests;
    }

    public String getOrgId() {
        return orgId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getId() {
        return id;
    }

    public int getNo_of_test() {
        return no_of_test;
    }

    public String getPermission_gr() {
        return permission_gr;
    }

    public String getTests() {
        return tests;
    }
}
