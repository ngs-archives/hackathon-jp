package org.toss.janken;

import android.content.Context;
import android.content.SharedPreferences;

public class Settings {
	final static String PREFS = "prefs";
	private SharedPreferences prefs;

	public Settings(Context context){
		prefs = context.getSharedPreferences(PREFS, 0);
	}

	public void set(String key, String value) {
		SharedPreferences.Editor e = prefs.edit();
		e.putString(key, value);
		e.commit();
	}

	public void setInt(String key, int value) {
		SharedPreferences.Editor e = prefs.edit();
		e.putInt(key, value);
		e.commit();
	}

	public String get(String key) {
		return prefs.getString(key, "");
	}

	public int getInt(String key) {
		return prefs.getInt(key, 0);
	}
}
