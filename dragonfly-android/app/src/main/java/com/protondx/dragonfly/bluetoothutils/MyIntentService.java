package com.protondx.dragonfly.bluetoothutils;

import android.app.job.JobParameters;
import android.app.job.JobService;

public class MyIntentService extends JobService {
    @Override
    public boolean onStartJob(JobParameters jobParameters) {






        return true;
    }

    @Override
    public boolean onStopJob(JobParameters jobParameters) {
        return true;
    }
}
