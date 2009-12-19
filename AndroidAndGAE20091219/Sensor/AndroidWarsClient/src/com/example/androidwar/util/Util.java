package com.example.androidwar.util;

import java.util.HashMap;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;

public class Util {
  public final static String BR = System.getProperty("line.separator");

  // ダイアログの表示
  public static void showOKDialog(final Activity activity, String title,
          String text) {
      AlertDialog.Builder ad = new AlertDialog.Builder(activity);
      ad.setTitle(title);
      ad.setMessage(text);
      ad.setPositiveButton("OK", new DialogInterface.OnClickListener() {
          public void onClick(DialogInterface dialog, int whichButton) {
              activity.setResult(Activity.RESULT_OK);
          }
      });
      ad.create();
      ad.show();
  }
  
  public static HashMap<String, Object> generateMoveData(int action, String name, int x, int y){
      HashMap<String, Object> data = new HashMap<String, Object>();
      data.put("action", action);
      data.put("name", name);
      HashMap<String, Object> value = new HashMap<String, Object>(); 
      value.put("x", x);
      value.put("y", y);
      data.put("value", value);
      return data;
  }

  public static HashMap<String, Object> generateAtackData(int action, String name, int pawah){
      HashMap<String, Object> data = new HashMap<String, Object>();
      data.put("action", action);
      data.put("name", name);
      HashMap<String, Object> value = new HashMap<String, Object>(); 
      value.put("pawah", pawah);
      data.put("value", value);
      return data;
  }
	
	@SuppressWarnings("unchecked")
	public static String showData(HashMap<String, Object> data){
		StringBuilder sb = new StringBuilder(); 
		
		sb.append("name:" + data.get("name"));
		sb.append(" ");
		sb.append("action:" + data.get("action"));
		sb.append(" ");
		HashMap<String, Object> value = (HashMap<String, Object>) data.get("value");
		sb.append("value[" + " x:" + value.get("x") + " y:" + value.get("y") + "]");
		
		return sb.toString();
	}
}