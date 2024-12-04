package com.protondx.dragonfly.gmm;

import android.graphics.Bitmap;
import android.os.Environment;
import android.util.Log;

import org.opencv.android.Utils;
import org.opencv.calib3d.Calib3d;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint2f;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class CropCard {

    public Mat TL_TL_CV, TL_TR_CV, TL_BR_CV, TL_BL_CV;
    public Mat TR_TL_CV, TR_TR_CV, TR_BR_CV, TR_BL_CV;
    public Mat BR_TL_CV, BR_TR_CV, BR_BR_CV, BR_BL_CV;
    public Mat BL_TL_CV, BL_TR_CV, BL_BR_CV, BL_BL_CV;
    public Mat TUBE1_CV;
    public double TUBE_OFFSET_CV;

    //public float CARD_WIDTH = 500.0f;
    public float CARD_WIDTH = 250.0f;

    public static double CARD_RD_WIDTH = 120;
    public static double CARD_RD_HEIGHT = 55;
    public static double CARD_RD_ToPixels = 10;

    public static Point TlTl, TlTr, TlBr, TlBl;
    public static Point TrTl, TrTr, TrBr, TrBl;
    public static Point BrTl, BrTr, BrBr, BrBl;
    public static Point BlTl, BlTr, BlBr, BlBl;
    public static Point[][] points;

    private Mat currentImageToCrop = null;

    public static long apriltagtiming = 0;
    public static boolean apriltag1 = true;
    public static boolean apriltag2 = true;
    public static boolean apriltag3 = true;
    public static boolean apriltag4 = true;

    public CropCard(Mat image){
        currentImageToCrop = image;
    }

    public void initCardArrCV() {
        int[] size = new int[] { 1, 2 };
        TL_TL_CV = new Mat(size, CvType.CV_32FC1);
        TL_TL_CV.put(0, 0, new double[] { 3.5, 3.5 });
        TL_TR_CV = new Mat(size, CvType.CV_32FC1);
        TL_TR_CV.put(0, 0, new double[] { 11.5, 3.5 });
        TL_BR_CV = new Mat(size, CvType.CV_32FC1);
        TL_BR_CV.put(0, 0, new double[] { 11.5, 11.5 });
        TL_BL_CV = new Mat(size, CvType.CV_32FC1);
        TL_BL_CV.put(0, 0, new double[] { 3.5, 11.5 });

        TR_TL_CV = new Mat(size, CvType.CV_32FC1);
        TR_TL_CV.put(0, 0, new double[] { 108.5, 3.5 });
        TR_TR_CV = new Mat(size, CvType.CV_32FC1);
        TR_TR_CV.put(0, 0, new double[] { 116.5, 3.5 });
        TR_BR_CV = new Mat(size, CvType.CV_32FC1);
        TR_BR_CV.put(0, 0, new double[] { 116.5, 11.5 });
        TR_BL_CV = new Mat(size, CvType.CV_32FC1);
        TR_BL_CV.put(0, 0, new double[] { 108.5, 11.5 });

        BR_TL_CV = new Mat(size, CvType.CV_32FC1);
        BR_TL_CV.put(0, 0, new double[] { 108.5, 43.5 });
        BR_TR_CV = new Mat(size, CvType.CV_32FC1);
        BR_TR_CV.put(0, 0, new double[] { 116.5, 43.5 });
        BR_BR_CV = new Mat(size, CvType.CV_32FC1);
        BR_BR_CV.put(0, 0, new double[] { 116.5, 51.5 });
        BR_BL_CV = new Mat(size, CvType.CV_32FC1);
        BR_BL_CV.put(0, 0, new double[] { 108.5, 51.5 });

        BL_TL_CV = new Mat(size, CvType.CV_32FC1);
        BL_TL_CV.put(0, 0, new double[] { 3.5, 43.5 });
        BL_TR_CV = new Mat(size, CvType.CV_32FC1);
        BL_TR_CV.put(0, 0, new double[] { 11.5, 43.5 });
        BL_BR_CV = new Mat(size, CvType.CV_32FC1);
        BL_BR_CV.put(0, 0, new double[] { 11.5, 51.5 });
        BL_BL_CV = new Mat(size, CvType.CV_32FC1);
        BL_BL_CV.put(0, 0, new double[] { 3.5, 51.5 });

        TUBE1_CV = new Mat(size, CvType.CV_32FC1);
        TUBE1_CV.put(0, 0, new double[] { 28.4, 34 });

        TUBE_OFFSET_CV = 8.8;
    }

    public Point ToPoint(double [] position){
        return new Point(position[0] * CARD_RD_ToPixels, position[1] * CARD_RD_ToPixels);
    }

    public void initCardArr_RD(){
        TlTl = ToPoint( new double[] { 3.5, 3.5 } );
        TlTr = ToPoint(new double[] { 11.5, 3.5 });
        TlBr = ToPoint(new double[] { 11.5, 11.5 });
        TlBl = ToPoint(new double[] { 3.5, 11.5 });

        TrTl = ToPoint(new double[] { 108.5, 3.5 });
        TrTr = ToPoint(new double[] { 116.5, 3.5 });
        TrBr = ToPoint(new double[] { 116.5, 11.5 });
        TrBl = ToPoint(new double[] { 108.5, 11.5 });

        BrTl = ToPoint(new double[] { 108.5, 43.5 });
        BrTr = ToPoint(new double[] { 116.5, 43.5 });
        BrBr = ToPoint(new double[] { 116.5, 51.5 });
        BrBl = ToPoint(new double[] { 108.5, 51.5 });

        BlTl = ToPoint(new double[] { 3.5, 43.5 });
        BlTr = ToPoint(new double[] { 11.5, 43.5 });
        BlBr = ToPoint(new double[] { 11.5, 51.5 });
        BlBl = ToPoint(new double[] { 3.5, 51.5 });

        points = new Point[][]{
                { TlBl, TlBr, TlTr, TlTl },
                { TrBl, TrBr, TrTr, TrTl },
                { BrBl, BrBr, BrTr, BrTl },
                { BlBl, BlBr, BlTr, BlTl }
        };
    }

    public Mat calculateMean(Mat m) {
        Mat mean = new Mat(1, m.cols(), CvType.CV_32FC1);
        double arr[] = new double[2];
        for (int j = 0; j < m.cols(); j++) {
            Scalar m1 = Core.mean(m.col(j));
            arr[j] = m1.val[0];
        }
        mean.put(0, 0, arr[0], arr[1]);
        return mean;
    }

    public Mat subsMatrix(Mat m1, Mat m2) {
        Mat mean = new Mat(m1.rows(), m1.cols(), CvType.CV_32FC1);
        double arr[] = new double[m1.rows() * m1.cols()];
        float arrtemp[] = new float[2];
        float m2arr[] = new float[2];
        m2.get(0, 0, m2arr);
        int rowcnt = 0;
        for (int j = 0; j < m1.rows() * m1.cols(); j += 2) {
            m1.get(rowcnt, 0, arrtemp);
            arr[j] = arrtemp[0] - m2arr[0];
            arr[j + 1] = arrtemp[1] - m2arr[1];
            rowcnt = rowcnt + 1;
        }
        mean.put(0, 0, arr);
        return mean;
    }

    public Mat normMatrix(Mat m1) {
        Mat norm = new Mat(m1.rows(), 1, CvType.CV_32FC1);
        double arr[] = new double[16];
        for (int j = 0; j < m1.rows(); j++) {
            double m = Core.norm(m1.row(j), Core.NORM_L2);
            arr[j] = m;
        }
        norm.put(0, 0, arr);
        return norm;
    }

    public Mat multiplyMat(Mat m1, Mat m2) { // Multiply 1D array with 2D array numpy style
        Mat result = new Mat(m2.rows(), m2.cols(), CvType.CV_32FC1);
        float arr[] = new float[3];
        float destarr[] = new float[3];
        m2.get(0, 0, destarr);
        float resultArr[] = new float[3];
        for (int i = 0; i < m1.rows(); i++) {
            m1.get(i, 0, arr);
            resultArr[i] = (arr[0] * destarr[0]) + (arr[1] * destarr[1]) + (arr[2] * destarr[2]);
        }
        result.put(0, 0, resultArr);
        return result;
    }

    public Mat get_normalization_transform_CV(Mat pts) throws NullPointerException{
        Mat centroid = calculateMean(pts);// Core.mean(pts);
        float[] d = new float[2];
        centroid.get(0, 0, d);
        Mat subsdest = new Mat(pts.rows(), pts.cols(), CvType.CV_32FC1);
        subsdest = subsMatrix(pts, centroid);
        Mat dist = normMatrix(subsdest);
        Scalar mean_dist = Core.mean(dist);
        int[] size = new int[] { 1, 3 };
        Mat a = new Mat(size, CvType.CV_32FC1);
        a.put(0, 0, new double[] { 1, 0, d[0] * -1 });
        Mat b = new Mat(1, 3, CvType.CV_32FC1);
        b.put(0, 0, new double[] { 0, 1, d[1] * -1 });
        Mat c = new Mat(1, 3, CvType.CV_32FC1);
        c.put(0, 0, new double[] { 0, 0, 1 });
        List listA = new ArrayList();
        listA.add(a);
        listA.add(b);
        listA.add(c);
        Mat translation = new Mat();
        Core.vconcat(listA, translation);
        Mat e = new Mat(1, 3, CvType.CV_32FC1);
        e.put(0, 0, new double[] { 1 / mean_dist.val[0], 0, 0 });
        Mat f = new Mat(1, 3, CvType.CV_32FC1);
        f.put(0, 0, new double[] { 0, 1 / mean_dist.val[0], 0 });
        Mat g = new Mat(1, 3, CvType.CV_32FC1);
        g.put(0, 0, new double[] { 0, 0, 1 });

        List listB = new ArrayList();
        listB.add(e);
        listB.add(f);
        listB.add(g);
        Mat scale = new Mat();
        Core.vconcat(listB, scale);
        Core.multiply(scale, new Scalar(Math.sqrt(2)), scale);
        Mat transform = scale.matMul(translation);
        return transform;
    }

    private double getSlopeOfLine(double x1, double y1, double x2, double y2) {
        double xDis = x2 - x1;
        if (xDis == 0)
            return -9999; // return something unique kind of impossible to get (needs to be tested)
        return (y2 - y1) / xDis;
    }

    private boolean checkAprilTagHorizontal(Mat frame){
        Mat gray = new Mat();
        Imgproc.cvtColor(frame, gray, Imgproc.COLOR_RGB2GRAY);

        int size = (int) (gray.total() * gray.channels());
        byte[] buffer = new byte[size];
        gray.get(0,0,buffer);
        List<ApriltagDetection> tag_positions;
        long start_time = System.currentTimeMillis();
        tag_positions = ApriltagNative.apriltag_detect_yuv(buffer, frame.width(), frame.height());
        apriltagtiming = System.currentTimeMillis() - start_time;
        //Log.d("Apriltag", Long.toString(System.currentTimeMillis() - start_time));
        int[] index = new int[80];
        int idx = 0;
        for(int i = 0; i< tag_positions.size();i++) {
            if(tag_positions.get(i).getHamming() != 0) {
                if (tag_positions.get(i).getDecision_margin() < 60) {
                    index[idx] = i;
                    idx++;
                    continue;
                }
            }
        }
        for(int i=idx;i>0;i--){
            tag_positions.remove(index[i-1]);
        }

        if(tag_positions.size() < 3){
            return false;
        }
        //Check slope of april tag lines and reject when they aren't close to parallel
        /*double x1=0,x2=0,y1=0,y2=0;
        double slopeA = 0;
        for (int i = 0; i < tag_positions.size(); i++) {
            if (tag_positions.get(i).getId() == 0) { //top left
                x1= tag_positions.get(i).getC()[0];
                y1 = tag_positions.get(i).getC()[1];
            }
            if (tag_positions.get(i).getId() == 1) { //top right
                x2= tag_positions.get(i).getC()[0];
                y2 = tag_positions.get(i).getC()[1];
            }
        }
        slopeA = getSlopeOfLine(x1, y1, x2, y2);
        double deg = Math.atan(slopeA);
        Log.d("Slope Info", Double.toString(deg));*/
        return true;
    }

    private int findGoodTags(Mat mask)
    {
        int goodTags = 0;
        for (int i = 0; i < mask.rows(); i += 4)
        {
            int good = 0;
            for (int j = 0; j < 4; j++)
            {
                byte value [] = new byte[1];
                mask.get((i+j), 0, value);
                int val = (int)value[0];
                if (val != 0)
                {
                    good++;
                }
            }
            if (good == 4)
            {
                goodTags++;
            }
        }
        return goodTags;
    }

    public Mat findCardHomographyCV_RD(Mat frame) throws ArrayIndexOutOfBoundsException{
        Mat gray = new Mat();
        if(frame == null){
            return null;
        }
        Imgproc.cvtColor(frame, gray, Imgproc.COLOR_RGB2GRAY);

        int size = (int) (gray.total() * gray.channels());
        byte[] buffer = new byte[size];
        gray.get(0,0,buffer);
        List<ApriltagDetection> tag_positions;
        long start_time = System.currentTimeMillis();
        tag_positions = ApriltagNative.apriltag_detect_yuv(buffer, frame.width(), frame.height());
        if(tag_positions == null){
            return null;
        }
        if(tag_positions.size() <= 0){
            return null;
        }
        apriltagtiming = System.currentTimeMillis() - start_time;
        //Log.d("Apriltag", Long.toString(System.currentTimeMillis() - start_time));
        int[] index = new int[80];
        int idx = 0;
        for(int i = 0; i< tag_positions.size();i++) {
            if(tag_positions.get(i).getHamming() != 0) {
                if (tag_positions.get(i).getDecision_margin() < 60) {
                    index[idx] = i;
                    idx++;
                    continue;
                }
            }
        }
        for(int i=idx;i>0;i--){
            tag_positions.remove(index[i-1]);
        }

        if(tag_positions.size() <= 0){
            gray.release();
            tag_positions.clear();
            return null;
        }

        if(tag_positions.size() < 3){
            gray.release();
            tag_positions.clear();
            return null;
        }

        initCardArr_RD();

        List srcPoints = new ArrayList<Point>();
        List dstPoints = new ArrayList<Point>();

        int pointLocation = 0;

        for(int i = 0; i< tag_positions.size();i++) {
            if(tag_positions.get(i).getId() == 0){
                apriltag1 = true;
                pointLocation = 0;
            }
            if(tag_positions.get(i).getId() == 1){
                apriltag2 = true;
                pointLocation = 1;
            }
            if(tag_positions.get(i).getId() == 2){
                apriltag3 = true;
                pointLocation = 3;
            }
            if(tag_positions.get(i).getId() == 3){
                apriltag4 = true;
                pointLocation = 2;
            }
            /*int id = tag_positions.get(i).getId();
            if(id > 3){ //Wrong ID detected
                continue;
            }*/
            Point[] cardpts = points[pointLocation];
            Point bl = new Point(tag_positions.get(i).getCorner()[0], tag_positions.get(i).getCorner()[1]);
            Point br = new Point(tag_positions.get(i).getCorner()[2], tag_positions.get(i).getCorner()[3]);
            Point tr = new Point(tag_positions.get(i).getCorner()[4], tag_positions.get(i).getCorner()[5]);
            Point tl = new Point(tag_positions.get(i).getCorner()[6], tag_positions.get(i).getCorner()[7]);

            srcPoints.add(bl);
            srcPoints.add(br);
            srcPoints.add(tr);
            srcPoints.add(tl);

            Collections.addAll(dstPoints, cardpts);
            //dstPoints.add(Arrays.asList(cardpts));
        }

        MatOfPoint2f c_pts = null;

        if(srcPoints.size() == 12){
            c_pts = new MatOfPoint2f((Point) (srcPoints.get(0)), (Point) (srcPoints.get(1)), (Point) (srcPoints.get(2)),
                    (Point) (srcPoints.get(3)), (Point) (srcPoints.get(4)), (Point) (srcPoints.get(5)), (Point) (srcPoints.get(6)),
                    (Point) (srcPoints.get(7)), (Point) (srcPoints.get(8)), (Point) (srcPoints.get(9)), (Point) (srcPoints.get(10)),
                    (Point) (srcPoints.get(11)));
        }else{
            c_pts = new MatOfPoint2f((Point) (srcPoints.get(0)), (Point) (srcPoints.get(1)), (Point) (srcPoints.get(2)),
                    (Point) (srcPoints.get(3)), (Point) (srcPoints.get(4)), (Point) (srcPoints.get(5)), (Point) (srcPoints.get(6)),
                    (Point) (srcPoints.get(7)), (Point) (srcPoints.get(8)), (Point) (srcPoints.get(9)), (Point) (srcPoints.get(10)),
                    (Point) (srcPoints.get(11)), (Point) (srcPoints.get(12)), (Point) (srcPoints.get(13)), (Point) (srcPoints.get(14)),
                    (Point) (srcPoints.get(15)));
        }

        MatOfPoint2f i_pts = null;
        if(dstPoints.size() == 12) {
            i_pts = new MatOfPoint2f((Point) (dstPoints.get(0)), (Point) (dstPoints.get(1)), (Point) (dstPoints.get(2)),
                    (Point) (dstPoints.get(3)), (Point) (dstPoints.get(4)), (Point) (dstPoints.get(5)), (Point) (dstPoints.get(6)),
                    (Point) (dstPoints.get(7)), (Point) (dstPoints.get(8)), (Point) (dstPoints.get(9)), (Point) (dstPoints.get(10)),
                    (Point) (dstPoints.get(11)));
        }else{
            i_pts = new MatOfPoint2f((Point) (dstPoints.get(0)), (Point) (dstPoints.get(1)), (Point) (dstPoints.get(2)),
                    (Point) (dstPoints.get(3)), (Point) (dstPoints.get(4)), (Point) (dstPoints.get(5)), (Point) (dstPoints.get(6)),
                    (Point) (dstPoints.get(7)), (Point) (dstPoints.get(8)), (Point) (dstPoints.get(9)), (Point) (dstPoints.get(10)),
                    (Point) (dstPoints.get(11)), (Point) (dstPoints.get(12)), (Point) (dstPoints.get(13)), (Point) (dstPoints.get(14)),
                    (Point) (dstPoints.get(15)));
        }

        Mat mask = new Mat();
        Mat H_t = Calib3d.findHomography(c_pts, i_pts, Calib3d.RANSAC, 3, mask);

        int goodTags = findGoodTags(mask);

        //Following code is only for reference
//        StringBuilder byteMask = new StringBuilder(mask.rows());
//        for (int i = 0; i < mask.rows(); i++)
//        {
//            byte value [] = new byte[1];
//            mask.get(i, 0, value);
//            byteMask.append((value[0] == 0) ? "0" : "1");
//        }

        Mat subs = null;

        //Mat warped = new Mat((int) (widthMax), (int) (heightMax), CvType.CV_32FC1);
        if (goodTags >= 2) {
            Mat warped = new Mat();
            Imgproc.warpPerspective(frame, warped, H_t, new Size((int) (1200), (int) (550))); // - (diff/2)

            //On the crop check if april tag is there for legit check
//            boolean test = checkAprilTagHorizontal(warped);
//            if (test == false) { //Check if the crop has at least 3 april tags after processing
//                return null;
//            }
            subs = warped;
            if(Gmmdetection.DEBUG_ENABLED) {
                File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/crop");
                Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + Gmmdetection.fileName + "_crop.jpg", warped);
            }

            int top = (int) (warped.rows() * 0.25);
            int topless = (int) (warped.rows() * 0.15);
            int bottom = warped.rows() - topless;//top;
            int left = (int) (warped.cols() * 0.2);
            int right = (int) (warped.cols() - left);
            int diffwid = right - left;
            int diffheight = bottom - top;
            Rect r = new Rect(left, top, diffwid, diffheight);
            subs = warped.submat(r);

        /*    int w = 800;
            float ratio = (float) subs.width() / subs.height();
            int h = (int) (w / ratio);
            Imgproc.resize(subs, subs, new Size(w, h), Imgproc.INTER_CUBIC);*/
        }else{
            c_pts.release();
            i_pts.release();
            mask.release();
            H_t.release();
            return null;
        }

        return subs;
    }

    public Mat findCardHomographyCV(Mat frame) {
        Mat gray = new Mat();
        Imgproc.cvtColor(frame, gray, Imgproc.COLOR_RGB2GRAY);

        int size = (int) (gray.total() * gray.channels());
        byte[] buffer = new byte[size];
        gray.get(0,0,buffer);
        List<ApriltagDetection> tag_positions;
        long start_time = System.currentTimeMillis();
        tag_positions = ApriltagNative.apriltag_detect_yuv(buffer, frame.width(), frame.height());
        apriltagtiming = System.currentTimeMillis() - start_time;
        //Log.d("Apriltag", Long.toString(System.currentTimeMillis() - start_time));
        int[] index = new int[80];
        int idx = 0;
        for(int i = 0; i< tag_positions.size();i++) {
            if(tag_positions.get(i).getHamming() != 0) {
                if (tag_positions.get(i).getDecision_margin() < 60) {
                    index[idx] = i;
                    idx++;
                    continue;
                }
            }
        }
        for(int i=idx;i>0;i--){
            tag_positions.remove(index[i-1]);
        }

        if(tag_positions.size() < 3){
            return null;
        }

        initCardArrCV();

        Mat card_pts = null;
        Mat img_pts = null;

        List blk1 = new ArrayList();
        blk1.add(TL_BL_CV);
        blk1.add(TL_BR_CV);
        blk1.add(TL_TR_CV);
        blk1.add(TL_TL_CV);

        List blk2 = new ArrayList();
        blk2.add(TR_BL_CV);
        blk2.add(TR_BR_CV);
        blk2.add(TR_TR_CV);
        blk2.add(TR_TL_CV);

        List blk3 = new ArrayList();
        blk3.add(BR_BL_CV);
        blk3.add(BR_BR_CV);
        blk3.add(BR_TR_CV);
        blk3.add(BR_TL_CV);

        List blk4 = new ArrayList();
        blk4.add(BL_BL_CV);
        blk4.add(BL_BR_CV);
        blk4.add(BL_TR_CV);
        blk4.add(BL_TL_CV);

        List cornerArr = new ArrayList();

        String s = null;

        for (int i = 0; i < tag_positions.size(); i++) {
            if (tag_positions.get(i).getId() == 0) {
                try {
                    if (card_pts == null) {
                        card_pts = new Mat(TL_BL_CV.rows() + TL_BR_CV.rows() + TL_TR_CV.rows() + TL_TL_CV.rows(), 2,
                                CvType.CV_32FC1);
                        Core.vconcat(blk1, card_pts);
                    } else {
                        blk1.add(0, card_pts);
                        Core.vconcat(blk1, card_pts);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                Mat corner = new Mat(4, 2, CvType.CV_32FC1);
                corner.put(0, 0, tag_positions.get(i).getCorner());
                try {
                    if (img_pts == null) {
                        img_pts = corner;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (tag_positions.get(i).getId() == 1) {
                if (card_pts == null) {
                    card_pts = new Mat(TL_BL_CV.rows() + TL_BR_CV.rows() + TL_TR_CV.rows() + TL_TL_CV.rows(), 2,
                            CvType.CV_32FC1);
                    Core.vconcat(blk2, card_pts);
                } else {
                    blk2.add(0, card_pts);
                    Core.vconcat(blk2, card_pts);
                }
                Mat corner = new Mat(4, 2, CvType.CV_32FC1);
                corner.put(0, 0, tag_positions.get(i).getCorner());
                if (img_pts == null) {
                    img_pts = corner;
                } else {
                    cornerArr.clear();
                    cornerArr.add(0, img_pts);
                    cornerArr.add(corner);
                    Core.vconcat(cornerArr, img_pts);
                }
            } else if (tag_positions.get(i).getId() == 2) {
                if (card_pts == null) {
                    card_pts = new Mat(TL_BL_CV.rows() + TL_BR_CV.rows() + TL_TR_CV.rows() + TL_TL_CV.rows(), 2,
                            CvType.CV_32FC1);
                    Core.vconcat(blk4, card_pts);
                } else {
                    blk4.add(0, card_pts);
                    Core.vconcat(blk4, card_pts);
                }
                Mat corner = new Mat(4, 2, CvType.CV_32FC1);
                corner.put(0, 0, tag_positions.get(i).getCorner());
                if (img_pts == null) {
                    img_pts = corner;
                } else {
                    cornerArr.clear();
                    cornerArr.add(0, img_pts);
                    cornerArr.add(corner);
                    Core.vconcat(cornerArr, img_pts);
                }
            } else if (tag_positions.get(i).getId() == 3) {
                if (card_pts == null) {
                    card_pts = new Mat(TL_BL_CV.rows() + TL_BR_CV.rows() + TL_TR_CV.rows() + TL_TL_CV.rows(), 2,
                            CvType.CV_32FC1);
                    Core.vconcat(blk3, card_pts);
                } else {
                    blk3.add(0, card_pts);
                    Core.vconcat(blk3, card_pts);
                }
                Mat corner = new Mat(4, 2, CvType.CV_32FC1);
                corner.put(0, 0, tag_positions.get(i).getCorner());
                if (img_pts == null) {
                    img_pts = corner;
                } else {
                    cornerArr.clear();
                    cornerArr.add(0, img_pts);
                    cornerArr.add(corner);
                    Core.vconcat(cornerArr, img_pts);
                }
            } else {
                //Do nothing
            }
        }

        Mat ones = Mat.ones(card_pts.rows(), 1, CvType.CV_32FC1);
        Mat card_pts_homogeneous = new Mat(card_pts.rows(), ones.cols() + card_pts.cols(), CvType.CV_32FC1);
        List e = new ArrayList();
        e.add(card_pts);
        e.add(ones);
        try {
            Core.hconcat(e, card_pts_homogeneous);
        } catch (Exception f) {
            f.printStackTrace();
        }

        Mat img_pts_homogeneous = new Mat(card_pts.rows(), ones.cols() + card_pts.cols(), CvType.CV_32FC1);
        e = new ArrayList();
        e.add(img_pts);
        e.add(ones);
        try {
            Core.hconcat(e, img_pts_homogeneous);
        } catch (Exception f) {
            f.printStackTrace();
        }

// card_pts_homogeneous.add
        Mat T_card = null;
        Mat T_img = null;
        try {
            T_card = get_normalization_transform_CV(card_pts);
            T_img = get_normalization_transform_CV(img_pts);
        }catch(NullPointerException exp){
            return null;
        }

        Core.transpose(card_pts_homogeneous, card_pts_homogeneous);

        Mat cpt = new Mat(3, 4, CvType.CV_32FC1);

        try {
            cpt = T_card.matMul(card_pts_homogeneous);
        } catch (Exception j) {
            j.printStackTrace();
        }

        Core.transpose(cpt, cpt);
        Mat card_pts_t = cpt.submat(0, cpt.rows(), 0, 2);

        Core.transpose(img_pts_homogeneous, img_pts_homogeneous);
        Mat ipt = new Mat(3, 4, CvType.CV_32FC1);
        try {
            ipt = T_img.matMul(img_pts_homogeneous);
        } catch (Exception j) {
            j.printStackTrace();
        }

        Core.transpose(ipt, ipt);
        Mat img_pts_t = ipt.submat(0, ipt.rows(), 0, 2);

        float arr[] = new float[2];
        List c_arr = new ArrayList<Point>();
        List i_arr = new ArrayList<Point>();

        for (int r = 0; r < card_pts_t.rows(); r++) {
            card_pts_t.get(r, 0, arr);
            c_arr.add(new Point(arr[0], arr[1]));
        }
        for (int r = 0; r < img_pts_t.rows(); r++) {
            img_pts_t.get(r, 0, arr);
            i_arr.add(new Point(arr[0], arr[1]));
        }

        MatOfPoint2f c_pts = null;

        if(c_arr.size() == 12){
            c_pts = new MatOfPoint2f((Point) (c_arr.get(0)), (Point) (c_arr.get(1)), (Point) (c_arr.get(2)),
                    (Point) (c_arr.get(3)), (Point) (c_arr.get(4)), (Point) (c_arr.get(5)), (Point) (c_arr.get(6)),
                    (Point) (c_arr.get(7)), (Point) (c_arr.get(8)), (Point) (c_arr.get(9)), (Point) (c_arr.get(10)),
                    (Point) (c_arr.get(11)));
        }else{
            c_pts = new MatOfPoint2f((Point) (c_arr.get(0)), (Point) (c_arr.get(1)), (Point) (c_arr.get(2)),
                    (Point) (c_arr.get(3)), (Point) (c_arr.get(4)), (Point) (c_arr.get(5)), (Point) (c_arr.get(6)),
                    (Point) (c_arr.get(7)), (Point) (c_arr.get(8)), (Point) (c_arr.get(9)), (Point) (c_arr.get(10)),
                    (Point) (c_arr.get(11)), (Point) (c_arr.get(12)), (Point) (c_arr.get(13)), (Point) (c_arr.get(14)),
                    (Point) (c_arr.get(15)));
        }

        MatOfPoint2f i_pts = null;
        if(c_arr.size() == 12) {
            i_pts = new MatOfPoint2f((Point) (i_arr.get(0)), (Point) (i_arr.get(1)), (Point) (i_arr.get(2)),
                    (Point) (i_arr.get(3)), (Point) (i_arr.get(4)), (Point) (i_arr.get(5)), (Point) (i_arr.get(6)),
                    (Point) (i_arr.get(7)), (Point) (i_arr.get(8)), (Point) (i_arr.get(9)), (Point) (i_arr.get(10)),
                    (Point) (i_arr.get(11)));
        }else{
            i_pts = new MatOfPoint2f((Point) (i_arr.get(0)), (Point) (i_arr.get(1)), (Point) (i_arr.get(2)),
                    (Point) (i_arr.get(3)), (Point) (i_arr.get(4)), (Point) (i_arr.get(5)), (Point) (i_arr.get(6)),
                    (Point) (i_arr.get(7)), (Point) (i_arr.get(8)), (Point) (i_arr.get(9)), (Point) (i_arr.get(10)),
                    (Point) (i_arr.get(11)), (Point) (i_arr.get(12)), (Point) (i_arr.get(13)), (Point) (i_arr.get(14)),
                    (Point) (i_arr.get(15)));
        }

        Mat H_t = Calib3d.findHomography(c_pts, i_pts, Calib3d.RANSAC);

        Mat T_img_inv = T_img.inv();
        T_img_inv.convertTo(T_img_inv, CvType.CV_64FC1);

        H_t.convertTo(H_t, CvType.CV_64FC1);
        T_card.convertTo(T_card, CvType.CV_64FC1);
        Mat multiplied = H_t.matMul(T_card);

        Mat finalval = T_img_inv.matMul(multiplied);

        return finalval;
    }

    public Mat crop_to_card_CV(Mat img, Mat H) {

        Mat a = new Mat(1, 3, CvType.CV_32FC1);
        a.put(0, 0, new double[] { 0.0, 0.0, 1.0 }); // 3

        Mat b = new Mat(1, 3, CvType.CV_32FC1);
        b.put(0, 0, new double[] { 120.0, 0.0, 1.0 }); // 120

        Mat c = new Mat(1, 3, CvType.CV_32FC1);
        c.put(0, 0, new double[] { 120.0, 55.0, 1.0 }); // 122/68

        Mat d = new Mat(1, 3, CvType.CV_32FC1);
        d.put(0, 0, new double[] { 0.0, 55.0, 1.0 }); // 68

        Mat e = multiplyMat(H, a); // H.matMul(a1);
        Mat f = multiplyMat(H, b);// H.matMul(b1);
        Mat g = multiplyMat(H, c); // H.matMul(c1);
        Mat h = multiplyMat(H, d); // H.matMul(d1);

        Mat tl = e.submat(0, 1, 0, 2);// (0, 2));
        Mat tr = f.submat(0, 1, 0, 2);// (0, 2));
        Mat br = g.submat(0, 1, 0, 2);// (0, 2));
        Mat bl = h.submat(0, 1, 0, 2);// (0, 2));

        Mat widthTop = new Mat(1, 2, CvType.CV_32FC1);
        Mat widthBottom = new Mat(1, 2, CvType.CV_32FC1);
        Mat heightLeft = new Mat(1, 2, CvType.CV_32FC1);
        Mat heightRight = new Mat(1, 2, CvType.CV_32FC1);

        Core.subtract(tr, tl, widthTop);
        double wT = Core.norm(widthTop);
        Core.subtract(br, bl, widthBottom);
        double wB = Core.norm(widthBottom);
        Core.subtract(bl, tl, heightLeft);
        double hL = Core.norm(heightLeft);
        Core.subtract(br, tr, heightRight);
        double hR = Core.norm(heightRight);

        double widthMax = Math.max(wT, wB);
        double heightMax = Math.max(hL, hR);

        Mat dst = new Mat(4, 2, CvType.CV_32FC1);
        Mat u = new Mat(1, 2, CvType.CV_32FC1);
        Mat v = new Mat(1, 2, CvType.CV_32FC1);
        Mat w = new Mat(1, 2, CvType.CV_32FC1);
        Mat x = new Mat(1, 2, CvType.CV_32FC1);
        u.put(0, 0, new double[] { 0, 0 });
        v.put(0, 0, new double[] { widthMax - 1, 0 });
        w.put(0, 0, new double[] { widthMax - 1, heightMax - 1 });
        x.put(0, 0, new double[] { 0, heightMax - 1 });

        List listB = new ArrayList();
        listB.add(u);
        listB.add(v);
        listB.add(w);
        listB.add(x);
        Core.vconcat(listB, dst);

        List listA = new ArrayList();
        listA.add(tl);
        listA.add(tr);
        listA.add(br);
        listA.add(bl);
        Mat finalres = new Mat(4, 2, CvType.CV_32FC1);
        Core.vconcat(listA, finalres);

        float arr[] = new float[2];
        List c_arr = new ArrayList<Point>();
        List i_arr = new ArrayList<Point>();

        for (int r = 0; r < finalres.rows(); r++) {
            finalres.get(r, 0, arr);
            if (r == 0 || r == 1) {
                c_arr.add(new Point(arr[0], arr[1])); // + diff
            } else {
                c_arr.add(new Point(arr[0], arr[1]));
            }
        }
        for (int r = 0; r < dst.rows(); r++) {
            dst.get(r, 0, arr);
            i_arr.add(new Point(arr[0], arr[1]));
        }

        MatOfPoint2f fin = new MatOfPoint2f((Point) (c_arr.get(0)), (Point) (c_arr.get(1)), (Point) (c_arr.get(2)),
                (Point) (c_arr.get(3)));
        MatOfPoint2f dst_o = new MatOfPoint2f((Point) (i_arr.get(0)), (Point) (i_arr.get(1)), (Point) (i_arr.get(2)),
                (Point) (i_arr.get(3)));

        Mat warp = Imgproc.getPerspectiveTransform(fin, dst_o);
        warp.convertTo(warp, CvType.CV_32FC1);
        Mat warped = new Mat((int) (widthMax), (int) (heightMax), CvType.CV_32FC1);

        Imgproc.warpPerspective(img, warped, warp, new Size((int) (widthMax), (int) (heightMax))); // - (diff/2)
        return warped;
    }

    public Mat scale_image(Mat img) {
        Mat resized = null;
        if (img.cols() > img.rows()) {
            float width = CARD_WIDTH;
            float scale = ((int)(CARD_WIDTH)) / img.cols();
            float height = img.rows() * scale;
            if (img.cols() > ((int)(CARD_WIDTH))) {
                scale = img.cols() / width;
                height = img.rows() / scale;
            }
            resized = new Mat(((int) width), ((int) height), CvType.CV_8UC3);
            if (width != 0 && scale > 0) {
                resized = new Mat(((int) width), ((int) height), CvType.CV_8UC3);
                Imgproc.resize(img, resized, new Size(width, height));
            }
        } else {
            float height = CARD_WIDTH;
            float scale = ((int)(CARD_WIDTH)) / img.rows();
            float width = img.cols() * scale;
            if (img.rows() > ((int)(CARD_WIDTH))) {
                scale = img.rows() / width;
                width = img.cols() / scale;
            }
            if (width != 0 && scale > 0) {
                resized = new Mat(((int) width), ((int) height), CvType.CV_8UC3);
                Imgproc.resize(img, resized, new Size(width, height));
            }
        }
        if (resized != null) {
            return resized;
        }
        return img;
    }

    public Mat prepImgTestCV(boolean scale) {
        //if(img == null){
        Mat img = currentImageToCrop;
        float checkratio = 0.0f;
        if(Gmmdetection.DEBUG_ENABLED){
            checkratio = 2.3f;
        }else{
            checkratio = 2.7f;
        }
        //}
        Mat copyImg = img.clone();
        Mat copyImg1 = img.clone();
        Mat H = findCardHomographyCV(copyImg);
        if(H == null){
            return null;
        }
        H.convertTo(H, CvType.CV_32FC1);
        Mat image = crop_to_card_CV(copyImg1, H);
        float ratio = (float) image.width()/image.height();
        Log.d("Imageratio", Double.toString(ratio) + " " + Double.toString(image.width()) + " " + Double.toString(image.height()));
        Bitmap bmp1 = Bitmap.createBitmap(image.cols(), image.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(image, bmp1); //This bmp needs to be saved //Sachin
        if(image == null){ // || (image.width() < 1000)){ //Nick randell's suggestion
            return null;
        }
        if(ratio > checkratio){
            return null;
        }
        //checking april tag horizontal
        /*boolean test = checkAprilTagHorizontal(image);
        if(test == false){ //Check if the crop has at least 3 april tags after processing
            return null;
        }*/
        if(Gmmdetection.DEBUG_ENABLED) {
            File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + ".jpg", image);
        }
        Mat image_new = null;
        if(scale == true){
            /*Bitmap bmp = Bitmap.createBitmap(image.cols(), image.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(image, bmp); //This bmp needs to be saved //Sachin
            setImage(bmp, "crop");*/
            int top = (int) (image.rows() * 0.25);
            int bottom = image.rows() - top;
            int left = (int) (image.cols() * 0.2);
            int right = (int) (image.cols() - left);
            int diffwid = right - left;
            int diffheight = bottom - top;
            Rect r = new Rect(left, top, diffwid, diffheight);
            Mat subs = image.submat(r);
            /*bmp = Bitmap.createBitmap(subs.cols(), subs.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(subs, bmp); //This bmp needs to be saved //Sachin
            setImage(bmp, "tube");*/
            image_new = scale_image(subs);
        }else{
            image_new = image; //Only card for AI
        }
        return image_new;
    }

}