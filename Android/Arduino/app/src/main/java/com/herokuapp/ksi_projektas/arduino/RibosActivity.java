package com.herokuapp.ksi_projektas.arduino;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import java.util.Comparator;


import java.util.Calendar;
import java.util.Date;

public class RibosActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "RibosActivity";
    private Button Button_atnaujinti_ribas;
    private Button Button_atgal;
    private Spinner spin_nuo;
    private Spinner spin_iki;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_ribos);

        gautiDuomenis2();
        spin_nuo = findViewById(R.id.spinner_nuo);
        spin_iki = findViewById(R.id.spinner_iki);

        Integer[] items = new Integer[101];
        for ( int i = 0; i<= 100; i++)
        {
            items[100-i] = i - 20;
        }
        ArrayAdapter<Integer> adapter = new ArrayAdapter<Integer>(this,android.R.layout.simple_spinner_item, items);
        spin_nuo.setAdapter(adapter);
        spin_iki.setAdapter(adapter);

        Button_atnaujinti_ribas = findViewById(R.id.button_atnaujinti_ribas);
        Button_atnaujinti_ribas.setOnClickListener(this);

        Button_atgal = findViewById(R.id.button_back);
        Button_atgal.setOnClickListener(this);
    }


    private void gautiDuomenis2() {

        new RibosActivity.gautiDuomenisTask().execute(Tools.RestURL, null, null);

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.button_atnaujinti_ribas: {
                atnaujintiRibas();
            }
            case R.id.button_back: {
                Intent myIntent = new Intent(this, MainActivity.class);
                startActivity(myIntent);
            }
        }
    }

    private void atnaujintiRibas() {
        new RibosActivity.atnaujintiRibasTask().execute(Tools.NaujintiURL, null, null);
    }


    public class gautiDuomenisTask extends AsyncTask<String, Void, Matavimas> {
        //private static final String TAG = "gautiUzrasusTask";
        ProgressDialog actionProgressDialog = new ProgressDialog(RibosActivity.this);

        @Override
        protected void onPreExecute() {
            actionProgressDialog.setMessage("Gaunamos ribos");
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

            //EditText editText_riba_nuo = findViewById(R.id.editText_riba_nuo);

            //EditText editText_riba_iki = findViewById(R.id.editText_riba_iki);

            //editText_riba_nuo.setText("" + matavimas.Min_Temp);
            //editText_riba_iki.setText("" + matavimas.Max_Temp);
            int nuo = 80 - (int) matavimas.Min_Temp;
            int iki = 80 - (int) matavimas.Max_Temp;
            spin_nuo.setSelection(nuo);
            spin_iki.setSelection(iki);

            Log.d("ribos","ribos:" + matavimas.Min_Temp + " - " + matavimas.Max_Temp);

        }
    }

    public class atnaujintiRibasTask extends AsyncTask<String, Void, Matavimas> {
        //private static final String TAG = "gautiUzrasusTask";
        ProgressDialog actionProgressDialog = new ProgressDialog(RibosActivity.this);

        @Override
        protected void onPreExecute() {
            actionProgressDialog.setMessage("Atnaujinamos ribos");
            actionProgressDialog.show();
            actionProgressDialog.setCancelable(false);
            super.onPreExecute();
        }

        protected Matavimas doInBackground(String... str_param) {
            String RestURL = str_param[0];
            Matavimas matavimai = new Matavimas();
            try {
                //EditText editText_riba_nuo = findViewById(R.id.editText_riba_nuo);
                //EditText editText_riba_iki = findViewById(R.id.editText_riba_iki);
                //String nuo = "" + editText_riba_nuo.getText();
                //String iki = "" + editText_riba_iki.getText();


                String nuo = spin_nuo.getSelectedItem().toString();
                String iki = spin_iki.getSelectedItem().toString();


                if( nuo.compareTo(iki) <= 0) {
                    DataAPI.atnaujintiRibas(RestURL, nuo, iki);
                }
                else
                {
                    DataAPI.atnaujintiRibas(RestURL, iki, nuo);
                }


            } catch (Exception ex) {
                Log.e(TAG, ex.toString());
            }
            return matavimai;
        }

        protected void onProgressUpdate(Void... progress) {
        }

        protected void onPostExecute(Matavimas result) {
            actionProgressDialog.cancel();
            gautiDuomenis2();
            alertPavyko();
        }

    }

    private void alertPavyko()
    {
        AlertDialog alertDialog = new AlertDialog.Builder(RibosActivity.this).create();
        alertDialog.setTitle("Atnaujinimas");
        alertDialog.setMessage("Ribos buvo atnaujintos");
        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                });
        alertDialog.show();
    }


}
