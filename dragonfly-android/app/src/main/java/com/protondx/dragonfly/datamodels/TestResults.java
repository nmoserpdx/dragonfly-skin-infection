package com.protondx.dragonfly.datamodels;

import java.io.Serializable;

public class TestResults implements Serializable {
    private String loginData;
    private String testResult;
    private String id,sql_id;

    public String getSql_id() {
        return sql_id;
    }

    public void setSql_id(String sql_id) {
        this.sql_id = sql_id;
    }

    public TestResults(String loginData, String testResult, String id) {
        this.loginData = loginData;
        this.testResult = testResult;
        this.id = id;
    }

    public TestResults() {

    }

    public void setLoginData(String loginData) {
        this.loginData = loginData;
    }

    public void setTestResult(String testResult) {
        this.testResult = testResult;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLoginData() {
        return loginData;
    }

    public String getTestResult() {
        return testResult;
    }

    public String getId() {
        return id;
    }
}
