package com.google.code.hackathon.jp.geo;

import java.util.List;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

public class WiFisetting extends Activity {


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
	

}
