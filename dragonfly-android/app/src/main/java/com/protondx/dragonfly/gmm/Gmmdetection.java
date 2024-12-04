package com.protondx.dragonfly.gmm;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.os.Handler;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.math3.linear.Array2DRowRealMatrix;
import org.apache.commons.math3.linear.CholeskyDecomposition;
import org.apache.commons.math3.linear.DiagonalMatrix;
import org.apache.commons.math3.linear.LUDecomposition;
import org.apache.commons.math3.linear.RealMatrix;
import org.opencv.android.Utils;
import org.opencv.calib3d.Calib3d;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDouble;
import org.opencv.core.MatOfFloat;
import org.opencv.core.MatOfInt;
import org.opencv.core.MatOfPoint;
import org.opencv.core.MatOfPoint2f;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.core.TermCriteria;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import us.hebi.matlab.mat.format.Mat5;
import us.hebi.matlab.mat.types.MatFile;
import us.hebi.matlab.mat.types.Matrix;


import static java.lang.Math.abs;

public class Gmmdetection {

    //public static double TUBE_OFFSET;

    public Mat TL_TL_CV, TL_TR_CV, TL_BR_CV, TL_BL_CV;
    public Mat TR_TL_CV, TR_TR_CV, TR_BR_CV, TR_BL_CV;
    public Mat BR_TL_CV, BR_TR_CV, BR_BR_CV, BR_BL_CV;
    public Mat BL_TL_CV, BL_TR_CV, BL_BR_CV, BL_BL_CV;
    public Mat TUBE1_CV;
    public double TUBE_OFFSET_CV;

    Matrix p_cov = null;
    Matrix y_cov = null;
    Matrix c_cov = null;

    double[] p_w = null;
    double[] y_w = null;
    double[] c_w = null;

    public static String fileName = "";
    int cnt = 0;

    double[][] p_means_mat = null;
    double[][] y_means_mat = null;
    double[][] c_means_mat = null;

    double[][][] p_cov_mat = null;
    double[][][] y_cov_mat = null;
    double[][][] c_cov_mat = null;

    public Context ctx = null;

    //public double CARD_STANDARD_RATIO = 120 / 55;

    //public float CARD_WIDTH = 500.0f;
    public float CARD_WIDTH = 250.0f;

    public static boolean DEBUG_ENABLED = false;

    public Gmmdetection(Context context){
        this.ctx = context;
        handler = new Handler();
    }


    Handler handler = null;
    boolean processingImg = false;

    public static long croptiming = 0;
    public static long gmmtiming = 0;
    public static long totaltiming = 0;
    public static long currentFrame = 0;

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

    // GMM function to read matlab trained file
    public void readMatFile(String matfilepath) {
// Read scalar from nested struct
        try {

            String downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/color_models.mat";
            //Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "Dragonfly/color_models.mat";//
            MatFile result = Mat5.readFromFile(matfilepath);
            Matrix p_means = result.getMatrix("p_means"); // 4x3 double matrix
            p_cov = result.getMatrix("p_cov"); // 4x3x3 double matrix
            Matrix p_weights = result.getMatrix("p_weights"); //// 1x4 double matrix

            Matrix y_means = result.getMatrix("y_means"); // 4x3 double matrix
            y_cov = result.getMatrix("y_cov"); // 4x3x3 double matrix
            Matrix y_weights = result.getMatrix("y_weights"); //// 1x4 double matrix

            Matrix c_means = result.getMatrix("c_means"); // 4x3 double matrix
            c_cov = result.getMatrix("c_cov"); // 4x3x3 double matrix
            Matrix c_weights = result.getMatrix("c_weights"); //// 1x4 double matrix

            p_w = new double[6];
            y_w = new double[10];
            c_w = new double[10];

            p_means_mat = new double[6][3];
            y_means_mat = new double[10][3];
            c_means_mat = new double[10][3];


            p_cov_mat = new double[6][3][3];
            y_cov_mat = new double[10][3][3];
            c_cov_mat = new double[10][3][3];

            for (int k = 0; k < 6; k++) {
                p_w[k] = p_weights.getDouble(k);
            }
            for (int k = 0; k < 10; k++) {
                y_w[k] = y_weights.getDouble(k);
                c_w[k] = c_weights.getDouble(k);
            }

            for (int j = 0; j < 6; j++) {
                for (int k = 0; k < 3; k++) {
                    p_means_mat[j][k] = p_means.getDouble(j, k);
                }
            }
            for (int j = 0; j < 10; j++) {
                for (int k = 0; k < 3; k++) {
                    y_means_mat[j][k] = y_means.getDouble(j, k);
                    c_means_mat[j][k] = c_means.getDouble(j, k);
                }
            }

            int[] size = new int[] { 6, 3, 3 };
            int[] size1 = new int[] { 10, 3, 3 };

            for (int j = 0; j < 6; j++) {
                for (int k = 0; k < 3; k++) {
                    for (int l = 0; l < 3; l++) {
                        int[] te = new int[3];
                        te[0] = j;
                        te[1] = k;
                        te[2] = l;
                        p_cov_mat[j][k][l] = p_cov.getDouble(te);
                    }
                }
            }
            for (int j = 0; j < 10; j++) {
                for (int k = 0; k < 3; k++) {
                    for (int l = 0; l < 3; l++) {
                        int[] tr = new int[3];
                        tr[0] = j;
                        tr[1] = k;
                        tr[2] = l;
                        y_cov_mat[j][k][l] = y_cov.getDouble(tr);
                        c_cov_mat[j][k][l] = c_cov.getDouble(tr);
                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public double[][][] calculate_cholesky(String model) {

        int dim = 0;
        if (model == "p") {
            dim = 6;
        } else {
            dim = 10;
        }
        double[][][] result = new double[dim][3][3];
        double[][] arr = new double[3][3];
        for (int j = 0; j < dim; j++) {
            double[][] arr1 = new double[3][3];
            for (int k = 0; k < 3; k++) {
                for (int l = 0; l < 3; l++) {
                    if (model == "p") {
                        arr[k][l] = p_cov_mat[j][k][l];
                    } else if (model == "y") {
                        arr[k][l] = y_cov_mat[j][k][l];
                    } else {
                        arr[k][l] = c_cov_mat[j][k][l];
                    }
                }
            }

            RealMatrix chol = new Array2DRowRealMatrix(arr);
            CholeskyDecomposition decom = new CholeskyDecomposition(chol);
            arr1 = decom.getL().getData();
            RealMatrix c = new Array2DRowRealMatrix(arr1);
            RealMatrix d = c.transpose();
            DiagonalMatrix m = new DiagonalMatrix(new double[]{1,1,1});
            RealMatrix n = new Array2DRowRealMatrix(d.getData());
            RealMatrix pInverse = new LUDecomposition(n).getSolver().solve(m);

            for (int k = 0; k < 3; k++) {
                for (int l = 0; l < 3; l++) {
                    int[] te1 = new int[3];
                    te1[0] = j;
                    te1[1] = k;
                    te1[2] = l;
                    result[j][k][l] = pInverse.getData()[k][l];
                }
            }

        }
        //System.out.println(Arrays.deepToString(result));
        return result;
    }

    /*public void detectGMM() {
        File file = new File("/home/anand/eclipse-workspace/HueDetectionTest/src/images/test.jpg");
        Mat img1 = Imgcodecs.imread(file.getAbsolutePath());
        Imgproc.cvtColor(img1, img1, Imgproc.COLOR_BGR2RGB);
        Mat card = prepImgTestCV(img1);
        readMatFile("etst");
//File file = new File("/home/anand/eclipse-workspace/HueDetectionTest/src/images/test1.png");
//Mat img1 = Imgcodecs.imread(file.getAbsolutePath());
//Imgproc.cvtColor(img1, img1, Imgproc.COLOR_BGRA2RGB);
//Mat img_list1 = img1.reshape(1, img1.rows() * img1.cols());
//Mat test = score_samples("y", img_list1);
//System.out.println(test.dump());
        List maskList = maskImage(card);
        List colors = checkTubes(((Mat) maskList.get(0)), ((Mat) maskList.get(1)), ((Mat) maskList.get(2)));

        System.out.println(colors);
    }*/

    public static Bitmap getBitmapFromAsset(Context context, String filePath) {
        AssetManager assetManager = context.getAssets();

        InputStream istr;
        Bitmap bitmap = null;
        try {
            istr = assetManager.open(filePath);
            bitmap = BitmapFactory.decodeStream(istr);
        } catch (IOException e) {
            // handle exception
        }

        return bitmap;
    }

    public boolean checkBlurredImage(Mat image){
        Mat gray = new Mat();
        Mat laplace = new Mat();
        double blurThreshold = 7;//20;
        Imgproc.cvtColor(image, gray, Imgproc.COLOR_RGBA2GRAY);
        Imgproc.Laplacian(gray, laplace, CvType.CV_64F);
        MatOfDouble mean = new MatOfDouble();
        MatOfDouble stddev = new MatOfDouble();
        Core.meanStdDev(laplace, mean, stddev, new Mat());
        double result = Math.pow(stddev.get(0,0)[0],2);
        Log.d("blur index: ", Double.toString(result));
        //Cleaning up the matrix
        gray.release();
        laplace.release();
        mean.release();
        stddev.release();
        if(result <= blurThreshold){
            return false;
        }
        return true;
    }

    private Mat nullShadow(Mat ipFrame) {
        List<Mat> rgb_channels = new ArrayList();
        //Mat convert = new Mat();
        //Imgproc.cvtColor(ipFrame, convert, Imgproc.COLOR_BGRA2RGB);
        Core.split(ipFrame, rgb_channels);
        //List<Mat> normalized_planes_result = new ArrayList<>();
        List<Mat> result_planes = new ArrayList<>();
        for (int i = 0; i < rgb_channels.size(); i++) {
            Mat dilatedImg = new Mat();
            Mat bgImg = new Mat();
            Mat diffImg = new Mat();
            Mat normImg = new Mat();
            Mat kernel = Mat.ones(new Size(7, 7), CvType.CV_8U);
            Imgproc.dilate(rgb_channels.get(i), dilatedImg, kernel);
            Imgproc.medianBlur(dilatedImg, bgImg, 21);
            Core.absdiff(rgb_channels.get(i), bgImg, diffImg);
            byte buff[] = new byte[(int) (diffImg.total() * diffImg.channels())];
            byte resultBuff[] = new byte[(int) (diffImg.total() * diffImg.channels())];
            diffImg.get(0, 0, buff);
            for (int buffIndex = 0; buffIndex < buff.length; buffIndex++) {
                resultBuff[buffIndex] = (byte) (255 - (int) buff[buffIndex]);
            }
            diffImg.put(0, 0, resultBuff);
            Core.normalize(diffImg, normImg, 0, 255, Core.NORM_MINMAX, CvType.CV_8U);
            //normalized_planes_result.add(normImg);
            result_planes.add(diffImg);
        }
        Mat resultFinal = new Mat();
        //Mat resultNormFinal = new Mat();
//        Core.merge(normalized_planes_result, resultFinal);
//        Core.merge(normalized_planes_result, resultNormFinal);
        Core.merge(result_planes, resultFinal);
        //Core.merge(normalized_planes_result, resultNormFinal);

        //Bitmap bmp1 = Bitmap.createBitmap(resultNormFinal.cols(), resultNormFinal.rows(), Bitmap.Config.ARGB_8888);
        //Utils.matToBitmap(resultNormFinal, bmp1);

        return resultFinal;
    }

    private Mat convertScale(Mat img, double alpha, double beta) {
        Mat image = img.clone();
        Core.multiply(image, new Scalar(alpha), image);
        Core.add(image, new Scalar(beta), image);
        // image.setTo(0);
        Imgproc.threshold(image, image,0, 255, Imgproc.THRESH_TOZERO_INV);
        Bitmap bmp = Bitmap.createBitmap(image.cols(), image.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(image, bmp); //This bmp needs to be saved //Sachin
        //new_img[new_img < 0] = 0
        //new_img[new_img > 255] = 255
        return image;//new_img.astype(np.uint8)
    }

    private void autoBrightnessAndContrast(Mat img) {
        Mat image = img.clone();
        Imgproc.cvtColor(image, image, Imgproc.COLOR_BGR2GRAY);
        File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
        Imgcodecs.imwrite(folder.getAbsolutePath() + "/test.jpg", image);

        List<Mat> hsv_planes = new ArrayList<Mat>();
        Core.split(image, hsv_planes);
        //hsv_planes.add(image);
        double clip_hist_percent = 25.0;
        MatOfInt histSize = new MatOfInt(256);
        float[] range = {0, 256};
        final MatOfFloat histRange = new MatOfFloat(range);
        boolean accumulate = false;
        Mat h_hist = new Mat();
        Imgproc.calcHist(hsv_planes, new MatOfInt(0), new Mat(), h_hist, histSize, histRange);
        double accumulator [] = new double[256];
        accumulator[0] = h_hist.get(0,0)[0];
        //h_hist.get(0,0, accumulator);
        for(int k=1;k < (accumulator.length - 1);k++){
            accumulator[k] = h_hist.get(k-1,0)[0] + h_hist.get(k,0)[0];//accumulator[k-1] + accumulator[k];
        }
        double maximum = accumulator[0];
        clip_hist_percent = clip_hist_percent * (maximum/100.0);
        clip_hist_percent = clip_hist_percent / 2.0;
        int minimum_gray = 0;
        while(accumulator[minimum_gray] < clip_hist_percent) {
            minimum_gray = minimum_gray + 1;
            if(minimum_gray == 256){
                break;
            }
        }
        int maximum_gray = 255;
        while(accumulator[maximum_gray] >= (maximum - clip_hist_percent)) {
            maximum_gray = maximum_gray - 1;
            if(maximum_gray == -1){
                break;
            }
        }
        double alpha = (double) 255 / (maximum_gray - minimum_gray);
        double beta = (double) -minimum_gray * alpha;

        convertScale(image, alpha, beta);
        //Imgproc.calcHist((List<Mat>) hsv_planes.get(1), new MatOfInt(3), new Mat(), s_hist, histSize, histRange, accumulate);
        //Imgproc.calcHist((List<Mat>) hsv_planes.get(2), new MatOfInt(3), new Mat(), v_hist, histSize, histRange, accumulate);
        Log.d("Test", "HSV");
    }

    /* following function extracts the crop of the tubes from the image and sends it to react
     */
    public Bitmap findColorsGMMCrop(Bitmap input) {
        if(input == null){
            return null;
        }
        Mat output = new Mat();
        Utils.bitmapToMat(input, output);

        if(!checkBlurredImage(output)){ //Blurred image
            return null;
        }

        totaltiming = 0;
        croptiming = 0;
        gmmtiming = 0;
        long start_time = System.currentTimeMillis();
        currentFrame = start_time;

        if(DEBUG_ENABLED) {
            File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + currentFrame + ".jpg", output);
        }

        if (!processingImg) {
            processingImg = true;
            Imgproc.cvtColor(output, output, Imgproc.COLOR_RGBA2RGB);
            //Mat card = prepImgTestCV(resize);
            CropCard crop = new CropCard(output);
            long st = System.currentTimeMillis();

            Mat card = null;
            try {
                card = crop.findCardHomographyCV_RD(output);//crop.prepImgTestCV(true);
            } catch (ArrayIndexOutOfBoundsException e) {
                card = null;
                //e.printStackTrace();
            }
            if (card == null) {
                processingImg = false;
                return null;
            }
            croptiming = System.currentTimeMillis() - st;
            Bitmap bmp = Bitmap.createBitmap(card.cols(), card.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(card, bmp); //This bmp needs to be saved //Sachin
            if(DEBUG_ENABLED) {
                File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
                Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + "_crop.jpg", card);
            }
            card.release(); //release image matrix here
            processingImg = false;
            return bmp;
        } else {
            //Log.d("test", "Not processing image as busy");
            output.release();
            return null; //Return the same frame or NULL if last processing is going on
        }
    }


    /* following function extracts the colors from the image and sends it back to the main code,
       for the time being it is just returning the crop
     */
    public List<Integer> findColorsGMM(Bitmap input) {
        if(input == null){
            return null;
        }
        Mat output = new Mat();
        Utils.bitmapToMat(input, output);

        if(!checkBlurredImage(output)){ //Blurred image
            return null;
        }

        totaltiming = 0;
        croptiming = 0;
        gmmtiming = 0;
        long start_time = System.currentTimeMillis();
        currentFrame = start_time;

        /*Mat resize = new Mat();
        int height = 1429; //1444;
        int width = 1900; //1920;
        if(DEBUG_ENABLED) {
            height = 1444; //1444;
            width = 1920; //1920;
        }
        Imgproc.resize(output, resize, new Size(width, height), Imgproc.INTER_CUBIC);
        Bitmap bmp1 = Bitmap.createBitmap(resize.cols(), resize.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(resize, bmp1); //This bmp needs to be saved //Sachin
// */
        if(DEBUG_ENABLED) {
//            Bitmap bmp1 = Bitmap.createBitmap(output.cols(), output.rows(), Bitmap.Config.ARGB_8888);
//            Utils.matToBitmap(output, bmp1); //This bmp needs to be saved //Sachin
            File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + currentFrame + ".jpg", output);
        }

        if (!processingImg) {
            processingImg = true;
            Imgproc.cvtColor(output, output, Imgproc.COLOR_RGBA2RGB);
            //Mat card = prepImgTestCV(resize);
            CropCard crop = new CropCard(output);
            long st = System.currentTimeMillis();

            Mat card = null;
            try {
                card = crop.findCardHomographyCV_RD(output);//crop.prepImgTestCV(true);
            } catch (ArrayIndexOutOfBoundsException e) {
                e.printStackTrace();
            }
            if (card == null) {
                processingImg = false;
                return null;
            }
            croptiming = System.currentTimeMillis() - st;
            if(DEBUG_ENABLED) {
                Bitmap bmp = Bitmap.createBitmap(card.cols(), card.rows(), Bitmap.Config.ARGB_8888);
                Utils.matToBitmap(card, bmp); //This bmp needs to be saved //Sachin
                File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
                Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + "_crop.jpg", card);
            }
            //card = nullShadow(card);
            //Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + ".jpg", card);

            /*st = System.currentTimeMillis();
            List maskList = maskImage(card);
            if (maskList == null) {
                processingImg = false;
                return null;
            }
            gmmtiming = System.currentTimeMillis() - st;*/

            Bitmap bmp = Bitmap.createBitmap(card.cols(), card.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(card, bmp); //This bmp needs to be saved //Sachin
            //autoBrightnessAndContrast(card);
            List colors = checkTubes_GMM(card);//checkTubes(((Mat) maskList.get(0)), ((Mat) maskList.get(1)), ((Mat) maskList.get(2))); ////
            if(DEBUG_ENABLED) {
                Mat circle = drawTubesWithFill(card, colors);//drawTubes(card);//drawTubes(((Mat) maskList.get(2)));
                File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
                bmp = Bitmap.createBitmap(circle.cols(), circle.rows(), Bitmap.Config.ARGB_8888);
                Utils.matToBitmap(circle, bmp); //This bmp needs to be saved //Sachin
                Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + "_mask.jpg", circle);
            }
            List resultcolors = new ArrayList<Integer>();
            int invalidImage = 0;
            if(colors != null) {
                for (int i = 0; i < colors.size(); i++) {
                    if (((Character)colors.get(i)) == 'Y') {
                        resultcolors.add(0);
                    } else if (((Character)colors.get(i)) == 'P') {
                        resultcolors.add(1);
                    } else if (((Character)colors.get(i)) == 'U') {
                        resultcolors.add(0);
                        invalidImage++; //Need to check this
                    }
                }
            }else{
                return null;
            }
            if(invalidImage > 3){ //Invalid detection
                return null;
            }
            processingImg = false;
            totaltiming = System.currentTimeMillis() - start_time;
            return resultcolors;
        } else {
            //Log.d("test", "Not processing image as busy");
            return null; //Return the same frame or NULL if last processing is going on
        }
    }

    public void detectGMM(){
        readMatFile("etst");
        String directory = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath();
        File dir = new File(directory + "/Dragonfly/Input");
        File[] directoryListing = dir.listFiles();
        if (directoryListing != null) {
            for (File child : directoryListing) {
                // Do something with child
                Bitmap bitmap = BitmapFactory.decodeFile(child.getAbsolutePath());
                fileName = child.getName();
                cnt++;
                Mat output = new Mat();
                Utils.bitmapToMat(bitmap, output);
                long start_time = System.currentTimeMillis();
                Imgproc.cvtColor(output, output, Imgproc.COLOR_RGBA2RGB);
                Mat card = prepImgTestCV(output);
                List maskList = maskImage(card);
                List colors = checkTubes(((Mat) maskList.get(0)), ((Mat) maskList.get(1)), ((Mat) maskList.get(2)));
                Mat circle = drawTubes(((Mat) maskList.get(2)));
                Bitmap bmp = Bitmap.createBitmap(circle.cols(), circle.rows(), Bitmap.Config.ARGB_8888);
                Utils.matToBitmap(circle, bmp); //This bmp needs to be saved //Sachin
                String [] t = fileName.split(" ");
                String result = getStringRepresentation((ArrayList)colors);//String.join("", colors);
                if(t[0].compareToIgnoreCase(result) == 0){
                    Log.d("Success:", fileName);
                    long end_time = System.currentTimeMillis();
                    Log.d("Total time - " + fileName + " :", Long.toString(end_time - start_time));
                  //  sampleImage.writeCSV(fileName,"PASS", Double.toString((end_time - start_time)/1000+(end_time-start_time%1000)));
                }else{
                    Log.d("Fail:", fileName);
                    long end_time = System.currentTimeMillis();
               //     sampleImage.writeCSV(fileName,"FAIL", Double.toString((end_time - start_time)/1000));
                    Log.d("Total time - " + fileName + " :", Long.toString(end_time - start_time));
                }
            }
        } else {
        }
        /*long start_time = System.currentTimeMillis();
        Bitmap bmp = getBitmapFromAsset(ctx, "test.jpg");
        Mat output = new Mat();
        Utils.bitmapToMat(bmp, output);
        Imgproc.cvtColor(output, output, Imgproc.COLOR_RGBA2RGB);
        Mat card = prepImgTestCV(output);
        readMatFile("etst");
        List maskList = maskImage(card);
        List colors = checkTubes(((Mat) maskList.get(0)), ((Mat) maskList.get(1)), ((Mat) maskList.get(2)));
        long end_time = System.currentTimeMillis();
        Log.d("Test", "Test Time: "+ (end_time - start_time));*/
    }

    public void detectGMMNew(String filename, Bitmap bmp ){
        readMatFile("etst");
        fileName = filename;
        Mat output = new Mat();
        Utils.bitmapToMat(bmp, output);
        long start_time = System.currentTimeMillis();
        Imgproc.cvtColor(output, output, Imgproc.COLOR_RGBA2RGB);
        CropCard cc = new CropCard(output);
        Mat card = null;
        try {
            card = cc.findCardHomographyCV_RD(output);
        } catch (ArrayIndexOutOfBoundsException e) {
            e.printStackTrace();
            //return;
        }
//        if(card == null){
//            return;
//        }
        File folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/crop");
        long e_time = System.currentTimeMillis();
        if(DEBUG_ENABLED) {
            Log.d("Crop & april time - " + fileName + " :", Long.toString(e_time - start_time));
            Bitmap bmp1 = Bitmap.createBitmap(card.cols(), card.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(card, bmp1); //This bmp needs to be saved //Sachin
            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + filename + ".jpg", card);
        }
        //autoBrightnessAndContrast(card);
        Bitmap bmp2 = Bitmap.createBitmap(card.cols(), card.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(card, bmp2); //This bmp needs to be saved //Sachin
        //List maskList = maskImage(card);
        //card = calculateKmeansMat(card);
        List colors = checkTubes_RD(card);//checkTubes(((Mat) maskList.get(0)), ((Mat) maskList.get(1)), ((Mat) maskList.get(2))); //
        //List colors = checkTubes_Kmeans(card);
        Mat circle = drawTubesWithFill(card, colors);
        if(DEBUG_ENABLED) {
            Bitmap bmp1 = Bitmap.createBitmap(circle.cols(), circle.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(circle, bmp1);
            folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/output/mask");
            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + filename + ".jpg", card);
            Log.d("Total time - " + fileName + " :", "test");
        }
        String [] t = fileName.split(" ");
        String result = getStringRepresentation((ArrayList)colors);//String.join("", colors);
        if(t[0].compareToIgnoreCase(result) == 0){
            Log.d("Success:", fileName);
            long end_time = System.currentTimeMillis();
            Log.d("Total time - " + fileName + " :", Long.toString(end_time - start_time));
         //   sampleImage.writeCSV(fileName,"PASS", Double.toString((end_time - start_time)/1000+(end_time-start_time%1000)));
        }else{
            Log.d("Fail:", fileName);
            long end_time = System.currentTimeMillis();
         //   sampleImage.writeCSV(fileName,"FAIL", Double.toString((end_time - start_time)/1000));
            Log.d("Total time - " + fileName + " :", Long.toString(end_time - start_time));
        }
    }

    String getStringRepresentation(ArrayList<Character> list)
    {
        StringBuilder builder = new StringBuilder(list.size());
        for(Character ch: list)
        {
            builder.append(ch);
        }
        return builder.toString();
    }

    public double maxValue(final double[] arr) {
        if (arr.length < 0)
            return 0;

        double max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }

        return max;
    }

    private double[] logsumexp(double[][] data) {
        final double[] lse = new double[data.length];
        for (int i = 0; i < data.length; i++) {
            final double max = maxValue(data[i]);// ArrayUtils.maxValue(data[i]);

            for (int j = 0; j < data[0].length; j++) {
                lse[i] += Math.exp(data[i][j] - max);
            }
            lse[i] = max + Math.log(lse[i]);
        }
        return lse;
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

    public Mat get_normalization_transform_CV(Mat pts) {
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
//Mat transform = new Mat();
//        Core.multiply(scale, translation, transform);
        Mat transform = scale.matMul(translation); // ERROR HERE NEED TO CHECK
        return transform;
    }

    public void setImage(Bitmap bmp, String folder1) {
        Calendar calendar = Calendar.getInstance();
        long time= calendar.getTimeInMillis();

        /*   imageView.setImageBitmap(bmp);*/
        try {
            final File folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/"+folder1);
//
            File file = new File(folder,fileName);
            FileOutputStream out = new FileOutputStream(file);
            bmp.compress(Bitmap.CompressFormat.JPEG, 100, out);
            out.flush();
            out.close();
//            String[] rowArr=new String[2];
//            rowArr[0]=name+","+num;
          /*  final File file1=new File(Environment.getExternalStorageDirectory(),"/Download/Proton/output/april_tag");
            writeToFile(file1,rowArr,true);*/
//            final File newFile = new File(Environment.getExternalStorageDirectory(),"/Download/Proton/output/output_data.csv");
//
//            writeToFile(newFile,rowArr, true);
        } catch (Exception e) {
            e.printStackTrace();
        }

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
        Log.d("Apriltag", Long.toString(System.currentTimeMillis() - start_time));
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

        if(DEBUG_ENABLED) {
            Mat gray1 = gray.clone();
            for (int i = 0; i < tag_positions.size(); i++) {
                Point pt1 = new Point(tag_positions.get(i).getCorner()[0], tag_positions.get(i).getCorner()[1]);
                Point pt2 = new Point(tag_positions.get(i).getCorner()[4], tag_positions.get(i).getCorner()[5]);
                Imgproc.rectangle(gray1, pt1, pt2, new Scalar(255, 255, 255), 1);
            }
            File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + ".jpg", gray1);
        }
        /*Bitmap bmp = Bitmap.createBitmap(gray.cols(), gray.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(gray, bmp); //This bmp needs to be saved //Sachin
        handler.post(new Runnable() {
            @Override
            public void run() {
                setImage(bmp, "april_tag");
            }
        });*/

        /* ApriltagDetection apd = new ApriltagDetection();
         * double[] d = new double[] {863.6513757951068, 1057.5242178634062 };
         * apd.setC(d); apd.setDecision_margin(64); apd.setHamming(0); apd.setId(0);
         * double[] d1 = new double[] {778.3250732421252, 1153.2530517578828,
         * 963.261962890561, 1148.633056640566, 949.9813842774076, 960.6693115233662,
         * 762.9404296875651, 965.4089355469341 }; apd.setP(d1);
         *
         * ApriltagDetection apd1 = new ApriltagDetection(); double[] d2 = new double[]
         * { 3287.841474945124, 996.7217356039579 }; apd1.setC(d2);
         * apd1.setDecision_margin(65); apd1.setHamming(0); apd1.setId(1); double[] d3 =
         * new double[] { 3193.3728027343373, 1093.0997314453512, 3378.9440917968386,
         * 1089.064941406213, 3383.3830566406627, 899.2491455077737, 3196.3203125000373,
         * 903.9542846680065 }; apd1.setP(d3);
         *
         * ApriltagDetection apd2 = new ApriltagDetection(); double[] d4 = new double[]
         * { 915.3644863154728, 1964.947405262309 }; apd2.setC(d4);
         * apd2.setDecision_margin(45); apd2.setHamming(0); apd2.setId(3); double[] d5 =
         * new double[] { 829.5939941406841, 2057.129150390562, 1009.6231689453774,
         * 2051.60986328131, 1001.669860839784, 1872.1907958985014, 820.7211303710277,
         * 1877.9312744140018 }; apd2.setP(d5);
         *
         * ApriltagDetection apd3 = new ApriltagDetection(); double[] d6 = new double[]
         * { 3263.3260320401473, 1899.0149119055982 }; apd3.setC(d6);
         * apd3.setDecision_margin(63); apd3.setHamming(0); apd3.setId(2); double[] d7 =
         * new double[] { 3171.270751953128, 1987.4508056640595, 3347.75610351563,
         * 1982.0991210937552, 3355.5954589843727, 1810.3732910156273,
         * 3177.9204101562455, 1814.9707031249957 }; apd3.setP(d7); tag_positions = new
         * ArrayList(); tag_positions.add(apd); tag_positions.add(apd1);
         * tag_positions.add(apd2); tag_positions.add(apd3);
         */

        /*double[] d = new double[] { 770.3955097693212, 1060.4932993878508 };
        apd.setC(d);
        apd.setDecision_margin(69);
        apd.setHamming(0);
        apd.setId(0);
        double[] d1 = new double[] { 672.2154541016097, 1167.9288330077604, 879.3622436523908, 1163.9876708984825,
                869.9284057616694, 951.5773925781787, 659.9404296874503, 955.5853271483905 };
        apd.setP(d1);

        ApriltagDetection apd1 = new ApriltagDetection();
        double[] d2 = new double[] { 3553.946152868271, 1005.9413267207697 };
        apd1.setC(d2);
        apd1.setDecision_margin(80);
        apd1.setHamming(0);
        apd1.setId(1);
        double[] d3 = new double[] { 3447.756835937337, 1115.4395751954812, 3662.2409667967045, 1111.882446288895,
                3660.8757324220433, 895.6797485349838, 3444.8674316407987, 899.2333374025127 };
        apd1.setP(d3);

        ApriltagDetection apd2 = new ApriltagDetection();
        double[] d4 = new double[] { 787.9355205094565, 2104.900418814733 };
        apd2.setC(d4);
        apd2.setDecision_margin(45);
        apd2.setHamming(0);
        apd2.setId(3);
        double[] d5 = new double[] { 683.357971191386, 2212.081054687521, 891.457275390607, 2210.084716796857,
                892.2385864258019, 1998.0010986327911, 684.7794189453303, 2000.0876464843932 };
        apd2.setP(d5);

        ApriltagDetection apd3 = new ApriltagDetection();
        double[] d6 = new double[] { 3552.475572219375, 2067.436798746178 };
        apd3.setC(d6);
        apd3.setDecision_margin(79);
        apd3.setHamming(0);
        apd3.setId(2);
        double[] d7 = new double[] { 3445.803466796867, 2172.8911132812577, 3654.5236816406164, 2168.6271972656164,
                3659.005615234385, 1962.1229248046775, 3449.973388671883, 1965.796142578133 };
        apd3.setP(d7);
        tag_positions = new ArrayList();
        tag_positions.add(apd);
        tag_positions.add(apd1);
        tag_positions.add(apd2);
        tag_positions.add(apd3);*/


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
// card_pts = box1;
                Mat corner = new Mat(4, 2, CvType.CV_32FC1);
                corner.put(0, 0, tag_positions.get(i).getCorner());
// corner = corner.reshape(4,2);
                try {
// img_pts = Nd4j.vstack(img_pts, corner);
                    if (img_pts == null) {
                        img_pts = corner;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
// img_pts = corner;
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
//
            }
        }

        Mat ones = Mat.ones(card_pts.rows(), 1, CvType.CV_32FC1);
        Mat card_pts_homogeneous = new Mat(card_pts.rows(), ones.cols() + card_pts.cols(), CvType.CV_32FC1);
//        int cardrows = card_pts.cols();
//        for(int j=0;j<card_pts_homogeneous.rows();j++){ //hstack
//            for(int k=0;k<card_pts_homogeneous.cols();k++) {
//                if(k<cardrows){
//                    card_pts_homogeneous.put(j, k, card_pts.get(j, k));
//                }else{
//                    card_pts_homogeneous.put(j, k, ones.get(j, 0));
//                }
//            }
//        }
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
        Mat T_card = get_normalization_transform_CV(card_pts);
        Mat T_img = get_normalization_transform_CV(img_pts);

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
// cpt = T_card.matMul(card_pts_homogeneous);
// Core.multiply(T_card, card_pts_homogeneous, cpt);
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

//MatOfPoint2f c_pts = new MatOfPoint2f(card_pts_t);
// card_pts_t.convertTo(c_pts, CvType.CV_32FC1);

//MatOfPoint2f i_pts = new MatOfPoint2f(img_pts_t);
// img_pts_t.convertTo(i_pts, CvType.CV_32FC1);

        Mat H_t = Calib3d.findHomography(c_pts, i_pts, Calib3d.RANSAC);
        // H_t.convertTo(H_t, CvType.CV_32FC2);

        Mat T_img_inv = T_img.inv();
        T_img_inv.convertTo(T_img_inv, CvType.CV_64FC1);

//Mat multiplied = new Mat(3, 3, CvType.CV_32FC1);
        H_t.convertTo(H_t, CvType.CV_64FC1);
        T_card.convertTo(T_card, CvType.CV_64FC1);
        Mat multiplied = H_t.matMul(T_card);

        Mat finalval = T_img_inv.matMul(multiplied);

        return finalval;
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

    public Mat crop_to_card_CV(Mat img, Mat H) {

        Mat a = new Mat(1, 3, CvType.CV_32FC1);
        a.put(0, 0, new double[] { 0.0, 0.0, 1.0 }); // 3
//Mat buffer = Mat.ones(2, 3, CvType.CV_32FC1);

        /*
         * Mat a1 = new Mat(3, 3, CvType.CV_32FC1); List listBuf = new ArrayList();
         * listBuf.add(a);listBuf.add(buffer); Core.vconcat(listBuf, a1);
         */

        Mat b = new Mat(1, 3, CvType.CV_32FC1);
        b.put(0, 0, new double[] { 120.0, 0.0, 1.0 }); // 120
        /*
         * Mat b1 = new Mat(1, 3, CvType.CV_32FC1); listBuf.clear();
         * listBuf.add(b);listBuf.add(buffer); Core.vconcat(listBuf, b1);
         */

        Mat c = new Mat(1, 3, CvType.CV_32FC1);
        c.put(0, 0, new double[] { 120.0, 55.0, 1.0 }); // 122/68
        /*
         * Mat c1 = new Mat(1, 3, CvType.CV_32FC1); listBuf.clear();
         * listBuf.add(c);listBuf.add(buffer); Core.vconcat(listBuf, c1);
         */

        Mat d = new Mat(1, 3, CvType.CV_32FC1);
        d.put(0, 0, new double[] { 0.0, 55.0, 1.0 }); // 68
        /*
         * Mat d1 = new Mat(1, 3, CvType.CV_32FC1); listBuf.clear();
         * listBuf.add(d);listBuf.add(buffer); Core.vconcat(listBuf, d1);
         */

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

//double values[][] = { { 0, 0 }, { widthMax - 1, 0 }, { widthMax - 1, heightMax - 1 }, { 0, heightMax - 1 } };
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

// Mat final_t = finalres.reshape(2);
// Mat dst_t = dst.reshape(2);

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
//Mat test = new Mat(img.rows(), img.cols(), CvType.CV_32FC3);
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
                Imgproc.resize(img, resized, new Size(width, height), Imgproc.INTER_CUBIC);
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
                Imgproc.resize(img, resized, new Size(width, height), Imgproc.INTER_CUBIC);
            }
        }
        if (resized != null) {
            return resized;
        }
        return img;
    }

    public Mat prepImgTestCV(Mat img) {
        Mat copyImg = img.clone();
        Mat copyImg1 = img.clone();
        Mat H = findCardHomographyCV(copyImg); // Done
        if(H == null){
            return null;
        }
        H.convertTo(H, CvType.CV_32FC1);
        Mat image = crop_to_card_CV(copyImg1, H); // Done
        if(image == null){ //Nick randell's suggestion
            return null;
        }
        if(DEBUG_ENABLED) {
            File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + ".jpg", image);
        }
        //File folder = new File(Environment.getExternalStorageDirectory(),"/Download/Dragonfly/crop");
        //Imgcodecs.imwrite(folder.getAbsolutePath() + "/output.jpg", image);
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
        //Imgcodecs.imwrite("/home/anand/eclipse-workspace/HueDetectionTest/src/images/output1.jpg", subs);
        Mat image_new = scale_image(subs);
        return image_new;
    }

//private static final double EPSILON = 1e-10;

    // is symmetric
    public static boolean isSymmetric(Mat A) {
        int N = A.rows();
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < i; j++) {
                if (A.get(i, j) != A.get(j, i))
                    return false;
            }
        }
        return true;
    }

    // is square
    public static boolean isSquare(Mat A) {
        if (A.rows() != A.cols())
            return false;

        return true;
    }

	/*public double[][] find_cholesky_again(double A[][]) {

		Mat A1 = pModel_cov;

		if (!isSquare(A1)) {
			throw new RuntimeException("Matrix is not square");
		}
		if (!isSymmetric(A1)) {
			throw new RuntimeException("Matrix is not symmetric");
		}

		int N = 3;
		double[][] L = new double[N][N];

		for (int i = 0; i < N; i++) {
			for (int j = 0; j <= i; j++) {

				double sum = 0.0;
				for (int k = 0; k < j; k++) {
					sum += L[i][k] * L[j][k];
				}
				if (i == j)
					L[i][i] = Math.sqrt(A[i][j] - sum);
				else
					L[i][j] = 1.0 / L[j][j] * (A[i][j] - sum);
			}
			if (L[i][i] <= 0) {
				throw new RuntimeException("Matrix not positive definite");
			}
		}
		return L;
	}

// return Cholesky factor L of psd matrix A = L L^T
	public Mat find_cholesky(Mat A) {

		Mat A1 = pModel_cov;
		if (!isSquare(A1)) {
			throw new RuntimeException("Matrix is not square");
		}
		if (!isSymmetric(A1)) {
			throw new RuntimeException("Matrix is not symmetric");
		}

		int N = 6;
		Mat L = new Mat(N, N, CvType.CV_32FC1);

		for (int i = 0; i < N; i++) {
			for (int j = 0; j <= i; j++) {

				double sum = 0.0;
				for (int k = 0; k < j; k++) {
					sum += L.get(i, k)[0] * L.get(j, k)[0];
				}
				if (i == j)
					L.get(i, i)[0] = Math.sqrt(A.get(i, i)[0] - sum);
				else
					L.get(i, j)[0] = 1.0 / L.get(j, j)[0] * (A.get(i, j)[0] - sum);
			}
			if (L.get(i, i)[0] <= 0) {
				throw new RuntimeException("Matrix not positive definite");
			}
		}
		return L;
	}*/

    public double[][] estimateWeightedLogProb(double[][] means, double[][][] cholesky, double[] weights, Mat X,
                                              String model) {

        double[][] mat1 = estimateLogProb(means, cholesky, weights, X);
        double[] mat2 = estimateLogWeights(weights, model);

        int dim = 0;
        if (model == "p") {
            dim = 6;
        } else {
            dim = 10;
        }

        double[][] result = new double[X.rows()][dim];
        double[][] mat3 = new double[X.rows()][dim];

        for (int k = 0; k < X.rows(); k++) {
            for (int l = 0; l < dim; l++) {
                result[k][l] = mat1[k][l] + mat2[l];
            }
        }

        return result;
    }

	/*public int countNZ(double[][] m) {
		int cnt = 0;
		return cnt;
	}*/

    public Mat score_samples(String model, Mat X) {
        if (model == "p") {
            double[][][] cholesky = calculate_cholesky(model);

            double[][] test = estimateWeightedLogProb(p_means_mat, cholesky, p_w, X, model);
            double[] value = logsumexp(test);
            Mat arr = new Mat(1, value.length, CvType.CV_32FC1);
            arr.put(0, 0, value);
            return arr;
        } else if (model == "y") {
            double[][][] cholesky = calculate_cholesky(model);
            double[][] test = estimateWeightedLogProb(y_means_mat, cholesky, y_w, X, model);
            double[] value = logsumexp(test);
            Mat arr = new Mat(1, value.length, CvType.CV_32FC1);
            arr.put(0, 0, value);
            return arr;
        } else {
            double[][][] cholesky = calculate_cholesky(model);
            double[] value = logsumexp(estimateWeightedLogProb(c_means_mat, cholesky, c_w, X, model));
            Mat arr = new Mat(1, value.length, CvType.CV_32FC1);
            arr.put(0, 0, value);
            return arr;
        }
    }


	/*private static double[][] cholesky(double[][] a) {
		final int m = a.length;
		double epsilon = 0.000001; // Small extra noise value
		double[][] l = new double[m][m];
		for (int i = 0; i < m; i++) {
			for (int k = 0; k < (i + 1); k++) {
				double sum = 0;
				for (int j = 0; j < k; j++) {
					sum += l[i][j] * l[k][j];
				}
				l[i][k] = (i == k) ? Math.sqrt(a[i][i] + epsilon - sum) : // Add noise to diagonal values
						(1.0 / l[k][k] * (a[i][k] - sum));
			}
		}
		return l;
	}*/

    private double[] computeLogDetCholesky(double[][][] matrix_chol, double n_features) {
        int n_components = (int) (n_features);
        double[][] mat1 = new double[n_components][9];
        double[][] mat2 = new double[n_components][3];

        double[][] mat_log_chol = new double[n_components][3];
        double[] matResult = new double[n_components];

        for (int i = 0; i < n_components; i++) {
            double sum = 0;
            double[] temp = new double[9];
            int cnt = 0;
            for (int j = 0; j < 3; j++) {
                for (int k = 0; k < 3; k++) {
                    temp[cnt] = matrix_chol[i][j][k];
                    cnt++;
                }
            }
            mat1[i] = temp;

            for (int q = 0; q < 9; q += 1) {
                if (q == 0) {
                    mat2[i][0] = mat1[i][q];
                } else if (q == 4) {
                    mat2[i][1] = mat1[i][q];
                } else if (q == 8) {
                    mat2[i][2] = mat1[i][q];
                }
            }

            for (int j = 0; j < 3; j++) {
                mat_log_chol[i][j] = Math.log(mat2[i][j]);
                sum += mat_log_chol[i][j];
            }
            matResult[i] = sum;
        }

        return matResult;
    }

    public double[] estimateLogWeights(double[] weights, String model) { // Pass weight here instead of model ---
        // weights(6, 1)
        int dim = 0;
        if (model == "p") {
            dim = 6;
        } else {
            dim = 10;
        }
        double[] mat12 = new double[dim];
        for (int i = 0; i < dim; i++) {
            mat12[i] = Math.log(weights[i]);
        }
        return mat12;
    }

    public double[][] estimateLogGaussianProb(double[] sample, double[][] means, double[][][] precisions_chol, Mat X) {

        double logValue = Math.log(2 * Math.PI);

        double[][] y = new double[X.rows()][3];
        int nFeatures = sample.length; // s.width is required
        double[] logDet = computeLogDetCholesky(precisions_chol, nFeatures); // Should be negative?? Should be 1D?

        double[][] result_log_prob = new double[X.rows()][nFeatures];

        double[][] Xmat = new double[X.rows()][X.cols()];
        for (int x = 0; x < X.rows(); x++) {
            for (int z = 0; z < X.cols(); z++) {
                Xmat[x][z] = X.get(x, z)[0];
            }
        }
        RealMatrix Xarr = new Array2DRowRealMatrix(Xmat);

        for (int k = 0; k < nFeatures; k++) {

            double[][] prec_chol_result = new double[1][3];
            double[][] mu = new double[1][3];
            //double[][] dest = new double[X.rows()][3];
            RealMatrix dest1 = new Array2DRowRealMatrix(X.rows(), 3);

            RealMatrix prec_chol1 = new Array2DRowRealMatrix(precisions_chol[k]);
            RealMatrix prec_chol_result1 = new Array2DRowRealMatrix(prec_chol_result);

            //double[][] prec_chol = new double[3][3];

            for (int t = 0; t < 3; t++) {
                mu[0][t] = means[k][t];
				/*for (int l = 0; l < 3; l++) {
					//prec_chol[t][l] = precisions_chol[k][t][l];
					prec_chol_result[t] += mu[0][l] * prec_chol[l][t];
				}*/
            }
            RealMatrix mu1 = new Array2DRowRealMatrix(mu);
            prec_chol_result1 = mu1.multiply(prec_chol1);
            dest1 = Xarr.multiply(prec_chol1);
            double[][] tt = dest1.getData();
            prec_chol_result = prec_chol_result1.getData();

            for (int i = 0; i < X.rows(); i++) {
                double sum = 0;
                for (int j = 0; j < 3; j++) {
					/*for (int r = 0; r < 3; r++) {
						dest[i][j] += X.get(i, r)[0] * prec_chol[r][j];
					}*/
                    y[i][j] = tt[i][j] - prec_chol_result[0][j];
                    y[i][j] = y[i][j] * y[i][j];
                    sum += y[i][j];
                }
                result_log_prob[i][k] = sum;
            }
        }

        double new1 = nFeatures * logValue;

        RealMatrix result_log_prob1 = new Array2DRowRealMatrix(result_log_prob);
        result_log_prob1.scalarAdd(new1);
        result_log_prob = result_log_prob1.getData();

        for (int i = 0; i < X.rows(); i++) {
            for (int j = 0; j < nFeatures; j++) {
                result_log_prob[i][j] *= (-0.5);
                result_log_prob[i][j] += logDet[j];
            }
        }

        return result_log_prob; // Wrong value here
    }

    public double[][] estimateLogProb(double[][] means, double[][][] cholesky, double[] sample, Mat X) {
        return estimateLogGaussianProb(sample, means, cholesky, X);
    }

    public List<Mat> maskImage(Mat image) {

        double p_prior = 0.25;
        double y_prior = 0.25;
        double c_prior = 0.5;
        double threshold = 0.99;

        if(image == null){
            return null;
        }
        // img_shape = image.shape
        Mat img_list = image.reshape(1, image.rows() * image.cols());
        // Set a model in Gaussian first and then check


        Mat p_likelihood = score_samples("p", img_list); // np.exp? This should be an array.. need to revisit
        Mat y_likelihood = score_samples("y", img_list);
        Mat c_likelihood = score_samples("c", img_list);

        Core.exp(p_likelihood, p_likelihood);
        Core.exp(y_likelihood, y_likelihood);
        Core.exp(c_likelihood, c_likelihood);

        p_likelihood.convertTo(p_likelihood, CvType.CV_32FC1);
        y_likelihood.convertTo(y_likelihood, CvType.CV_32FC1);
        c_likelihood.convertTo(c_likelihood, CvType.CV_32FC1);

        Mat p_mul = new Mat(p_likelihood.rows(), p_likelihood.cols(), CvType.CV_32FC1);
        Mat y_mul = new Mat(y_likelihood.rows(), y_likelihood.cols(), CvType.CV_32FC1);
        Mat c_mul = new Mat(c_likelihood.rows(), c_likelihood.cols(), CvType.CV_32FC1);

        Core.multiply(p_likelihood, new Scalar(p_prior), p_mul);
        Core.multiply(y_likelihood, new Scalar(y_prior), y_mul);
        Core.multiply(c_likelihood, new Scalar(c_prior), c_mul);

        Mat p_mul_add = new Mat(p_mul.rows(), p_mul.cols(), CvType.CV_32FC1);
        //Mat posterior = new Mat(p_mul.rows(), p_mul.cols(), CvType.CV_32FC1);
        Mat post_divisor = new Mat(p_mul.rows(), p_mul.cols(), CvType.CV_32FC1);

        Core.add(p_mul, y_mul, p_mul_add);
        Core.add(p_mul_add, c_mul, post_divisor);

        Mat p_posterior = new Mat(p_mul.rows(), p_mul.cols(), CvType.CV_32FC1);
        Mat y_posterior = new Mat(y_mul.rows(), y_mul.cols(), CvType.CV_32FC1);
        Mat c_posterior = new Mat(c_mul.rows(), c_mul.cols(), CvType.CV_32FC1);

        Core.divide(p_mul, post_divisor, p_posterior);
        Core.divide(y_mul, post_divisor, y_posterior);
        Core.divide(c_mul, post_divisor, c_posterior);

        Mat p_map = p_posterior.reshape(1, image.rows()); // needto check
        Mat p_mask = new Mat(p_map.rows(), p_map.cols(), CvType.CV_32FC1);
        Core.compare(p_map, new Scalar(threshold), p_mask, Core.CMP_GT);

        Mat y_map = y_posterior.reshape(1, image.rows()); // needto check
        Mat y_mask = new Mat(p_map.rows(), y_map.cols(), CvType.CV_32FC1);
        Core.compare(y_map, new Scalar(threshold), y_mask, Core.CMP_GT);

        Mat c_map = c_posterior.reshape(1, image.rows()); // needto check
        Mat c_mask = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.compare(c_map, new Scalar(threshold), c_mask, Core.CMP_GT);

        Mat p_y_comp = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.compare(p_map, y_map, p_y_comp, Core.CMP_GT);
        Mat p_c_comp = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.compare(p_map, c_map, p_c_comp, Core.CMP_GT);
        Mat p_c_and = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.bitwise_and(p_y_comp, p_c_comp, p_c_and);
        Mat p_segment = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.bitwise_and(p_mask, p_c_and, p_segment);

        Mat y_y_comp = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.compare(y_map, p_map, y_y_comp, Core.CMP_GT);
        Mat y_c_comp = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.compare(y_map, c_map, y_c_comp, Core.CMP_GT);
        Mat y_c_and = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.bitwise_and(y_y_comp, y_c_comp, y_c_and);
        Mat y_segment = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.bitwise_and(y_mask, y_c_and, y_segment);

        Mat c_y_comp = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.compare(c_map, p_map, c_y_comp, Core.CMP_GT);
        Mat c_c_comp = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.compare(c_map, y_map, c_c_comp, Core.CMP_GT);
        Mat c_c_and = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.bitwise_and(c_y_comp, c_c_comp, c_c_and);
        Mat c_segment = new Mat(c_map.rows(), c_map.cols(), CvType.CV_32FC1);
        Core.bitwise_and(c_mask, c_c_and, c_segment);

        Mat segmentation_mask = Mat.zeros(image.rows(), image.cols(), CvType.CV_8UC3); // Need to check
        segmentation_mask.setTo(new Scalar(200, 160, 230), p_segment);
        segmentation_mask.setTo(new Scalar(0, 255, 255), y_segment);
        segmentation_mask.setTo(new Scalar(200, 200, 200), c_segment);

        /*Bitmap bmp = Bitmap.createBitmap(segmentation_mask.cols(), segmentation_mask.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(segmentation_mask, bmp); //This bmp needs to be saved //Sachin
        setImage(bmp, "mask");*/

//        File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
//        Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + "_mask_final.jpg", segmentation_mask);

        // Mat p_segment_img = new Mat(1, 3, CvType.CV_32FC1);
        // p_segment.convertTo(p_segment, CvType.CV_8UC1);
        Core.multiply(p_segment, new Scalar(255), p_segment);
        Core.multiply(y_segment, new Scalar(255), y_segment);

        ArrayList<Mat> al = new ArrayList<>();
        al.add(p_segment);
        al.add(y_segment);
        al.add(segmentation_mask);
        return al;
    }

    public Tube cropped_tube_circle(int num, int mm_to_px) {
        Mat tube1 = new Mat(1, 2, CvType.CV_32FC1);
//		tube1.put(0, 0, new double[] { 6, 21.5 });
//		double tube_offset = 9.7;

//        tube1.put(0, 0, new double[] { 3, 9.5 });//11.5 });
//        double tube_offset = 5;

//        tube1.put(0, 0, new double[] { 2, 6.8 });//11.5 });
//        double tube_offset = 2.95;
        double tube_offset = 0;
        //if(DEBUG_ENABLED){
        //stable build below
        //   tube1.put(0, 0, new double[] { 1.20, 5.8 });//11.5 }); //1.4, 4.6 // (testbed)
        //   tube_offset = 2.6;//2.48; //2.38 //testbed 2.52

        tube1.put(0, 0, new double[] { 28.4, 34 });//11.5 }); //1.4, 4.6 // (testbed)
        tube_offset = 8.8;//2.48; //2.38 //testbed 2.52
        /*}else {
            tube1.put(0, 0, new double[]{1.65, 4.8});//11.5 }); //1.4, 4.6 //{ 1.55, 5.5 }); (testbed)
            tube_offset = 2.48;//2.48; //2.38 //testbed 2.52
        }*/

        Mat round = new Mat(1, 2, CvType.CV_32FC1);
        round.put(0, 0, new double[] { tube_offset * (num - 1), 0 });

        Mat center = new Mat(1, 2, CvType.CV_32FC1);
        Core.add(tube1, round, center);

        Core.multiply(center, new Scalar(mm_to_px), center);

        float val[] = new float[2];
        center.get(0, 0, val);

        double valarr[] = new double[2];
        valarr[0] = val[0];
        valarr[1] = val[1];

        Point p = new Point();
        p.set(valarr);

        int radius = (int) (3 * mm_to_px);
        //int radius = (int) (0.75 * mm_to_px);
        Tube t = new Tube();
        t.setCenter(p);
        t.setRadius(radius);
        return t;
    }

    public Mat drawTubes(Mat full_mask) {
        Mat testmask = full_mask.clone();
        int mm_to_px = full_mask.cols() / 20;//40;
//        Mat pmask_32 = new Mat(pmask.rows(), pmask.cols(), CvType.CV_32FC1)
//        pmask.convertTo(pmask_32, CvType.CV_32FC1);
        for (int i = 1; i < 9; i++) {
            Tube ret = cropped_tube_circle(i, mm_to_px);
            Imgproc.circle(testmask, ret.getCenter(), ret.getRadius(), new Scalar(0, 255, 0), 1);
        }
        return testmask;
    }

    public Mat drawTubesWithFill(Mat full_mask, List colors) {
        Mat testmask = full_mask.clone();
        int mm_to_px = full_mask.cols() / 120;//40;
        for (int i = 1; i < 9; i++) {
            Tube ret = cropped_tube_circle(i, mm_to_px);
            if((Character)colors.get(i-1) == 'P') {
                Imgproc.circle(testmask, ret.getCenter(), ret.getRadius(), new Scalar(255, 193, 203), 3);
            }else if((Character)colors.get(i-1) == 'Y'){
                Imgproc.circle(testmask, ret.getCenter(), ret.getRadius(), new Scalar(255, 255, 0), 3);
            }else{
                Imgproc.circle(testmask, ret.getCenter(), ret.getRadius(), new Scalar(0, 0, 0), 3);
            }
        }
        return testmask;
    }

    // GMM function to detect blobs
    public List<Character> checkTubes(Mat pmask, Mat ymask, Mat full_mask) {
        List<Character> colors = new ArrayList<Character>(); // 8
        double threshold = 0.1;
        //int mm_to_px = pmask.cols() / 80;
        int mm_to_px = pmask.cols() / 20;//40;
        Mat mask;
        Mat pmask_32 = new Mat(pmask.rows(), pmask.cols(), CvType.CV_32FC1);
        pmask.convertTo(pmask_32, CvType.CV_32FC1);
        Mat ymask_32 = new Mat(ymask.rows(), ymask.cols(), CvType.CV_32FC1);
        ymask.convertTo(ymask_32, CvType.CV_32FC1);
//        Mat pmask_32 = new Mat(pmask.rows(), pmask.cols(), CvType.CV_32FC1)
//        pmask.convertTo(pmask_32, CvType.CV_32FC1);
        for (int i = 1; i < 9; i++) {
            Mat tube_mask = Mat.zeros(pmask.rows(), pmask.cols(), CvType.CV_32FC1);
            Mat tube_mask1 = tube_mask.clone();

            Tube ret = cropped_tube_circle(i, mm_to_px);

            Mat p_mask_tube_mid = new Mat(pmask.rows(), pmask.cols(), CvType.CV_32FC1);
            Core.compare(pmask_32, tube_mask, p_mask_tube_mid, Core.CMP_NE); // For Boolean
            Imgproc.circle(tube_mask, ret.getCenter(), ret.getRadius(), new Scalar(1), -1);
            Core.compare(tube_mask, tube_mask1, tube_mask, Core.CMP_NE); // For Boolean
            Core.bitwise_and(p_mask_tube_mid, tube_mask, p_mask_tube_mid);
            Core.multiply(p_mask_tube_mid, new Scalar(255), p_mask_tube_mid);

            Mat y_mask_tube_mid = new Mat(pmask.rows(), pmask.cols(), CvType.CV_32FC1);
            Core.compare(ymask_32, tube_mask1, y_mask_tube_mid, Core.CMP_NE); // For Boolean
            Core.bitwise_and(y_mask_tube_mid, tube_mask, y_mask_tube_mid); // For Boolean
            Core.multiply(y_mask_tube_mid, new Scalar(255), y_mask_tube_mid);

            colors.add(detect_blobs(p_mask_tube_mid, y_mask_tube_mid));
        }
        return colors;
    }

    public List<Character> checkTubes_RD(Mat image) {
        Mat img = image.clone();
        Imgproc.cvtColor(img, img, Imgproc.COLOR_BGR2RGB);
        List<Character> colors = new ArrayList<Character>(); // 8
        int mm_to_px = img.cols() / 120;//40;
        double threshold = 1.6;
        for (int i = 1; i < 9; i++) {
            Tube ret = cropped_tube_circle(i, mm_to_px);

            double x1 = ret.getCenter().x - ret.getRadius();
            double y1 = ret.getCenter().y - ret.getRadius();

            Rect r = new Rect((int)x1, (int)y1, 2*ret.getRadius(), 2*ret.getRadius());
            Mat cropped_image = new Mat(2*ret.getRadius(), 2*ret.getRadius(), img.type());
            img.submat(r).copyTo(cropped_image);

            double x2 = ret.getCenter().x - ret.getRadius();
            double y2 = ret.getCenter().y + (2*ret.getRadius());
            Rect r2 = new Rect((int)x2, (int)y2, 2*ret.getRadius(), 2*ret.getRadius());
            Mat reference_image=new Mat(2*ret.getRadius(),2*ret.getRadius(),img.type());
            img.submat(r2).copyTo(reference_image);
            cropped_image = whiteBalance(cropped_image, reference_image);
//            Bitmap bmp = Bitmap.createBitmap(cropped_image.cols(), cropped_image.rows(), Bitmap.Config.ARGB_8888);
//            Utils.matToBitmap(cropped_image, bmp); //This bmp needs to be saved //Sachin

            //Convert to 1D
            Mat cropped_1D = cropped_image.reshape(3, cropped_image.rows() * cropped_image.cols()); //1 channel
            colors.add(extractColor(cropped_1D));

            //List maskList = maskImage(cropped_image);

            /*File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + "_mask_final.jpg", (Mat)maskList.get(2));*/

//            Mat p_mask = (Mat)maskList.get(0);
//            Mat y_mask = (Mat)maskList.get(1);
//            colors.add(detect_blobs(p_mask, y_mask));
        }
        return colors;
    }

    public List<Character> checkTubes_GMM(Mat img) {
        List<Character> colors = new ArrayList<Character>(); // 8
        int mm_to_px = img.cols() / 120;//40;
        for (int i = 1; i < 9; i++) {
            Tube ret = cropped_tube_circle(i, mm_to_px);

            double x1 = ret.getCenter().x - ret.getRadius();
            double y1 = ret.getCenter().y - ret.getRadius();

            Rect r = new Rect((int)x1, (int)y1, 2*ret.getRadius(), 2*ret.getRadius());
            Mat cropped_image = new Mat(2*ret.getRadius(), 2*ret.getRadius(), img.type());
            img.submat(r).copyTo(cropped_image);

            double x2 = ret.getCenter().x - ret.getRadius();
            double y2 = ret.getCenter().y + (2*ret.getRadius());
            Rect r2 = new Rect((int)x2, (int)y2, 2*ret.getRadius(), 2*ret.getRadius());
            Mat reference_image=new Mat(2*ret.getRadius(),2*ret.getRadius(),img.type());
            img.submat(r2).copyTo(reference_image);

            List maskList = maskImage(cropped_image);

            /*File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + "_mask_final.jpg", (Mat)maskList.get(2));*/

            Mat p_mask = (Mat)maskList.get(0);
            Mat y_mask = (Mat)maskList.get(1);
            colors.add(detect_blobs(p_mask, y_mask));
        }
        return colors;
    }

    public List<Character> checkTubes_Kmeans(Mat image) {
        Mat img = image.clone();
        Imgproc.cvtColor(image, image, Imgproc.COLOR_BGR2Luv);
        List<Character> colors = new ArrayList<Character>(); // 8
        int mm_to_px = img.cols() / 20;//40;

        for (int i = 1; i < 9; i++) {
            Tube ret = cropped_tube_circle(i, mm_to_px);
            double x1 = ret.getCenter().x - ret.getRadius();
            double y1 = ret.getCenter().y - ret.getRadius();

            Rect r = new Rect((int)x1, (int)y1, 2*ret.getRadius(), 2*ret.getRadius());
            Mat cropped_image = new Mat(2*ret.getRadius(), 2*ret.getRadius(), img.type());
            img.submat(r).copyTo(cropped_image);
            Bitmap bmp = Bitmap.createBitmap(cropped_image.cols(), cropped_image.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(cropped_image, bmp); //This bmp needs to be saved //Sachin

            int hueMid = findHueKMeans(cropped_image);
//            File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
//            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + "_mask_final.jpg", (Mat)maskList.get(2));

            Character c = null;
            if(hueMid != 0){
                c = 'P';
            }else{
                c = 'Y';
            }
            colors.add(c);
        }
        return colors;
    }

    public List<Character> checkTubes_NM(Mat image) {
        Mat img = image.clone();
        Imgproc.cvtColor(image, image, Imgproc.COLOR_BGR2RGB);
        List<Character> colors = new ArrayList<Character>(); // 8
        int mm_to_px = img.cols() / 20;//40;

        for (int i = 1; i < 9; i++) {
            Tube ret = cropped_tube_circle(i, mm_to_px);
            double x1 = ret.getCenter().x - ret.getRadius();
            double y1 = ret.getCenter().y - ret.getRadius();
            double x2 = ret.getCenter().x - ret.getRadius();
            double y2 = ret.getCenter().y + (2 * ret.getRadius());

            Rect r = new Rect((int)x1, (int)y1, 2*ret.getRadius(), 2*ret.getRadius());
            Mat cropped_image = new Mat(2*ret.getRadius(), 2*ret.getRadius(), img.type());
            img.submat(r).copyTo(cropped_image);

            Rect r2 = new Rect((int)x2, (int)y2, 2*ret.getRadius(), 2*ret.getRadius());
            Mat reference_image = new Mat(2*ret.getRadius(), 2*ret.getRadius(), img.type());
            img.submat(r).copyTo(reference_image);

            //Find white
            Core.mean(reference_image);

            Bitmap bmp = Bitmap.createBitmap(cropped_image.cols(), cropped_image.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(cropped_image, bmp); //This bmp needs to be saved //Sachin

            int hueMid = findHueKMeans(cropped_image);
//            File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
//            Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + "_mask_final.jpg", (Mat)maskList.get(2));

            Character c = null;
            if(hueMid != 0){
                c = 'P';
            }else{
                c = 'Y';
            }
            colors.add(c);
        }
        return colors;
    }

    // Detect blobs
    public Character detect_blobs(Mat p_mask, Mat y_mask) {
        Mat hierarchy = new Mat();
        List<MatOfPoint> p_contours = new ArrayList<MatOfPoint>();
        List<MatOfPoint> y_contours = new ArrayList<MatOfPoint>();
        Mat p_mask_32 = new Mat(p_mask.rows(), p_mask.cols(), CvType.CV_8UC1);
        p_mask.convertTo(p_mask_32, CvType.CV_8UC1);

        Mat y_mask_32 = new Mat(y_mask.rows(), y_mask.cols(), CvType.CV_8UC1);
        y_mask.convertTo(y_mask_32, CvType.CV_8UC1);

        Imgproc.findContours(p_mask_32, p_contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);
        Imgproc.findContours(y_mask_32, y_contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);
        double p_size = 0;
        double y_size = 0;
        for (int k = 0; k < p_contours.size(); k++) {
            double area = Imgproc.contourArea(p_contours.get(k));
            if (area > p_size) {
                p_size = area;
            }
        }
        for (int j = 0; j < y_contours.size(); j++) {
            double area = Imgproc.contourArea(y_contours.get(j));
            if (area > y_size) {
                y_size = area;
            }
        }
        Character retval;
        if (p_size > y_size) {
            retval = 'P';
        } else if (y_size > p_size) {
            retval = 'Y';
        } else {
            retval = 'U';
        }
        return retval;
    }


    //Functions taken from last algo

    //Funciton for k means
    private int findHueKMeans(Mat croppedImage) {
        Mat outputMat = calculateKmeans(croppedImage);
        int finalhue = 0;
        Mat huemat = new Mat();
        if (outputMat != null) {
            Log.d("MEANS", outputMat.dump());
            //Imgproc.cvtColor(outputMat, huemat, Imgproc.COLOR_BGR2HSV);
            int size = (int) (outputMat.total() * outputMat.channels());
            float[] colors = new float[size];
            outputMat.get(0, 0, colors);
            finalhue = (int) convertRGBtoHSV(colors[2], colors[1], colors[0]);
            Log.d("test", String.valueOf(finalhue));
        }
        return finalhue;
    }

    private static List<Mat> showClusters (Mat cutout, Mat labels, Mat centers) {
        centers.convertTo(centers, CvType.CV_8UC1, 255.0);
        centers.reshape(3);

        List<Mat> clusters = new ArrayList<Mat>();
        for(int i = 0; i < centers.rows(); i++) {
            clusters.add(Mat.zeros(cutout.size(), cutout.type()));
        }

        Map<Integer, Integer> counts = new HashMap<Integer, Integer>();
        for(int i = 0; i < centers.rows(); i++) counts.put(i, 0);

        int rows = 0;
        for(int y = 0; y < cutout.rows(); y++) {
            for(int x = 0; x < cutout.cols(); x++) {
                int label = (int)labels.get(rows, 0)[0];
                int r = (int)centers.get(label, 2)[0];
                int g = (int)centers.get(label, 1)[0];
                int b = (int)centers.get(label, 0)[0];
                counts.put(label, counts.get(label) + 1);
                clusters.get(label).put(y, x, b, g, r);
                rows++;
            }
        }
        System.out.println(counts);
        return clusters;
    }

    private Mat calculateKmeansMat(Mat image) {
        Mat img = new Mat();
        Imgproc.cvtColor(image, img, Imgproc.COLOR_BGRA2RGB);
        Mat samples32f = new Mat();
        img.convertTo(samples32f, CvType.CV_32F);
        Mat samples = samples32f.reshape(3, img.rows() * img.cols());
        int K = 20;
        Mat bestLabels = new Mat();
        TermCriteria criteria = new TermCriteria(TermCriteria.EPS + TermCriteria.MAX_ITER, 20, 1.0);
        int attempts = 10;
        int flags = Core.KMEANS_RANDOM_CENTERS;
        Mat centers = new Mat();
        double compactness = Core.kmeans(samples, K, bestLabels, criteria, attempts, flags, centers);
        int n = img.rows() * img.cols();
        Mat data = new Mat(samples.rows(), samples.cols(), samples.type());
        for (int i = 0; i < n; ++i)
        {
            int label = ((int)bestLabels.get(i,0)[0]);
            data.put(i, 0, centers.get(label, 0)[0], centers.get(label, 1)[0], centers.get(label, 2)[0]);
        }

        Mat reduced = data.reshape(3, img.rows());
        reduced.convertTo(reduced, CvType.CV_8U);

        Bitmap bmp = Bitmap.createBitmap(reduced.cols(), reduced.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(reduced, bmp); //This bmp needs to be saved //Sachin
        Imgproc.cvtColor(reduced, reduced, Imgproc.COLOR_RGB2BGR);
        return reduced; // no center found..
    }

    private Mat whiteBalance(Mat image, Mat ref_image){
        Mat cropped_image = image.clone();
        Scalar white = Core.mean(ref_image);
        Scalar delta = new Scalar(255,255,255);
        delta.val[0] = delta.val[0] - white.val[0];
        delta.val[1] = delta.val[1] - white.val[1];
        delta.val[2] = delta.val[2] - white.val[2];
        Mat delta_array_1D = Mat.zeros(cropped_image.rows() * cropped_image.cols(), 1, CvType.CV_8UC3);
        Core.add(delta_array_1D, new Scalar(1.0, 1.0, 1.0), delta_array_1D);
        Core.multiply(delta_array_1D, delta, delta_array_1D);
        Mat delta_array = delta_array_1D.reshape(3, cropped_image.rows());
        Core.add(cropped_image, delta_array, cropped_image);
        Mat ci_threshold = new Mat();
        Imgproc.threshold(cropped_image, ci_threshold, 255, 255, Imgproc.THRESH_TRUNC);
        File folder = new File(Environment.getExternalStorageDirectory(), "/Download/Dragonfly/test");
        Imgcodecs.imwrite(folder.getAbsolutePath() + "/" + System.currentTimeMillis() + "_maskfinal.jpg", cropped_image);
        return ci_threshold;
    }

    private Mat getValueOnCondition(Mat m, double threshold){
        Mat res = m.clone();
        for(int i=0;i<m.rows();i++){
            double r = m.get(i,0)[0];
            if(r > threshold){
                res.put(i, 0, 0);
            }
        }
        return res;
    }

    private Mat removeHighIntensityRGB(Mat img_1D, double threshold){
        double thr_adapt = threshold;
        Mat intensity = new Mat(img_1D.rows(), 1, CvType.CV_32FC1);
        for(int i=0;i<intensity.rows();i++){
            double r = img_1D.get(i,0)[0] / 255.0;
            double g = img_1D.get(i,0)[1] / 255.0;
            double b = img_1D.get(i,0)[2] / 255.0;
            double ins = Math.sqrt((r * r) + (g * g) + (b * b));
            intensity.put(i,0, ins);
        }
        Mat img_1D_corr = img_1D.clone();
        while(img_1D_corr.rows() < 50){
            Mat res = getValueOnCondition(intensity, thr_adapt);
            int cnt = Core.countNonZero(res);
            if(cnt != 0) {
                Mat idx_intensity = new Mat(res.rows(), res.cols(), res.type());
                Core.findNonZero(res, idx_intensity);
                MatOfPoint mop = new MatOfPoint(idx_intensity);
                thr_adapt = thr_adapt + 0.01;
            }
        }
        return img_1D_corr;
    }

    private double[] hue(Mat img_HSV_1D){
        double hueArr[] = new double[img_HSV_1D.rows()];
        List hueList = new ArrayList<Double>();
        for(int i=0;i<img_HSV_1D.rows();i++){
            double d[] = img_HSV_1D.get(i,0);
            hueArr[i] = d[0];
            if((hueArr[i] > -4) && (hueArr[i] < 4)){
                hueArr[i] = 0; //Removing this pixel and setting as 0
            }
        }
        //Sort array here
        Arrays.sort(hueArr);
        for(int i=0;i<hueArr.length;i++){
            if(hueArr[i] != 0){
                hueList.add(hueArr[i]);
            }
        }
        /*for(int i=0;i<img_HSV_1D.rows();i++){
            if(hueArr[i] > 180.0){
                hueArr[i] = hueArr[i] - 360.0;
                if((hueArr[i] > -4) && (hueArr[i] < 4)){
                    hueArr[i] = 0; //Removing this pixel and setting as 0
                }else{
                    hueList.add(hueArr[i]);
                }
            }
        }*/
        if(hueList.size() > 0){
            double xd[] = new double[hueList.size()];
            for(int k=0;k<hueList.size();k++){
                xd[k] = (double)hueList.get(k);
            }
            return xd;
        }
        return hueArr;
    }
    private Character extractColor(Mat img_1D){
        double threshold = 1.6;
        float median = 0.0f;
        Mat img_1D_res = removeHighIntensityRGB(img_1D, threshold);
        Mat img_HSV_1D = new Mat();
        Imgproc.cvtColor(img_1D_res, img_HSV_1D, Imgproc.COLOR_RGB2HSV);
        double[] img_HSV_Hue = hue(img_HSV_1D);

        List finalHueList = new ArrayList<Double>();
        if(img_HSV_Hue.length > 0) {
            for (int i = 0; i < img_HSV_Hue.length;i++){
                boolean param = ((img_HSV_Hue[i] > -100) & (img_HSV_Hue[i] < 100));
                if(param){
                    finalHueList.add(img_HSV_Hue[i]);
                }
            }
        }
        if(finalHueList.size() > 0){
            double xd[] = new double[finalHueList.size()];
            for(int k=0;k<finalHueList.size();k++){
                xd[k] = (double)finalHueList.get(k);
            }
            //Calculate median here
            if(xd.length % 2 == 0){ //if even
                median = (float) (xd[xd.length/2] + xd[(xd.length/2) + 1]);
            }else{
                median = (float) xd[(xd.length/2) + 1];
            }
            Log.d("test", "test");
        }else{
            //redo test
            median = 0;
        }
        if(median < 15.0){
            return 'P';
        }
        return 'Y';
    }

    private Mat calculateKmeans(Mat image) {
        Mat img = new Mat();
        Imgproc.cvtColor(image, img, Imgproc.COLOR_BGRA2RGB);
        Bitmap bmp1 = Bitmap.createBitmap(img.cols(), img.rows(), Bitmap.Config.RGB_565);
        Utils.matToBitmap(img, bmp1);
        Mat samples32f = new Mat();
        img.convertTo(samples32f, CvType.CV_32F);
        //image.convertTo(img, CvType.CV_32F);
        Mat samples = samples32f.reshape(3, img.rows() * img.cols());
        //Mat data = img.reshape(-1, 2);
        int K = 20;
        Mat bestLabels = new Mat();
        TermCriteria criteria = new TermCriteria(TermCriteria.EPS + TermCriteria.MAX_ITER, 20, 1.0);
        int attempts = 10;
        int flags = Core.KMEANS_RANDOM_CENTERS;
        Mat centers = new Mat();
        double compactness = Core.kmeans(samples, K, bestLabels, criteria, attempts, flags, centers);
        //Mat draw = new Mat((int)img.total(),1, CvType.CV_32FC3);
        //Mat colors = centers.reshape(3, K);
//        for (int i = 0; i < K; i++) {
//            //Mat mask = new Mat(); // a mask for each cluster label
//            //Core.compare(bestLabels, new Scalar(i), mask, Core.CMP_EQ);
//            Mat col = colors.row(i);
//        }
        Log.d("CentersMatrix", centers.dump());
//        for (int i = 0; i < 20; i++) {
//            if (!findPink(centers.row(i))) {
//                return centers.row(i); // return centers found as mat
//            }
//        }

        for (int i = 0; i < 20; i++) {
            if (!meanDiff(centers.row(i))) {
                int hue = findPink(centers.row(i));
                if (hue > 0) {
                    return centers.row(i); // return centers found as mat
                }
            }
        }
        return null; // no center found..
    }

    private boolean meanDiff(Mat oneCenter) {
        Scalar meanCenter = Core.mean(oneCenter);
        double mean = meanCenter.val[0];
        int size = (int) (oneCenter.total() * oneCenter.channels());
        float[] channels = new float[size];
        oneCenter.get(0, 0, channels);
        for (int i = 0; i < size; i++) {
            if (abs(mean - channels[i]) > 10) {
                return false;
            }
        }
        return true;
    }

    private int findPink(Mat oneCenter) {

        int hue = findHueColors(oneCenter);
        if (hue >= 100 && hue <= 180) { //(hue > 0)
            return hue;
        }
        return -1;
//        for (int i = 0; i < size; i++) {
//
//        }
    }

    private int findHueColors(Mat oneCenter) {
        int size = (int) (oneCenter.total() * oneCenter.channels());
        float[] channels = new float[size];
        oneCenter.get(0, 0, channels);
        int hue = (int) convertRGBtoHSV(channels[2], channels[1], channels[0]);
        return hue;

    }

    private double convertRGBtoHSV(double r, double g, double b) {
        r = r / 255.0;
        g = g / 255.0;
        b = b / 255.0;

        // h, s, v = hue, saturation, value
        double cmax = Math.max(r, Math.max(g, b)); // maximum of r, g, b
        double cmin = Math.min(r, Math.min(g, b)); // minimum of r, g, b
        double diff = cmax - cmin; // diff of cmax and cmin.
        double h = -1;

        // if cmax and cmax are equal then h = 0
        if (cmax == cmin)
            h = 0;

            // if cmax equal r then compute h
        else if (cmax == r)
            h = (60 * ((g - b) / diff) + 360) % 360;

            // if cmax equal g then compute h
        else if (cmax == g)
            h = (60 * ((b - r) / diff) + 120) % 360;

            // if cmax equal b then compute h
        else if (cmax == b)
            h = (60 * ((r - g) / diff) + 240) % 360;

        return h;
    }

}