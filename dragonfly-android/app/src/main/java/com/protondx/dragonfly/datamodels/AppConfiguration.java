package com.protondx.dragonfly.datamodels;

import java.io.Serializable;

public class AppConfiguration implements Serializable {
    private String sample_ids;

    public String getSample_ids() {
        return sample_ids;
    }

    public void setSample_ids(String sample_ids) {
        this.sample_ids = sample_ids;
    }

    public String getTest_panel_ids() {
        return test_panel_ids;
    }

    public void setTest_panel_ids(String test_panel_ids) {
        this.test_panel_ids = test_panel_ids;
    }

    private String test_panel_ids;

    public AppConfiguration(String sample_ids, String test_panel_ids) {
        this.sample_ids = sample_ids;
        this.test_panel_ids = test_panel_ids;
    }

    public AppConfiguration() {

    }
}
