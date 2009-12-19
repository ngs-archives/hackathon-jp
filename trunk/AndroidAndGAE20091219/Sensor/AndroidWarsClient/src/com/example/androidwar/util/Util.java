package com.example.androidwar.util;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import org.xmlpull.v1.XmlPullParser;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.util.Xml;

public class Util {
	public final static String BR = System.getProperty("line.separator");

	public static byte[] getByteArrayFromURL(String strUrl) {
		byte[] line = new byte[1024];
		byte[] result = null;
		HttpURLConnection con = null;
		InputStream in = null;
		ByteArrayOutputStream out = null;
		int size = 0;
		try {
			// HTTP接続のオープン
			URL url = new URL(strUrl);
			con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			con.connect();
			in = con.getInputStream();

			// バイト配列の読み込み
			out = new ByteArrayOutputStream();
			while (true) {
				size = in.read(line);
				if (size <= 0) {
					break;
				}
				out.write(line, 0, size);
			}
			result = out.toByteArray();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (con != null)
					con.disconnect();
				if (in != null)
					in.close();
				if (out != null)
					out.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return result;

	}

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
	
	public static void generateMoveData(int action, String name, int x, int y){
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("action", action);
		data.put("name", name);
		HashMap<String, Object> value = new HashMap<String, Object>(); 
		value.put("x", x);
		value.put("y", y);
		data.put("value", value);
	}

	public static void generateAtackData(int action, int name, int power){
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("action", action);
		data.put("name", name);
		HashMap<String, Object> value = new HashMap<String, Object>(); 
		value.put("power", power);
		data.put("value", value);
	}

}
