package com.herokuapp.ksi_projektas.arduino;

import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "MainActivity";
    private Button Button_Refresh;
    private Button Button_new_ribos;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        gautiDuomenis();
        setContentView(R.layout.activity_main);
        Button_Refresh = findViewById(R.id.button_refresh);
        Button_Refresh.setOnClickListener(this);

        Button_new_ribos = findViewById(R.id.button_new_ribos);
        Button_new_ribos.setOnClickListener(this);
    }


    private void gautiDuomenis() {

        new MainActivity.gautiDuomenisTask().execute(Tools.RestURL, null, null);

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.button_refresh: {
                gautiDuomenis();
            }
            case R.id.button_new_ribos: {
                Intent myIntent = new Intent(this, RibosActivity.class);
                startActivity(myIntent);
            }
        }
    }

    public class gautiDuomenisTask extends AsyncTask<String, Void, Matavimas> {
        //private static final String TAG = "gautiUzrasusTask";
        ProgressDialog actionProgressDialog = new ProgressDialog(MainActivity.this);

        @Override
        protected void onPreExecute() {
            actionProgressDialog.setMessage("Gaunami matavimai");
            actionProgressDialog.show();
            actionProgressDialog.setCancelable(false);
            super.onPreExecute();
        }

        protected Matavimas doInBackground(String... str_param) {
            String RestURL = str_param[0];
            Matavimas matavimai = new Matavimas();
            try {
                matavimai = DataAPI.gautiMatavimus(RestURL);
            } catch (Exception ex) {
                Log.e(TAG, ex.toString());
            }
            return matavimai;
        }

        protected void onProgressUpdate(Void... progress) {
        }

        protected void onPostExecute(Matavimas result) {
            actionProgressDialog.cancel();
            rodytiMatavimus(result);
        }


        private void rodytiMatavimus(Matavimas matavimas) {

            TextView text_temp_value = findViewById(R.id.text_temp_value);
            TextView text_pressure_value = findViewById(R.id.text_pressure_value);
            TextView text_humidity_value = findViewById(R.id.text_humidity_value);
            TextView text_light_value = findViewById(R.id.text_light_value);
            TextView text_ribos_value = findViewById(R.id.text_ribos_value);
            TextView text_refresh_time = findViewById(R.id.text_refresh_time);
            Button spalva = findViewById(R.id.button_spalva);

            text_temp_value.setText("" + matavimas.Temperatura2);
            Log.d("test","temp:" + matavimas.Temperatura2);
            text_pressure_value.setText("" + matavimas.Slegis);
            text_humidity_value.setText("" + matavimas.Dregme);
            text_light_value.setText("" + matavimas.Sviesa);
            text_ribos_value.setText("Nuo " + matavimas.Min_Temp + " iki " + matavimas.Max_Temp);

            Date now = Calendar.getInstance().getTime();
            text_refresh_time.setText("Atnaujinimo laikas: " + now.toString());

            if(matavimas.Temperatura2 < matavimas.Min_Temp)
            {
                spalva.setBackgroundColor(Color.parseColor("#0000FF"));
            }
            else if(matavimas.Temperatura2 > matavimas.Max_Temp)
            {
                spalva.setBackgroundColor(Color.parseColor("#FF0000"));
            }
            else
            {
                spalva.setBackgroundColor(Color.parseColor("#00FF00"));
            }
        }
    }
}
