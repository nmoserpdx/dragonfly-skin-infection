package com.protondx.dragonfly.gmm;
import org.opencv.core.Point;

public class Tube {

    Point center = null;

    public Point getCenter() {
        return center;
    }
    public void setCenter(Point center) {
        this.center = center;
    }
    public int getRadius() {
        return radius;
    }
    public void setRadius(int radius) {
        this.radius = radius;
    }
    int radius = 0;

}
