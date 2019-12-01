package com.herokuapp.ksi_projektas.arduino;

import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class DataAPI {

    private static final String TAG = "DataAPI";

    public static Matavimas gautiMatavimus(String RestURL) throws Exception
    {
        Matavimas matavimai = new Matavimas();
        String response= WebAPI.gautiDuomenis(RestURL);
        if(response.length() > 1)
        {
            response = response.substring(1,response.length()-1);
            Gson gson;
            gson = new Gson();

            Log.d("Response1",response);
            Type type = new TypeToken<Matavimas>(){}.getType();
            matavimai = gson.fromJson(response, type);
            Log.d("Response2",matavimai.toString());
        }
        return matavimai;
    }
}
