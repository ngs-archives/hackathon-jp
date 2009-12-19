package com.example.androidwar;

import java.util.HashMap;

import android.os.AsyncTask;

public class DataPostTask extends AsyncTask<HashMap<String,Object>,Void,Integer> {
  @Override
  protected void onPreExecute(){ 
  }
  
  @Override
  protected Integer doInBackground(HashMap<String, Object>... params) {
    return null;
  }
  
  @Override
  protected void onPostExecute(Integer statusCode){
    
  }
}
