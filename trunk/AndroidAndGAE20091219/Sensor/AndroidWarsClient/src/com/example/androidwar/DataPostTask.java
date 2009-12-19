package com.example.androidwar;

import java.util.HashMap;

import com.example.androidwar.util.Util;

import android.os.AsyncTask;
import android.util.Log;

public class DataPostTask extends AsyncTask<HashMap<String,Object>,Void,Integer> {
  @Override
  protected void onPreExecute(){ 
  }
  
  @Override
  protected Integer doInBackground(HashMap<String, Object>... params) {
    Log.d("Shaker","");
    String name = (String)params[0].get("name");
    Integer action = (Integer)params[0].get("action");
    HashMap<String,Object> value = (HashMap<String,Object>)params[0].get("value"); 
    Integer x = (Integer)value.get("x");
    Integer y = (Integer)value.get("y");
    Integer power = (Integer)value.get("power");
    Util.push(name,action,x,y,power);
    return null;
  }
  
  @Override
  protected void onPostExecute(Integer statusCode){
    
  }
}
