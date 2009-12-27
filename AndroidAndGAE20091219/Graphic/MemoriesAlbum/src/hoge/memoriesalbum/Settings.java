package hoge.memoriesalbum;

import android.content.Context;
import android.os.Bundle;
import android.preference.PreferenceActivity;
import android.preference.PreferenceManager;

public class Settings extends PreferenceActivity {
	
	private static final String OPT_USERNAME = "edt_useruame";
	private static final String OPT_USERNAME_DEF = "username";

	private static final String OPT_PASSWORD = "edt_password";
	private static final String OPT_PASSWORD_DEF = "password";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		addPreferencesFromResource(R.xml.settings);
	}
   
	public static String getUsername(Context context) {
		return PreferenceManager.getDefaultSharedPreferences(context)
			.getString(OPT_USERNAME, OPT_USERNAME_DEF);
	}
	

	public static String getPassword(Context context) {
		return PreferenceManager.getDefaultSharedPreferences(context)
			.getString(OPT_PASSWORD, OPT_PASSWORD_DEF);
	}

}
