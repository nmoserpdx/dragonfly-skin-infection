package com.protondx.dragonfly.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.Nullable;

import com.protondx.dragonfly.datamodels.AppConfiguration;
import com.protondx.dragonfly.datamodels.DashboardResults;
import com.protondx.dragonfly.datamodels.TestResults;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class DbHandler extends SQLiteOpenHelper {
    private Context ctx;
    private static String TEG="pdx";
    private static String DATABASE_NAME="pdx.db";
    private static int DATABASE_VERSION=1;
    public DbHandler(@Nullable Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
        ctx=context;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("create table IF NOT EXISTS PDX"+"('Sl.No' INTEGER primary key AUTOINCREMENT NOT NULL,'id' INTEGER,'Login_Data'text,'Test_Result'text,'Date' date)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {

    }

    //Code for inserting a test result in the DB
    public boolean insertData(TestResults testResults)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        ContentValues contentValues=new ContentValues();
        contentValues.put("id",testResults.getId());
        contentValues.put("Login_Data",testResults.getLoginData());
        contentValues.put("Test_Result",testResults.getTestResult());
        SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd", Locale.getDefault());
        String currentDateandTime = sdf.format(new Date());
        contentValues.put("Date",currentDateandTime);
        db.insert("PDX",null,contentValues);
        db.close();
        Log.e("dbHandler","insertData");
        return  true;
    }

    //Code for getting all the results stored in the DB
    public ArrayList<TestResults>getAllResults(String loginData)
    {
        ArrayList<TestResults> arrayList=new ArrayList<>();
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor=db.rawQuery("select * from PDX ",null );
        cursor.moveToFirst();
        if(cursor.moveToFirst())
        {
            do {
                TestResults testResults=new TestResults();
                testResults.setId(cursor.getString(1));
                testResults.setLoginData(cursor.getString(2));
                testResults.setTestResult(cursor.getString(3));
                arrayList.add(testResults);
            }while (cursor.moveToNext());
        }
      return arrayList;
    }

    //Equivalent to Dashboard results (/dashboardresults)
    /*{
      "testtoday": 0,
      "testmonth": 146,
      "testyear": 146,
      "graphdata": {
        "january": 0,
        "february": 0,
        "march": 0,
        "april": 146,
        "may": 0,
        "june": 0,
        "july": 0,
        "august": 0,
        "september": 0,
        "october": 0,
        "november": 0,
        "december": 0
      },
      "piedata": {
        "positive": 0,
        "negative": 0,
        "noresult": 25
      }
    }*/
    public ArrayList<?> getDashboardResults(String from_date, String to_date, String org_id){
        ArrayList<DashboardResults> arrayList = new ArrayList<>();
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor=null;
        //Query for today/month/year
        String today = "0"; //convert to date format
        String currentYear = "0";
        DashboardResults dashboardResults=new DashboardResults(); //
        if(org_id == null) { //one option is to remove strftime to date/year/month function
            cursor = db.rawQuery("select COUNT(id) from PDX group by strftime(\"%Y\", created_at=?), strftime(\"%m-%Y\", created_at=?), strftime(\"%d-%m-%Y\", created_at=?)", new String[]{today, today, today});
        }else{
            cursor = db.rawQuery("select COUNT(id) from PDX where org_id=? group by strftime(\"%Y\", created_at=?), strftime(\"%m-%Y\", created_at=?), strftime(\"%d-%m-%Y\", created_at=?)", new String[]{org_id, today, today, today});
        }
        cursor.moveToFirst();
        if(cursor.moveToFirst())
        {
            do {
                dashboardResults.setTestyear(cursor.getString(1));
                dashboardResults.setTestmonth(cursor.getString(2));
                dashboardResults.setTesttoday(cursor.getString(3));
                arrayList.add(dashboardResults);
               }while (cursor.moveToNext());
        }

        //Query for graphdata
        if(org_id == null) { //one option is to remove strftime to date/year/month function
            cursor = db.rawQuery("select COUNT(id) from PDX where year(created_at)=? group by strftime(\"%m-%Y\", created_at)", new String[]{today});
        }else{
            cursor = db.rawQuery("select COUNT(id) from PDX where org_id=? and year(created_at)=? group by strftime(\"%m-%Y\", created_at)", new String[]{org_id, today});
        }

        cursor.moveToFirst();
        int cnt = 1;
        if(cursor.moveToFirst())
        {
            do {
                switch(cnt){
                    case 1: //January
                        dashboardResults.setJanuary(cursor.getString(cnt));
                        break;
                    case 2: //January
                        dashboardResults.setFebrary(cursor.getString(cnt));
                        break;
                    case 3: //January
                        dashboardResults.setMarch(cursor.getString(cnt));
                        break;
                    case 4: //January
                        dashboardResults.setApril(cursor.getString(cnt));
                        break;
                    case 5: //January
                        dashboardResults.setMay(cursor.getString(cnt));
                        break;
                    case 6: //January
                        dashboardResults.setJune(cursor.getString(cnt));
                        break;
                    case 7: //January
                        dashboardResults.setJuly(cursor.getString(cnt));
                        break;
                    case 8: //January
                        dashboardResults.setAugust(cursor.getString(cnt));
                        break;
                    case 9: //January
                        dashboardResults.setSeptember(cursor.getString(cnt));
                        break;
                    case 10: //January
                        dashboardResults.setOctober(cursor.getString(cnt));
                        break;
                    case 11: //January
                        dashboardResults.setNovember(cursor.getString(cnt));
                        break;
                    case 12: //January
                        dashboardResults.setDecember(cursor.getString(cnt));
                        break;
                }
                arrayList.add(dashboardResults);
            }while (cursor.moveToNext());
        }

        //Query for piedata positive
        if(org_id == null) { //one option is to remove strftime to date/year/month function
            cursor = db.rawQuery("select COUNT(id) from PDX where covid=TRUE and influenzaA=TRUE and influenzaB=TRUE and rhino=TRUE and rsv=TRUE and invalid=FALSE and created_at>=? and created_at<=?", new String[]{to_date, from_date});
        }else{
            cursor = db.rawQuery("select COUNT(id) from PDX where org_id=? and covid=TRUE and influenzaA=TRUE and influenzaB=TRUE and rhino=TRUE and rsv=TRUE and invalid=FALSE and created_at>=? and created_at<=?", new String[]{org_id, to_date, from_date});
        }

        cursor.moveToFirst();
        if(cursor.moveToFirst()) {
            do {
                dashboardResults.setPiedata(cursor.getString(1)); //set pie data positive here
            } while (cursor.moveToNext());
        }

        //Query for piedata negative
        if(org_id == null) { //one option is to remove strftime to date/year/month function
            cursor = db.rawQuery("select COUNT(id) from PDX where invalid=TRUE and error=TRUE and created_at>=? and created_at<=?", new String[]{to_date, from_date});
        }else{
            cursor = db.rawQuery("select COUNT(id) from PDX where org_id=? and invalid=TRUE and error=TRUE and created_at>=? and created_at<=?", new String[]{org_id, to_date, from_date});
        }
        cursor.moveToFirst();
        if(cursor.moveToFirst()) {
            do {
                dashboardResults.setPiedata(cursor.getString(1)); //set pie data no results (error/invalid)
            } while (cursor.moveToNext());
        }

        arrayList.add(dashboardResults);
        return arrayList;
    }

    //Equivalent to Export (/mac_export)
    public ArrayList<?> exportResutsFromLocal(String loginData){
        ArrayList<?> arrayList = new ArrayList<>();
        return arrayList;
    }

    //Equivalent to mac_show from Cloud (/mac_show)
    public ArrayList<?> macShowFromLocal(String loginData){
        ArrayList<?> arrayList = new ArrayList<>();
        return arrayList;
    }

    //Equivalent to mac_show from Cloud (/infectiondata)
    public ArrayList<?> infectionDataFromLocal(String loginData){
        ArrayList<?> arrayList = new ArrayList<>();
        return arrayList;
    }

    //Equivalent to mac_show from Cloud (/image)
    public ArrayList<?> imageFromLocal(String loginData){
        ArrayList<?> arrayList = new ArrayList<>();
        return arrayList;
    }
    //to get data based on two date
    public ArrayList<TestResults>getResultsBasedOnDate(String fromDate,String  toDate,String userId)
    {
        ArrayList<TestResults>testResults= new ArrayList<TestResults>();
        Cursor cursor;
      //  SELECT * FROM `dt_tb` WHERE dt BETWEEN '2005-01-01' AND '2005-12-31'
        SQLiteDatabase db=this.getReadableDatabase();
    //    cursor = db.rawQuery("select COUNT(id) from PDX where org_id=? and invalid=TRUE and error=TRUE and created_at>=? and created_at<=?", new String[]{org_id, to_date, from_date});
      //  Cursor cursor=db.rawQuery("select * from PDX where Date>=? AND Date<=? limit 2, 1",new String[]{toDate,fromDate});
        if(userId.equalsIgnoreCase("0")||TextUtils.isEmpty(userId))
        {
            cursor=db.rawQuery("select * from PDX where Date>=? AND Date<=?",new String[]{fromDate,toDate});

        }else
        {
           cursor=db.rawQuery("select * from PDX where Date>=? AND Date<=? and Login_Data=?",new String[]{fromDate,toDate,userId});

        }
        cursor.moveToFirst();
        if(cursor.moveToFirst())
        {
            do {
                TestResults testResult=new TestResults();
                testResult.setSql_id(cursor.getString(0));
                testResult.setId(cursor.getString(1));
                testResult.setLoginData(cursor.getString(2));
                testResult.setTestResult(cursor.getString(3));
                testResults.add(testResult);
            }while (cursor.moveToNext());
        }
        return testResults;
    }
    public void deleteresult(String id)
    {
        SQLiteDatabase db=this.getWritableDatabase();
        db.delete("PDX", "id" + "= '" + id + "'", null);
  //      db.delete("PDX", "id" + "=" + id, null);
        db.close();
    }


    public ArrayList<TestResults>getAllResults_without_condition(String currentPage,String number_row)
    {
        ArrayList<TestResults> arrayList=new ArrayList<>();
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor=db.rawQuery("select * from PDX limit ? offset ?",new String[] {currentPage,number_row});
        cursor.moveToFirst();
        if(cursor.moveToFirst())
        {
            do {
                TestResults testResults=new TestResults();
                testResults.setSql_id(cursor.getString(0));
                testResults.setId(cursor.getString(1));
                testResults.setLoginData(cursor.getString(2));
                testResults.setTestResult(cursor.getString(3));
                arrayList.add(testResults);
            }while (cursor.moveToNext());
        }
        db.close();
        return arrayList;
    }
    public ArrayList<TestResults>getAllResults_without_condition_noPagging()
    {
        ArrayList<TestResults> arrayList=new ArrayList<>();
        SQLiteDatabase db=this.getReadableDatabase();
        Cursor cursor=db.rawQuery("select * from PDX ",null);
        cursor.moveToFirst();
        if(cursor.moveToFirst())
        {
            do {
                TestResults testResults=new TestResults();
                testResults.setSql_id(cursor.getString(0));

                testResults.setId(cursor.getString(1));
                testResults.setLoginData(cursor.getString(2));
                testResults.setTestResult(cursor.getString(3));
                arrayList.add(testResults);
            }while (cursor.moveToNext());
        }
        db.close();
        return arrayList;
    }
    public TestResults getTestBasedOnId(String id)
    {

        SQLiteDatabase db=this.getReadableDatabase();

        TestResults testResult=new TestResults();
        Cursor cursor=db.rawQuery("select * from PDX where id>=? ",new String[]{id});
        cursor.moveToFirst();
        if(cursor.moveToFirst())
        {
            do {

                testResult.setSql_id(cursor.getString(0));

                testResult.setId(cursor.getString(1));
                testResult.setLoginData(cursor.getString(2));
                testResult.setTestResult(cursor.getString(3));

            }while (cursor.moveToNext());
        }
        db.close();
        return testResult;

    }
}
