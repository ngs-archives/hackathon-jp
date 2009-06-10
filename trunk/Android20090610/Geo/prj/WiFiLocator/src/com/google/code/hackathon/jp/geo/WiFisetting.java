package com.google.code.hackathon.jp.geo;

import java.util.List;

import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

public class WiFisetting extends Activity {


	private Menu myMenu;
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.setting);
		ArrayAdapter<String> Hadapter = new ArrayAdapter<String>(this,
				android.R.layout.simple_spinner_item);
		Hadapter.setDropDownViewResource(android.R.layout.simple_spinner_item);
		int i;
		for (i = 15; i <= 120; i+=15) {
			Hadapter.add(String.valueOf(i));
		}
		Spinner spinnerH = (Spinner) findViewById(R.id.widget43);
		spinnerH.setAdapter(Hadapter);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		myMenu = menu;
		super.onCreateOptionsMenu(menu);
		menu.add(0, 0, Menu.NONE, "back to map").setIcon(android.R.drawable.ic_menu_revert );
		menu.add(0, 1, Menu.NONE, "make dummy data").setIcon(android.R.drawable.ic_menu_agenda);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case 0:
			Log.w("AA","0");
			Intent intent = new Intent(this, WiFiMapActivity.class);
			intent.setAction(Intent.ACTION_VIEW);
			startActivity(intent);
			return true;
		case 1:

			Log.w("AA","1");
			Intent intent2 = new Intent(this, WiFiInputMapActivity.class);
			intent2.setAction(Intent.ACTION_VIEW);
			startActivity(intent2);
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

}
