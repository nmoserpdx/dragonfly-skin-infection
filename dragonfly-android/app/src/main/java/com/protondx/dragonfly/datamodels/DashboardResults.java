package com.protondx.dragonfly.datamodels;

import java.io.Serializable;
import java.util.ArrayList;

public class DashboardResults implements Serializable {

    private String testtoday;
    private String testmonth;
    private String testyear;
    private ArrayList<?> graphdata;
    private String piedata;
    private String january;
    private String febrary;
    private String march;
    private String april;
    private String may;
    private String june;
    private String july;
    private String august;
    private String september;
    private String october;
    private String november;
    private String december;

    public String getJanuary() {
        return january;
    }

    public void setJanuary(String january) {
        this.january = january;
    }

    public String getFebrary() {
        return febrary;
    }

    public void setFebrary(String febrary) {
        this.febrary = febrary;
    }

    public String getMarch() {
        return march;
    }

    public void setMarch(String march) {
        this.march = march;
    }

    public String getApril() {
        return april;
    }

    public void setApril(String april) {
        this.april = april;
    }

    public String getMay() {
        return may;
    }

    public void setMay(String may) {
        this.may = may;
    }

    public String getJune() {
        return june;
    }

    public void setJune(String june) {
        this.june = june;
    }

    public String getJuly() {
        return july;
    }

    public void setJuly(String july) {
        this.july = july;
    }

    public String getAugust() {
        return august;
    }

    public void setAugust(String august) {
        this.august = august;
    }

    public String getSeptember() {
        return september;
    }

    public void setSeptember(String september) {
        this.september = september;
    }

    public String getOctober() {
        return october;
    }

    public void setOctober(String october) {
        this.october = october;
    }

    public String getNovember() {
        return november;
    }

    public void setNovember(String november) {
        this.november = november;
    }

    public String getDecember() {
        return december;
    }

    public void setDecember(String december) {
        this.december = december;
    }

    public String getTesttoday() {
        return testtoday;
    }

    public void setTesttoday(String testtoday) {
        this.testtoday = testtoday;
    }

    public String getTestmonth() {
        return testmonth;
    }

    public void setTestmonth(String testmonth) {
        this.testmonth = testmonth;
    }

    public String getTestyear() {
        return testyear;
    }

    public void setTestyear(String testyear) {
        this.testyear = testyear;
    }

    public ArrayList<?> getGraphdata() {
        return graphdata;
    }

    public void setGraphdata(ArrayList<?> graphdata) {
        this.graphdata = graphdata;
    }

    public String getPiedata() {
        return piedata;
    }

    public void setPiedata(String piedata) {
        this.piedata = piedata;
    }
}
