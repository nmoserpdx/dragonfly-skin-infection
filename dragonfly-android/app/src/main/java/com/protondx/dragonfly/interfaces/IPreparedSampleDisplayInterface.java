package com.protondx.dragonfly.interfaces;
import java.io.Serializable;

public interface IPreparedSampleDisplayInterface extends Serializable {
    void setCurrentStepName(String stepName);
    void pauseCurrentSample(int currentStepIndex);
    int getWaitingForCartridgeTime();
    int getTimeElapsed();
    void removeFromView();
}
