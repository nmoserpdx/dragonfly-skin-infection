//package com.protondx.dragonfly.opencvalgo;
//
//import org.opencv.android.Utils;
//import org.opencv.core.Core;
//import org.opencv.core.CvType;
//import org.opencv.core.Mat;
//import org.opencv.core.MatOfFloat;
//import org.opencv.core.MatOfInt;
//import org.opencv.core.Point;
//import org.opencv.core.Rect;
//import org.opencv.core.Scalar;
//import org.opencv.core.Size;
//import org.opencv.core.TermCriteria;
//import org.opencv.imgproc.Imgproc;
//import org.opencv.utils.Converters;
//
//import static java.lang.Math.abs;
//
//import android.content.Context;
//import android.content.res.AssetManager;
//import android.graphics.Bitmap;
//import android.graphics.BitmapFactory;
//import android.util.Log;
//
//import com.protondx.dragonfly.MainActivity;
//
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.Collections;
//import java.util.HashMap;
//import java.util.LinkedList;
//import java.util.List;
//import java.util.Map;
//
//
//public class OpenCvAlgorithm {
//
//    //List<Point> parallelLines = null;
//    Mat resultImg = null;
//    Context context = null;
//    boolean processingImg = false;
//    Mat templateImg = null;
//    Mat tubeTemplateImg = null;
//
//    // Creating the empty destination matrix
//    Mat destination = new Mat();
//    Mat imgBlur = new Mat();
//    Mat imgGray = new Mat();
//    Mat imgCanny = new Mat();
//    Mat result = new Mat();
//    Mat eliminate = new Mat();
//    Mat kernel = Mat.ones(new Size(3, 3), 1);
//
//    public OpenCvAlgorithm(Context context) {
//        this.context = context;
//        //System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
//    }
//
//    private double getSlopeOfLine(double[] line) {
//        double xDis = line[2] - line[0];
//        if (xDis == 0)
//            return -9999; // return something unique kind of impossible to get (needs to be tested)
//        return (line[3] - line[1]) / xDis;
//    }
//
//    private double getDistanceSqOfLine(double[] line) {
//        return Math.pow((Math.pow((line[3] - line[1]), 2) + Math.pow((line[2] - line[0]), 2)), 0.5);
//    }
//
//    private boolean distBetLines(double[] a, double[] b) {
//        double slopeA = getSlopeOfLine(a);
//        double slopeB = getSlopeOfLine(b);
//        double c1 = (-slopeA * a[0]) + a[1];
//        double c2 = (-slopeB * b[0]) + b[1];
//        double increSlopeA = (1 + (slopeA * slopeA));
//        double sumSlopeA = Math.pow(increSlopeA, 0.5);
//
//        double dist = Math.abs(c1 - c2) / sumSlopeA;//(Math.pow(sumSlopeA, 0.5));
//        if (dist > 100 && Math.abs(a[1] - a[3]) < 20 && Math.abs(b[1] - b[3]) < 20) {
//            return true;
//        } else {
//            return false;
//        }
//    }
//
//    public void loadTemplate() {
//        AssetManager assetMgr = context.getAssets();
//        Bitmap contourbmp = null;
//        Mat testbmp = new Mat();
//        templateImg = new Mat();
//        tubeTemplateImg = new Mat();
//        try {
//            contourbmp = BitmapFactory.decodeStream(assetMgr.open("contour-box.png"));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        Bitmap bmp32 = contourbmp.copy(Bitmap.Config.ARGB_8888, true);
//        Utils.bitmapToMat(bmp32, testbmp);
//        //Imgproc.cvtColor(testbmp, testbmp, Imgproc.COLOR_BGRA2RGB);
//        Imgproc.cvtColor(testbmp, templateImg, Imgproc.COLOR_BGRA2GRAY);
//
//        //Cleaning up here
//        testbmp.release();
//        contourbmp.recycle();
//        contourbmp = null;
//
//        try {
//            contourbmp = BitmapFactory.decodeStream(assetMgr.open("contour-box1.png"));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        bmp32 = contourbmp.copy(Bitmap.Config.ARGB_8888, true);
//        Utils.bitmapToMat(bmp32, testbmp);
//        Imgproc.cvtColor(testbmp, tubeTemplateImg, Imgproc.COLOR_BGR2GRAY);
//
//        contourbmp.recycle();
//        contourbmp = null;
//    }
//
//    //Not using as of now
//    /*
//    private boolean checkTesttube(Mat img) {
//        Mat imgGray = new Mat();
//        Imgproc.cvtColor(img, imgGray, Imgproc.COLOR_BGR2GRAY);
//
//        Mat destinationconotur = new Mat();
//        int result_cols = img.cols() - img.cols() + 1;
//        int result_rows = img.rows() - img.rows() + 1;
//        Mat result = new Mat(result_rows, result_cols, CvType.CV_8UC1);
//        Imgproc.matchTemplate(imgGray, tubeTemplateImg, result, Imgproc.TM_CCOEFF_NORMED);
//        Core.MinMaxLocResult mmr = Core.minMaxLoc(result);
//        double minMatchQuality = 0.3;
//        if (mmr.maxVal >= minMatchQuality){
//            return true;
//        }
//        return false;
//    }*/
//
//    /*public static List<Mat> cluster(Mat cutout, int k) {
//        Mat samples = cutout.reshape(1, cutout.cols() * cutout.rows());
//        Mat samples32f = new Mat();
//        samples.convertTo(samples32f, CvType.CV_32F, 1.0 / 255.0);
//
//        Mat labels = new Mat();
//        TermCriteria criteria = new TermCriteria(TermCriteria.COUNT, 100, 1);
//        Mat centers = new Mat();
//        Core.kmeans(samples32f, k, labels, criteria, 1, Core.KMEANS_PP_CENTERS, centers);
//        return showClusters(cutout, labels, centers);
//    }
//
//    private static List<Mat> showClusters (Mat cutout, Mat labels, Mat centers) {
//        centers.convertTo(centers, CvType.CV_8UC1, 255.0);
//        centers.reshape(3);
//
//        List<Mat> clusters = new ArrayList<Mat>();
//        for(int i = 0; i < centers.rows(); i++) {
//            clusters.add(Mat.zeros(cutout.size(), cutout.type()));
//        }
//
//        Map<Integer, Integer> counts = new HashMap<Integer, Integer>();
//        for(int i = 0; i < centers.rows(); i++) counts.put(i, 0);
//
//        int rows = 0;
//        for(int y = 0; y < cutout.rows(); y++) {
//            for(int x = 0; x < cutout.cols(); x++) {
//                int label = (int)labels.get(rows, 0)[0];
//                int r = (int)centers.get(label, 2)[0];
//                int g = (int)centers.get(label, 1)[0];
//                int b = (int)centers.get(label, 0)[0];
//                counts.put(label, counts.get(label) + 1);
//                clusters.get(label).put(y, x, b, g, r);
//                rows++;
//            }
//        }
//        System.out.println(counts);
//        return clusters;
//    }*/
//
//    private void calculateHistogram(Mat image) {
//        Imgproc.cvtColor(image, image, Imgproc.COLOR_RGB2GRAY);
//        List<Mat> hsv_planes = new ArrayList<Mat>();
//        Core.split(image, hsv_planes);
//        MatOfInt histSize = new MatOfInt(256);
//        final MatOfFloat histRange = new MatOfFloat(0f, 256f);
//        boolean accumulate = false;
//        Mat h_hist = new Mat();
//        //Mat s_hist = new Mat();
//        //Mat v_hist = new Mat();
//        Imgproc.calcHist((List<Mat>) hsv_planes.get(0), new MatOfInt(3), new Mat(), h_hist, histSize, histRange, accumulate);
//        //Imgproc.calcHist((List<Mat>) hsv_planes.get(1), new MatOfInt(3), new Mat(), s_hist, histSize, histRange, accumulate);
//        //Imgproc.calcHist((List<Mat>) hsv_planes.get(2), new MatOfInt(3), new Mat(), v_hist, histSize, histRange, accumulate);
//        Log.d("Test", "HSV");
//    }
//
//    private boolean meanDiff(Mat oneCenter) {
//        Scalar meanCenter = Core.mean(oneCenter);
//        double mean = meanCenter.val[0];
//        int size = (int) (oneCenter.total() * oneCenter.channels());
//        float[] channels = new float[size];
//        oneCenter.get(0, 0, channels);
//        for (int i = 0; i < size; i++) {
//            if (abs(mean - channels[i]) > 10) {
//                return false;
//            }
//        }
//        return true;
//    }
//
//    private int findPink(Mat oneCenter) {
//
//        int hue = findHueColors(oneCenter);
//        if (hue >= 100 && hue <= 180) { //(hue > 0)
//            return hue;
//        }
//        return -1;
////        for (int i = 0; i < size; i++) {
////
////        }
//    }
//
//    private int findHueColors(Mat oneCenter) {
//        int size = (int) (oneCenter.total() * oneCenter.channels());
//        float[] channels = new float[size];
//        oneCenter.get(0, 0, channels);
//        int hue = (int) convertRGBtoHSV(channels[2], channels[1], channels[0]);
//        return hue;
//
//    }
//
//    private Mat calculateKmeans(Mat image) {
//        Mat img = new Mat();
//        Imgproc.cvtColor(image, img, Imgproc.COLOR_BGRA2RGB);
//        Bitmap bmp1 = Bitmap.createBitmap(img.cols(), img.rows(), Bitmap.Config.RGB_565);
//        Utils.matToBitmap(img, bmp1);
//        Mat samples32f = new Mat();
//        img.convertTo(samples32f, CvType.CV_32F);
//        //image.convertTo(img, CvType.CV_32F);
//        Mat samples = samples32f.reshape(3, img.rows() * img.cols());
//        //Mat data = img.reshape(-1, 2);
//        int K = 20;
//        Mat bestLabels = new Mat();
//        TermCriteria criteria = new TermCriteria(TermCriteria.EPS + TermCriteria.MAX_ITER, 20, 1.0);
//        int attempts = 10;
//        int flags = Core.KMEANS_RANDOM_CENTERS;
//        Mat centers = new Mat();
//        double compactness = Core.kmeans(samples, K, bestLabels, criteria, attempts, flags, centers);
//        //Mat draw = new Mat((int)img.total(),1, CvType.CV_32FC3);
//        //Mat colors = centers.reshape(3, K);
////        for (int i = 0; i < K; i++) {
////            //Mat mask = new Mat(); // a mask for each cluster label
////            //Core.compare(bestLabels, new Scalar(i), mask, Core.CMP_EQ);
////            Mat col = colors.row(i);
////        }
//        Log.d("CentersMatrix", centers.dump());
////        for (int i = 0; i < 20; i++) {
////            if (!findPink(centers.row(i))) {
////                return centers.row(i); // return centers found as mat
////            }
////        }
//
//        for (int i = 0; i < 20; i++) {
//            if (!meanDiff(centers.row(i))) {
//                int hue = findPink(centers.row(i));
//                if (hue > 0) {
//                    return centers.row(i); // return centers found as mat
//                }
//            }
//        }
//        return null; // no center found..
//    }
//
////    private reduceImg(Mat img){
////        pixelPtr = img.dataAddr();
////        for (int i = 0; i < img.rows(); i++)
////        {
////            for (int j = 0; j < img.cols(); j++)
////            {
////                const int pi = i*img.cols()*3 + j*3;
////                pixelPtr[pi + 0] = reduceVal(pixelPtr[pi + 0]); // B
////                pixelPtr[pi + 1] = reduceVal(pixelPtr[pi + 1]); // G
////                pixelPtr[pi + 2] = reduceVal(pixelPtr[pi + 2]); // R
////            }
////        }
////    }
//
//    private double convertRGBtoHSV(double r, double g, double b) {
//        r = r / 255.0;
//        g = g / 255.0;
//        b = b / 255.0;
//
//        // h, s, v = hue, saturation, value
//        double cmax = Math.max(r, Math.max(g, b)); // maximum of r, g, b
//        double cmin = Math.min(r, Math.min(g, b)); // minimum of r, g, b
//        double diff = cmax - cmin; // diff of cmax and cmin.
//        double h = -1;
//
//        // if cmax and cmax are equal then h = 0
//        if (cmax == cmin)
//            h = 0;
//
//            // if cmax equal r then compute h
//        else if (cmax == r)
//            h = (60 * ((g - b) / diff) + 360) % 360;
//
//            // if cmax equal g then compute h
//        else if (cmax == g)
//            h = (60 * ((b - r) / diff) + 120) % 360;
//
//            // if cmax equal b then compute h
//        else if (cmax == b)
//            h = (60 * ((r - g) / diff) + 240) % 360;
//
//        return h;
//    }
//
//    private Mat nullShadow(Mat ipFrame) {
//        List<Mat> rgb_channels = new ArrayList();
//        //Mat convert = new Mat();
//        //Imgproc.cvtColor(ipFrame, convert, Imgproc.COLOR_BGRA2RGB);
//        Core.split(ipFrame, rgb_channels);
//        //List<Mat> normalized_planes_result = new ArrayList<>();
//        List<Mat> result_planes = new ArrayList<>();
//        for (int i = 0; i < rgb_channels.size(); i++) {
//            Mat dilatedImg = new Mat();
//            Mat bgImg = new Mat();
//            Mat diffImg = new Mat();
//            Mat normImg = new Mat();
//            Mat kernel = Mat.ones(new Size(7, 7), CvType.CV_8U);
//            Imgproc.dilate(rgb_channels.get(i), dilatedImg, kernel);
//            Imgproc.medianBlur(dilatedImg, bgImg, 21);
//            Core.absdiff(rgb_channels.get(i), bgImg, diffImg);
//            byte buff[] = new byte[(int) (diffImg.total() * diffImg.channels())];
//            byte resultBuff[] = new byte[(int) (diffImg.total() * diffImg.channels())];
//            diffImg.get(0, 0, buff);
//            for (int buffIndex = 0; buffIndex < buff.length; buffIndex++) {
//                resultBuff[buffIndex] = (byte) (255 - (int) buff[buffIndex]);
//            }
//            diffImg.put(0, 0, resultBuff);
//            Core.normalize(diffImg, normImg, 0, 255, Core.NORM_MINMAX, CvType.CV_8U);
//            //normalized_planes_result.add(normImg);
//            result_planes.add(diffImg);
//        }
//        Mat resultFinal = new Mat();
//        //Mat resultNormFinal = new Mat();
////        Core.merge(normalized_planes_result, resultFinal);
////        Core.merge(normalized_planes_result, resultNormFinal);
//        Core.merge(result_planes, resultFinal);
//        //Core.merge(normalized_planes_result, resultNormFinal);
//
//        //Bitmap bmp1 = Bitmap.createBitmap(resultNormFinal.cols(), resultNormFinal.rows(), Bitmap.Config.ARGB_8888);
//        //Utils.matToBitmap(resultNormFinal, bmp1);
//
//        return resultFinal;
//
//
//    }
//
//    //Funciton for k means
//    private int findHueKMeans(Mat croppedImage) {
//        Mat outputMat = calculateKmeans(croppedImage);
//        int finalhue = 0;
//        Mat huemat = new Mat();
//        if (outputMat != null) {
//            Log.d("MEANS", outputMat.dump());
//            //Imgproc.cvtColor(outputMat, huemat, Imgproc.COLOR_BGR2HSV);
//            int size = (int) (outputMat.total() * outputMat.channels());
//            float[] colors = new float[size];
//            outputMat.get(0, 0, colors);
//            finalhue = (int) convertRGBtoHSV(colors[2], colors[1], colors[0]);
//            Log.d("test", String.valueOf(finalhue));
//        }
//        return finalhue;
//    }
//
//    private int[] findHue(Mat croppedImage) {
//        int[] hue = new int[]{0, 9};
//        List<Integer> pixels = new ArrayList<>();
//        Mat hsvCroppedImage = new Mat();
//        // bMat clusters = cluster(croppedImage, 2).get(0);
//        //Bitmap bmp1 = Bitmap.createBitmap(croppedImage.cols(), croppedImage.rows(), Bitmap.Config.ARGB_8888);
//        //Utils.matToBitmap(croppedImage, bmp1);
//        //Mat dest = new Mat(croppedImage.rows(), croppedImage.cols(), croppedImage.type());
//        //croppedImage.convertTo(dest, -1, 10, 0);
//
//        Imgproc.cvtColor(croppedImage, hsvCroppedImage, Imgproc.COLOR_RGB2HSV);
//        for (int i = 0; i < 170; i++) {
//            hue[0] = i;
//            hue[1] = i + 9;
//            Scalar lowerBound = new Scalar(hue[0], 35, 40);
//            Scalar upperBound = new Scalar(hue[1], 200, 255);
//            Mat maskedImage = new Mat();
//            Core.inRange(hsvCroppedImage, lowerBound, upperBound, maskedImage);
//            int count = Core.countNonZero(maskedImage);
//            pixels.add(count);
//            Mat finalResult = new Mat();
//            Core.bitwise_and(croppedImage, croppedImage, finalResult, maskedImage);
//            maskedImage.release();
//            finalResult.release();
//        }
//
//        hsvCroppedImage.release();
//
//        int maxPixel = Collections.max(pixels);
//        if (maxPixel > 150) {
//            hue[0] = pixels.indexOf(maxPixel);
//            hue[1] = hue[0] + 9;
//        } else {
//            hue[0] = hue[1] = 0;
//        }
//        return hue;
//    }
//
//    //HashMap<Rect, Integer> perTestTubeHueContainer;
//    //List<Integer> perTestTubeHueList = new ArrayList<>();
//
//    private List<Integer> segmentImage(Mat croppedImage) {
//        //perTestTubeHueContainer = new HashMap<>();
//        List<Integer> perTestTubeHueList = new ArrayList<>();
//        boolean val = false;
//        int midHeight = (int) (croppedImage.height() * 0.55); //0.55
//        Rect bottomHalfImage = new Rect(0, midHeight, croppedImage.width(), (int) (croppedImage.height() * 0.2)); //0.2
//        Mat btmImg = croppedImage.submat(bottomHalfImage);
//
//        Rect halfImage = new Rect(0, (int) (croppedImage.height() * 0.75), croppedImage.width(), (int) (croppedImage.height() * 0.25)); //0.2
//        Mat halfImageMat = croppedImage.submat(halfImage);
//        Imgproc.cvtColor(halfImageMat, halfImageMat, Imgproc.COLOR_BGRA2GRAY);
//
//        Mat eliminateResult = new Mat();
//        Mat templateResized = new Mat();
//        Imgproc.resize(tubeTemplateImg,templateResized,new Size(halfImageMat.width() - 2, halfImageMat.height() - 1) );
//        Imgproc.matchTemplate(halfImageMat, templateResized, eliminateResult, Imgproc.TM_CCOEFF_NORMED);
//        Core.MinMaxLocResult mmr = Core.minMaxLoc(eliminateResult);
//        double minMatchQuality = 0.25; //For android it works at 0.25 in realtime camera
//        if (mmr.maxVal <= minMatchQuality) {
//            processingImg = false;
//            eliminateResult.release(); //release memory here
//            templateResized.release();
//            btmImg.release();
//            halfImageMat.release();
//            //Log.d("test", Double.toString(mmr.maxVal));
//            return null;
//        }
//
//        Core.bitwise_not(croppedImage, croppedImage);
//        //croppedImage = nullShadow(croppedImage);
//        //Normalizing Luminance //We will keep this
//        /*Mat finalFiltered = new Mat();
//        Imgproc.cvtColor(croppedImage, finalFiltered, Imgproc.COLOR_BGR2YUV);
//        List<Mat> channels = new LinkedList<>();
//        Core.split(finalFiltered, channels);
//        Imgproc.equalizeHist(channels.get(0), channels.get(0));
//        Core.merge(channels, finalFiltered);
//        Imgproc.cvtColor(finalFiltered, croppedImage, Imgproc.COLOR_YUV2BGR);*/
//
//        //Mat testImg = nullShadow(btmImg);
//        List<Integer> hueMidList = new ArrayList<>();
//        int widthPerTube = croppedImage.width() / 8;
//        Mat cropImg = null;
//        int allzeros = 0;
//        for (int i = 0; i < 0.9 * croppedImage.width(); i += widthPerTube) {
//            Rect rectOneTestTubeColor = new Rect(i, 0, widthPerTube, btmImg.height());
//            cropImg = btmImg.submat(rectOneTestTubeColor);
//            if (i == 0) { //Check first image for test tube availability
//                val = true;//checkTesttube(cropImg);
//            }
//            if (val) {
//                /*int[] hue = findHue(cropImg);
//                int hueMid = (hue[0] + hue[1]) / 2;*/
//                int hueMid = findHueKMeans(cropImg);
//                if(hueMid == 0) {
//                    allzeros++;
//                }
//                hueMidList.add(hueMid);
//                perTestTubeHueList.add(hueMid);
//                //perTestTubeHueContainer.put(rectOneTestTubeColor, hueMid);
//            } else {
//                val = false;
//                break; //Return
//            }
//        }
//        if (val && allzeros != 8) { //Show cropped image here
//            resultImg = croppedImage;
//            cropImg.release();
//            btmImg.release();
//            eliminateResult.release(); //release memory here
//            templateResized.release();
//            halfImageMat.release();
//            Log.d("Hues", Arrays.toString(hueMidList.toArray()));
//            return perTestTubeHueList;
//        }
//        cropImg.release();
//        btmImg.release();
//        halfImageMat.release();
//        return null;
//    }
//
//    private List<Integer> checkParallel(Mat source, Mat lines) {
//
//        //parallelLines = new ArrayList<Point>();
//        for (int x = 0; x < lines.rows(); x++) {
//            for (int y = 0; y < lines.rows(); y++) {
//                if (x == y) {
//                    continue;
//                }
//                double[] line1 = lines.get(x, 0);
//                double[] line2 = lines.get(y, 0);
//                double slopeA = getSlopeOfLine(line1);
//                double slopeB = getSlopeOfLine(line2);
//                double distSqrtA = getDistanceSqOfLine(line1);
//                double distSqrtB = getDistanceSqOfLine(line2);
//                if ((Math.round(slopeA) == -9999) && (Math.round(slopeB) == -9999)) {
//                    continue;
//                }
//                int absDifBetweenSlopeAAndSlopeB = (int) Math.abs(slopeA - slopeB);
//                int absDiffBettweenSqrtDistAAndDisB = (int) Math.abs(distSqrtA - distSqrtB);
//                if ((0 <= absDifBetweenSlopeAAndSlopeB && absDifBetweenSlopeAAndSlopeB <= 20)
//                        && (absDiffBettweenSqrtDistAAndDisB >= 0 && absDiffBettweenSqrtDistAAndDisB <= 10)
//                        && distBetLines(line1, line2)
//                ) {
//                    double x1 = line1[0], y1 = line1[1];
//                    double x2 = line2[0], y2 = line2[1];
//                    double x3 = line1[2], y3 = line1[3];
//                    double x4 = line2[2], y4 = line2[3];
//
//                    //double xdiff1 = abs(x1 - x2);
//                    //double xdiff2 = abs(x3 - x4);
//                    double length = abs(y1 - y2);
//                    double width = abs(x1 - x3);
//                    double ratio = width / length;
//
//                    //if((xdiff1 < 10) && (xdiff2 < 10)) {
//                    //if((((int)length) > 200) && (400  < ((int)width))){ //((length * 1.5) > width){//
//                    if (ratio > 1.95) {// && ((int)length) > 50){
//                        /*Point p3 = new Point(x1, y1);
//                        Point p4 = new Point(x3, y3);
//                        Point p5 = new Point(x2, y2);
//                        Point p6 = new Point(x4, y4);
//
//                        parallelLines.add(p3);
//                        parallelLines.add(p4);
//                        parallelLines.add(p5);
//                        parallelLines.add(p6);*/
//
//                        Point p1 = new Point(Math.min(x1, x2), Math.min(y1, y2));
//                        Point p2 = new Point(Math.max(x3, x4), Math.max(y3, y4));
//                        Rect regionOfInterest = new Rect(p1, p2);
//                        try {
//                            Mat crop = source.submat(regionOfInterest);
//                            /*  Mat croppedImage = new Mat(source, regionOfInterest);*/
//                            //if (length < 150) {n
//                            /*Mat finalMatch = new Mat();
//                            Mat cropres = new Mat();
//                            Imgproc.cvtColor(crop, finalMatch, Imgproc.COLOR_BGRA2GRAY);
//                            Imgproc.matchTemplate(finalMatch, templateImg, cropres, Imgproc.TM_CCOEFF_NORMED);
//                            Core.MinMaxLocResult mmr = Core.minMaxLoc(cropres);
//                            double minMatchQuality = 0.30;
//                            if (mmr.maxVal <= minMatchQuality) {
//                                crop.release();
//                                finalMatch.release();
//                                cropres.release();
//                                return null;
//                            }*/
//                            /*Mat black = new Mat(crop.rows(), crop.cols(), crop.type());
//                            Mat res = new Mat(crop.rows(), crop.cols(), crop.type());
//                            Core.addWeighted(crop, 0.8, black, 0.2, 0.0, res);*/
//                            List<Integer> hueList = segmentImage(crop);
//                            //crop.release();
//                            //black.release();
//                            //finalMatch.release();
//                            //cropres.release();
//                            return hueList;
//                        } catch (Exception e) {
//                            //error happened
//                            e.printStackTrace();
//                            Log.d("test", "Error");
//                        }
//                    }
//                }
//            }
//        }
//        return null;
//    }
//
//    public List<Integer> run(Bitmap bmpFrame) {
//        Mat sourceFrame = new Mat();
//        Bitmap bmp32 = bmpFrame.copy(Bitmap.Config.ARGB_8888, true);
//        Utils.bitmapToMat(bmp32, sourceFrame);
//        bmp32.recycle();
//        bmp32 = null;
//        if (!processingImg)
//            return run(sourceFrame);
//        else {
//            //Log.d("test", "Not processing image as busy");
//            return null; //Return the same frame or NULL if last processing is going on
//        }
//    }
//
//    public List<Integer> run(Mat frame) {
//        //Setting processing to true here
//        processingImg = true;
//
//        //Mat resizeMAt = frame.clone(); //new Mat();
//        Mat cropMat = frame.clone();//frame.clone();
//        int result_cols = cropMat.cols() - cropMat.cols() + 1;
//        int result_rows = cropMat.rows() - cropMat.rows() + 1;
//        Mat matchtemImg = new Mat(result_rows, result_cols, CvType.CV_8UC1);
//        //Imgproc.resize(frame,resizeMAt,new Size(width,height) );
//        /*Point p1 = new Point(width*0.2,height*0.2);
//        Point p2 = new Point(width*0.8,height*0.8);
//        Rect regionOfInterest = new Rect(p1, p2);
//        cropMat=frame.submat(regionOfInterest);*/
//
//        //Darken image before blur
//        //Mat black = new Mat(frame.rows(), frame.cols(), frame.type());
//        //Core.addWeighted(frame, 0.95, black, 0.05, 0.0, cropMat);
//        /*Bitmap bmp1 = Bitmap.createBitmap(cropMat.cols(), cropMat.rows(), Bitmap.Config.ARGB_8888);
//        Utils.matToBitmap(cropMat, bmp1);
//        MainActivity.result = bmp1;*/
//
//        //match template for tube here if you don't get one then return
//        Imgproc.cvtColor(cropMat, eliminate, Imgproc.COLOR_BGRA2GRAY);
//        if(templateImg == null){
//            loadTemplate();
//        }
//        Imgproc.matchTemplate(eliminate, templateImg, matchtemImg, Imgproc.TM_CCOEFF_NORMED);
//        Core.MinMaxLocResult mmr = Core.minMaxLoc(matchtemImg);
//        double minMatchQuality = 0.55;
//        if (mmr.maxVal <= minMatchQuality) {
//            processingImg = false;
//            matchtemImg.release(); //release memory here
//            //Log.d("test", Double.toString(mmr.maxVal));
//            return null;
//        }
//        Log.d("test", Double.toString(mmr.maxVal));
//
//        // Converting the image to gray scale and
//        // saving it in the dst matrix
//        //Blurring the image
//        Imgproc.GaussianBlur(cropMat, imgBlur, new Size(9, 9), 9); //5,5,2 //777 //330
//        //Converting the image to Gray
//        Imgproc.cvtColor(imgBlur, imgGray, Imgproc.COLOR_BGRA2GRAY);
//        Mat kernel1 = Mat.ones(new Size(3, 3), 5);
//        Imgproc.erode(imgGray, imgGray, kernel1, new Point(1, 1));
//        //Detecting the edges
//        Imgproc.Canny(imgGray, imgCanny, 100, 150, 3); //100,150 //120,250,3
//
//        int iterations = 1;
//        Imgproc.dilate(imgCanny, destination, kernel, new Point(iterations, iterations));
//        Imgproc.HoughLinesP(destination, result, 1, Math.PI / 180, 30, 250, 50); //150,50
//
//        // Writing the image*/
//        Bitmap bmp = null;
//        //Mat resultant = null;
//        List<Integer> hueList = null;
//        if (result != null && !result.empty()) {
//            hueList = checkParallel(cropMat, result);
//            processingImg = false;
//            if (hueList != null) {
//                Log.d("test ", "test");
//                if (resultImg != null) {
//                    bmp = Bitmap.createBitmap(resultImg.cols(), resultImg.rows(), Bitmap.Config.ARGB_8888);
//                    Utils.matToBitmap(resultImg, bmp);
//                    MainActivity.result = bmp;
//                    resultImg.release();
//                }
//            }
//            return hueList;
////            return bmp;
//        }
////        Imgcodecs.imwrite("C:/Projects/images.jfif", destination);
//        //System.out.println("The image is successfully to Grayscale");
//        cropMat.release();
//        processingImg = false;
//        return null;
//    }
//}