package com.protondx.dragonfly.gmm;

import com.protondx.dragonfly.datamodels.AlgorithmOutputModel;

public class Key_value {
    int key;
    AlgorithmOutputModel value;

    public void setKey(int key) {
        this.key = key;
    }

    public void setValue(AlgorithmOutputModel value) {
        this.value = value;
    }

    public int getKey() {
        return key;
    }

    public Key_value(int key, AlgorithmOutputModel value) {
        this.key = key;
        this.value = value;
    }

    public AlgorithmOutputModel getValue() {
        return value;
    }
}
