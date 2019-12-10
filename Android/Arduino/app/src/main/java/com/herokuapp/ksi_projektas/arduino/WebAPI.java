package com.herokuapp.ksi_projektas.arduino;

import android.util.Log;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import java.io.IOException;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import okhttp3.MediaType;

public class WebAPI {

    private static final String TAG = "WebAPI";

    public static String gautiDuomenis(String url)throws  Exception {
        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection)obj.openConnection();
        con.setRequestMethod("GET");
        int responseCode = con.getResponseCode();
        StringBuffer response = new StringBuffer();
        System.out.println("Response Code :: " + responseCode);
        if (responseCode == HttpURLConnection.HTTP_OK) { //connection ok
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            //StringBuffer response = new StringBuffer();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
        }
        return response.toString();
    }

    public static void atnaujintiRibas(String url, String Nuo, String Iki)throws  Exception {
        String data = "{\"nuo\":\""+Nuo+"\", \"iki\":\""+Iki+"\"}"; //data to post
        //String data = "pav:"+pav+",kat1:"+kat+",tekstas:"+tekstas; //data to post
        Log.d("JSON", data);

        MediaType MEDIA_TYPE = MediaType.parse("application/json");

        OkHttpClient client = new OkHttpClient();
        RequestBody body = RequestBody.create(MEDIA_TYPE, data);

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .header("Content-Type", "application/json")
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                String mMessage = e.getMessage().toString();
                Log.w("failure Response", mMessage);
                //call.cancel();
            }
            @Override
            public void onResponse(Call call, Response response) throws IOException {

                String mMessage = response.body().string();
                Log.e(TAG, mMessage);

            }
        });



    }


}
