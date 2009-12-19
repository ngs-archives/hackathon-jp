package com.example.androidwar;

import java.util.HashMap;

import android.os.AsyncTask;
import android.util.Log;

public class DataPostTask extends AsyncTask<HashMap<String,Object>,Void,Integer> {
  @Override
  protected void onPreExecute(){ 
  }
  
  @Override
  protected Integer doInBackground(HashMap<String, Object>... params) {
    Log.d("Shaker","");
    return null;
  }
  
  @Override
  protected void onPostExecute(Integer statusCode){
    
  }
}
