package com.protondx.dragonfly.gmm;

public class ApriltagDetection {
    public int getId() {
        return id;
    }

    // The decoded ID of the tag
    public int id;

    public int getHamming() {
        return hamming;
    }

    // How many error bits were corrected? Note: accepting large numbers of
    // corrected errors leads to greatly increased false positive rates.
    // NOTE: As of this implementation, the detector cannot detect tags with
    // a hamming distance greater than 2.
    public int hamming;

    public int getDecision_margin() {
        return decision_margin;
    }

    public int decision_margin;

    public double[] getC() {
        return c;
    }

    // The center of the detection in image pixel coordinates.
    public double[] c = new double[2];

    public double[] getCorner() {
        return p;
    }

    public void setCorner(double[] p) {
        this.p = p;
    }

    // The corners of the tag in image pixel coordinates. These always
    // wrap counter-clock wise around the tag.
    // Flattened to [x0 y0 x1 y1 ...] for JNI convenience
    public double[] p = new double[8];
}
