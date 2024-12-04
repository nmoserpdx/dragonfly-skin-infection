package com.protondx.dragonfly;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.auth0.android.Auth0;
import com.auth0.android.authentication.AuthenticationAPIClient;
import com.auth0.android.authentication.AuthenticationException;
import com.auth0.android.callback.Callback;

import com.auth0.android.provider.WebAuthProvider;
import com.auth0.android.result.Credentials;
import com.auth0.android.result.UserProfile;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;



import com.protondx.dragonfly.Services.Constants;
import com.protondx.dragonfly.Services.Get_Header_AsyncTask;
import com.protondx.dragonfly.Services.Json_Header_Asynctask;
import com.protondx.dragonfly.aialgorithm.Utils;
import com.protondx.dragonfly.datamodels.Users;


import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static com.auth0.android.provider.WebAuthProvider.login;
import static com.protondx.dragonfly.Services.Constants.MyPREFERENCES;

public class loginAuth extends AppCompatActivity {
    public static final String EXTRA_CLEAR_CREDENTIALS = "com.auth0.CLEAR_CREDENTIALS";
    public static final String EXTRA_ACCESS_TOKEN = "com.auth0.ACCESS_TOKEN";
    public static Auth0 auth0;
    private String TAG="loginAuth";
    private int version_number;

    private Object UserProfile;
    private Button Login_btn;
    ProgressDialog progressBar;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_authlogin);
        Login_btn=findViewById(R.id.btn);
        auth0 = new Auth0(getResources().getString(R.string.com_auth0_client_id),getResources().getString(R.string.com_auth0_domain));
        progressBar=new ProgressDialog(loginAuth.this);
        progressBar.setMessage("Please wait");

        auth0 = new Auth0(this);
        Login_btn.setOnClickListener(new View.OnClickListener() {
            @Override

            public void onClick(View view) {

                launchAuthO();
//               logout(auth0)
//                        .withScheme("demo")
//                        .start(loginAuth.this, new Callback<Void, AuthenticationException>() {
//                            @Override
//                            public void onSuccess(@Nullable Void payload) {
//                                launchAuthO();
//
//                            }
//
//                            @Override
//                            public void onFailure(@NonNull AuthenticationException error) {
//                                //Log out canceled, keep the user logged in
//                                Log.e("print---", error.toString());
//
//                            }
//                        });


            }
        });

        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        String loginData = prefs.getString("CurrentUser","");
        Users users = new Users();
        Gson gson = new Gson();
        if (!TextUtils.isEmpty(loginData)) {
            users = gson.fromJson(loginData,
                    new TypeToken<Users>() {
                    }.getType());

            //   data=users.getHeaterData();
        }
        Log.e("jsonAtInitial",loginData);
        if(!users.isLogin())
        {
            launchAuthO();
        }else
        {
            runOnUiThread(() -> {
                if((progressBar != null) && progressBar.isShowing()&&!loginAuth.this.isFinishing())
                progressBar.show();
            });
         // checkInternetConnectivity();
            progressBar.dismiss();
            Intent intent = new Intent(loginAuth.this, MainActivity.class);
           // intent.putExtra("data", version_number);
            startActivity(intent);
            finish();

        }

    }
//auth0 id is new -> add shared preference (new)
    //auth0 is old(compare from shared pref) -> update the information in shared pref\


//    private boolean checkIsLogin(String loginData) {
//        boolean isLogin=false;
//        if(loginData.equalsIgnoreCase(""))
//        {
//            isLogin= false;
//
//        }else
//        {
//            try {
//                JSONObject jsonObject=new JSONObject(loginData);
//                if(jsonObject.has("LoginData")&&jsonObject.get("LoginData")instanceof JSONObject)
//                {
//                    JSONObject loginObject=jsonObject.getJSONObject("LoginData");
//                    isLogin=loginObject.getBoolean("isLogin");
//                }
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
//        }
//        return isLogin;
//    }

    private void launchAuthO() {

        Login_btn.setText("Logging in");
        login(auth0)
                //.withScope("openid email profile offline_access")
                .withScheme("demo")
                .withAudience(String.format("https://%s/userinfo", getString(R.string.com_auth0_domain)))
                .start(this, new Callback<Credentials, AuthenticationException>() {

                    @Override
                    public void onFailure(@NonNull final AuthenticationException exception) {
                        Toast.makeText(getApplicationContext(), "Error: " + exception.getMessage(), Toast.LENGTH_SHORT).show();
                      //  Log.e("data",exception.getMessage());
                         Login_btn.setText("Login");
                         launchAuthO();

                    }

                    @Override
                    public void onSuccess(@Nullable final Credentials credentials) {
                        Log.e("data",credentials.getIdToken()+"----"+credentials.getAccessToken());
                        //   getLoginInfo(credentials);
//                        UsersAPIClient usersAPIClient= new UsersAPIClient(auth0,credentials.getAccessToken());
//                        usersAPIClient.getClientId();
                        runOnUiThread(() -> {
                            progressBar.show();
                        });
                        AuthenticationAPIClient client = new AuthenticationAPIClient(auth0);
                        client.userInfo(credentials.getAccessToken()).start(new Callback<com.auth0.android.result.UserProfile,AuthenticationException>()
                        {
                            @Override
                            public void onSuccess(com.auth0.android.result.UserProfile userProfile) {
//                                Log.e("tag", userProfile.getEmail());
//                                Log.e("name", userProfile.getName());
                                getLoginInfo(credentials,userProfile);
                            }

                            public void onFailure(@NonNull final AuthenticationException exception) {
                                Toast.makeText(getApplicationContext(), "Error: " + exception.getMessage(), Toast.LENGTH_SHORT).show();
                                Log.e("data",exception.getMessage());
                                Login_btn.setText("Login");
                            }
                        });

                    }
                });
    }
    private void checkInternetConnectivity() {
        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        version_number = prefs.getInt("currentVersion",57);
        SharedPreferences.Editor edit = prefs.edit();

        ConnectivityManager connectivityManager = (ConnectivityManager)
                getSystemService(getApplicationContext().CONNECTIVITY_SERVICE);
        if ( connectivityManager.getActiveNetworkInfo() != null && connectivityManager.
                getActiveNetworkInfo().isConnected() ) {
            new Get_Header_AsyncTask() {
                @Override
                public void onPostExecute(String result) {
                    if (getResponseCode() == 200 || getResponseCode() == 201) {
                        Log.e("<==== Result", "==========>" + result);
                        try {
                            JSONObject jsonObject=new JSONObject(result);
                            if(jsonObject.has("version"))
                            {
                                version_number=Integer.parseInt(jsonObject.getString("version"));
                            }
                            if (prefs.contains("currentVersion")) {
                                edit.remove("currentVersion");

                            }

                            edit.putInt("currentVersion",version_number);
                            edit.apply();
                            edit.commit();
                            runOnUiThread(() -> {
                                if ((progressBar != null) && progressBar.isShowing()&&!loginAuth.this.isFinishing()) {
                                    progressBar.dismiss();}

                            });
                            Intent intent = new Intent(loginAuth.this, MainActivity.class);
                            intent.putExtra("data", version_number);
                            startActivity(intent);
                            finish();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }


                    } else {
                        Log.e("error","error");
                    }

                }
            }.execute(Constants.get_version_number, "X-AuthorityToken",Constants.auth_token);
        }
        else
        {
            progressBar.dismiss();
            Intent intent = new Intent(loginAuth.this, MainActivity.class);
            intent.putExtra("data", version_number);
            startActivity(intent);
            finish();
        }


//        try {
//            JsonArrayRequest request_get_employees_attendance = new JsonArrayRequest(Request.Method.GET, Constants.get_version_number, null,
//                    response -> {
//                Log.e("xchbsgd0",response.toString());
////                        AttendanceModel[] usersAttendanceArray = g.fromJson(response.toString(), AttendanceModel[].class);
////                        List<AttendanceModel> userAttendanceList = Arrays.asList(usersAttendanceArray);
////                        callback.after_attendance_fetch_finished(true, userAttendanceList, 200);
//
//                    }, error -> {
//                if (error != null && error.networkResponse != null) {
//                    try {
////                        ApiErrorModel errorModel = g.fromJson(new String(error.networkResponse.data, StandardCharsets.UTF_8), ApiErrorModel.class);
////                        errorModel.setStatusCode(error.networkResponse.statusCode);
////                        callback.onFailure(errorModel);
//                    } catch (Exception ex) {
//                     ///   callback.onFailure(new ApiErrorModel("Request failed", error.networkResponse.statusCode));
//                    }
//
////                    ApiErrorModel errorModel = new ApiErrorModel()
////                    callback.after_otp_verification_finished(false, error.networkResponse.statusCode);
//                } else {
//                //    callback.onFailure(new ApiErrorModel("No Internet", 0));
//                }
//
//            }) {
//                @Override
//                public Map<String, String> getHeaders() {
//                    Map<String, String> headers = new HashMap<>();
//                    headers.put("X-AuthorityToken", Constants.auth_token);
//                 //   headers.put("X-AccessToken", "ddd");
//                    return headers;
//                }
//            };
//            NetComm.getInstance(getApplicationContext()).addToRequestQueue(request_get_employees_attendance);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }

    }
    private String createJson2() {
        JSONObject jsonObject=new JSONObject();
        try {
            jsonObject.put("build_number",38);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }

    private void getLoginInfo(Credentials credentials,UserProfile userProfile) {
        ConnectivityManager connectivityManager = (ConnectivityManager)
                getSystemService(getApplicationContext().CONNECTIVITY_SERVICE);
        if ( connectivityManager.getActiveNetworkInfo() != null && connectivityManager.
                getActiveNetworkInfo().isConnected() ) {
            new Json_Header_Asynctask() {
                @Override
                public void onPostExecute(String result) {
                    if (getResponseCode() == 200 || getResponseCode() == 201) {
                        Log.e("<==== Result", "==========>" + result);

                        SharedPreferences prefs = getApplicationContext().
                                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
                        SharedPreferences.Editor edit = prefs.edit();
                       // edit.clear();


                        String json = createJson(result, userProfile,credentials);
                        JSONObject jsonObject = null;
                        try {
                            jsonObject = new JSONObject(result);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        Users user = new Users(Utils.hasString("org_id", jsonObject), userProfile.getName(), userProfile.getEmail(), Utils.hasString("id", jsonObject), Utils.hasInt("no_of_test_runs", jsonObject), Utils.hasString("permission_group", jsonObject), Utils.hasString("test_runs", jsonObject),json,true,credentials.getIdToken());


                        Gson gson=new Gson();
                        if (prefs.contains("CurrentUser")) {
                         //   edit.remove("CurrentUser");
                            String json1 = prefs.getString("CurrentUser","");
                            Users Oldusers = new Users();
                            String data="";
                            Gson gson1 = new Gson();
                            if (!TextUtils.isEmpty(json1)) {
                                Oldusers = gson1.fromJson(json1,
                                        new TypeToken<Users>() {
                                        }.getType());
                                user.setLogin(true);

                                user.setHeaterData(repalceHeaterData(Oldusers.getHeaterData(),json));
                                //   data=users.getHeaterData();
                            }


                        }
                        if (prefs.contains("loginData")) {
                            edit.remove("loginData");

                        }
                        String temp=gson.toJson(user);
                        edit.putString("CurrentUser",temp);
                        edit.putString("loginData", json);
                        LinkedHashMap<String,Users>userMap=Utils.getUserList(loginAuth.this);
                        userMap.put(user.getId(),user);
                        //        userMap.replace(users.getId(),users);
                        if (prefs.contains("users")) {
                            edit.remove("users");

                        }
                        edit.putString("users", gson.toJson(userMap));
                        edit.apply();
                        edit.commit();
                        Log.e("login_data_saved", result);
                   //     checkInternetConnectivity();

                        progressBar.dismiss();
                        Intent intent = new Intent(loginAuth.this, MainActivity.class);
                    //    intent.putExtra("data", version_number);
                        startActivity(intent);
                        finish();



//                        if(!user.getOrgId().equalsIgnoreCase("null"))
//                        getUsers(result, intent,userProfile);
//                        else
//                        {
//                            startActivity(intent);
//                           finish();
//                        }

                    } else {
                        progressBar.dismiss();
                        logoutCall();
                        Toast.makeText(getApplicationContext(),"User information not exist",Toast.LENGTH_SHORT).show();
                    }

                }
            }.execute(Constants.auth0_login, "", createLoginJson(credentials,userProfile.getEmail()));
        }
        else
        {
            Toast.makeText(getApplicationContext(),"No Internet",Toast.LENGTH_SHORT).show();
        }
    }

    private String repalceHeaterData(String heaterData, String s) {
        try {
            JSONObject jsonObject=new JSONObject(heaterData);
            if (jsonObject.has("LoginInfo")&&jsonObject.get("LoginInfo")instanceof JSONObject)
            {

                {
                    JSONObject jsonObject1=new JSONObject(s);
                    JSONObject jsonObject2=jsonObject1.getJSONObject("LoginInfo");
                    jsonObject.remove("LoginInfo");
                    jsonObject.put("LoginInfo",jsonObject2);
                    s=jsonObject.toString();
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return s;
    }

//    private void getUsers(String res,Intent intent,UserProfile  userProfile) {
//        ConnectivityManager connectivityManager = (ConnectivityManager)
//                getSystemService(getApplicationContext().CONNECTIVITY_SERVICE);
//        if ( connectivityManager.getActiveNetworkInfo() != null && connectivityManager.
//                getActiveNetworkInfo().isConnected() ) {
//            new Json_Header_Asynctask() {
//                @Override
//                public void onPostExecute(String result) {
//                    if (getResponseCode() == 200 || getResponseCode() == 201) {
//                        Log.e("<==== Result", "==========>" + result);
//                        saveUsers(result);
//
//                        progressBar.dismiss();
//
//
//                        startActivity(intent);
//                        finish();
//
//
//
//
////                        Intent intent=new Intent(loginAuth.this,MainActivity.class);
////                        intent.putExtra("data",json);
////                        startActivity(intent);
////                        finish();
//
//
//                    } else {
//                        progressBar.dismiss();
//                        logoutCall();
//                        Log.e("<==== Result", "==========>" + result);
//                        Toast.makeText(getApplicationContext(),result,Toast.LENGTH_SHORT).show();
//                    }
//
//                }
//            }.execute(Constants.get_users,userProfile.getId() , createLoginJson1(res));
//        }
//        else
//        {
//            Toast.makeText(getApplicationContext(),"No Internet",Toast.LENGTH_SHORT).show();
//        }
//
////        Retrofit retrofit = new Retrofit.Builder()
////                .baseUrl(Constants.Base_Url)
////                .addConverterFactory(GsonConverterFactory.create())
////                .build();
////        RetrofitInterface     retrofitInterface = retrofit.create(RetrofitInterface.class);
////        RequestBody id = RequestBody.create(MediaType.parse("text/plain"),"62061a54bd2ebb950a665e7f");
////        Call<String> call =
////                retrofitInterface.uploadImage("auth0|6206276602e8150070f3b8a6","62061a54bd2ebb950a665e7f");
//////
//////            Call<Response> call = retrofitInterface.uploadImage(id,body);
////        call.enqueue(new retrofit2.Callback<String>() {
////            @Override
////            public void onResponse(Call<String> call, retrofit2.Response<String> response) {
////                Log.e("resposnse", String.valueOf(call));
////            }
////
////            @Override
////            public void onFailure(Call<String> call, Throwable t) {
////                Log.d(TAG, "onFailure: "+t.getLocalizedMessage());
////            }
////        });
//    }

//    private void saveUsers(String result) {
//        ArrayList<Users>users_array=new ArrayList<>();
//        LinkedHashMap<String,Users> userMap = new LinkedHashMap<String,Users>();
//
//        try {
//            JSONArray jsonArray=new JSONArray(result);
//            for (int i=0;i<jsonArray.length();i++)
//            {
//                JSONObject jsonObject=jsonArray.getJSONObject(i);
//                Users users=new Users(Utils.hasString("org_id",jsonObject),Utils.hasString("name",jsonObject),Utils.hasString("email",jsonObject),Utils.hasString("id",jsonObject),Utils.hasInt("no_of_test_runs",jsonObject),Utils.hasString("permission_group",jsonObject),Utils.hasString("test_runs",jsonObject), createJson1(jsonObject.toString()),false);
//                userMap.put(Utils.hasString("id",jsonObject),users);
//            //    users_array.add(users);
//              }
//
//
//
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }
//        SharedPreferences prefs = getApplicationContext().
//                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
//        SharedPreferences.Editor edit = prefs.edit();
//
//        if (prefs.contains("users")) {
//            edit.remove("users");
//
//        }
//        Gson gson=new Gson();
//        edit.putString("users", gson.toJson(userMap));
//        edit.putString("users_raw", result);
//        edit.apply();
//        edit.commit();
//    }

//    private String createLoginJson1(String result) {
//        JSONObject jsonObject1 = null;
//        JSONObject jsonObject=new JSONObject();
//        try {
//          jsonObject1=new JSONObject(result);
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }
//       if(jsonObject1!=null)
//       {
//
//        try {
//            //  jsonObject.put("login_id",email);
//            jsonObject.put("org_id",jsonObject1.has("org_id")?(jsonObject1.get("org_id")):"");
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }}
//        return jsonObject.toString();
//    }

    private String createLoginJson(Credentials credentials,String email) {
        JSONObject jsonObject=new JSONObject();
        try {
            //  jsonObject.put("login_id",email);
            jsonObject.put("auth0_access_token",credentials.getIdToken());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }

    private String createJson(String result,UserProfile userProfile,Credentials credentials) {
        JSONObject jsonObject=new JSONObject();
        JSONObject loginObject=new JSONObject();
        JSONObject userObject=new JSONObject();
        try {

            JSONObject jsonObject1=new JSONObject(result);
            jsonObject1.put("name",userProfile.getName());
            jsonObject1.put("email",userProfile.getEmail());
            jsonObject1.put("mac_address",getMacAddr());
            jsonObject1.remove("auth0_access_token");
            jsonObject1.put("auth0_access_token",credentials.getIdToken());

            loginObject.put("isLogin",true);

            jsonObject.put("LoginData",loginObject);
            jsonObject.put("LoginInfo",jsonObject1);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.e("stringJson",jsonObject.toString());
        return jsonObject.toString();
    }

    private int getCurrentBuildVersion() {
        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        int num = prefs.getInt("currentVersion",55);
        return num;
    }

    public void logoutCall()
    {
        SharedPreferences prefs = getApplicationContext().
                getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
        String loginData = prefs.getString("CurrentUser","");
        if(loginData != null) {
            if (loginData.length() > 0) {
                try {
                    JSONObject jsonObject = new JSONObject(loginData);
                    String heaterData = jsonObject.getString("heaterData");
                    if (heaterData != null && heaterData.length() > 0) {
                        JSONObject heaterObj = new JSONObject(heaterData);
                        if (heaterObj != null) {
                            JSONObject loginInfo = heaterObj.getJSONObject("LoginInfo");
                            if (loginInfo != null) {
                                String authToken = loginInfo.getString("auth0_access_token");
                                ExecutorService executor = Executors.newSingleThreadExecutor();
                                Handler handler_task = new Handler(Looper.getMainLooper());
                                SharedPreferences.Editor edit = prefs.edit();
                                executor.execute(() -> {
                                    InputStream is = null;
                                    String contentAsString="";
                                    int responseCode;
                                    try {
                                        URL url = new URL(Constants.auth0logout);
                                        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                                        conn.setReadTimeout(50000 /* milliseconds */);
                                        conn.setConnectTimeout(55000 /* milliseconds */);
                                        conn.setRequestMethod("POST");
                                        conn.setRequestProperty("X-AuthorityToken",Constants.auth_token);
                                        conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                                        conn.setRequestProperty("X-AccessToken",authToken);
                                        conn.connect();
                                        responseCode = conn.getResponseCode();
                                        if(responseCode == 200){
                                            is = conn.getInputStream();
                                        }else{
                                            is = conn.getErrorStream();
                                        }

                                        contentAsString = Constants.convertStreamToString(is);

                                        Log.e("Response Code","---->"+responseCode);
                                        if (prefs.contains("CurrentUser")) {
                                            edit.remove("CurrentUser");
                                        }
                                        JSONObject js = new JSONObject(contentAsString);
                                        edit.apply();
                                        edit.commit();


                                        WebAuthProvider.logout(auth0).withScheme("demo").start(loginAuth.this, new Callback<Void, AuthenticationException>() {
                                            @Override
                                            public void onSuccess(Void unused) {
                                                SharedPreferences prefs = getApplicationContext().getApplicationContext().getSharedPreferences(MyPREFERENCES, Activity.MODE_PRIVATE);
                                                SharedPreferences.Editor edit = prefs.edit();
                                                edit.clear();
                                                edit.apply();
                                            }
                                            @Override
                                            public void onFailure(@NotNull AuthenticationException e) {
                                            }
                                        });

                                    } catch (ProtocolException e) {
                                        Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                    } catch (MalformedURLException e) {
                                        Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                    } catch (IOException e) {
                                        Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                    } catch (JSONException e) {
                                        Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                    } finally {
                                        if (is != null) {
                                            try {
                                                is.close();
                                            } catch (IOException e) {
                                                Log.e("PDXEXCEPTION","---->"+e.getMessage());
                                            }
                                        }
                                    }
                                    handler_task.post(() -> {
                                        //UI Thread work here
                                        Log.e("test", "test");
                                    });
                                });

                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        Log.e("logout","iscalled");
    }
    public String getMacAddr()  {
        String deviceId = Settings.Secure.getString(
                getApplicationContext().getContentResolver(),
                Settings.Secure.ANDROID_ID);
        Log.e("android_id",deviceId);
        return deviceId;
    }
}
