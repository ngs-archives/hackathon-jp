package com.google.code.hackathon.jp.geo;

import java.util.List;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

public class WiFiLocator extends Activity {

	protected static final String TAG = "Locator";
	TextView textArea;
	boolean enableLocate = false;
	WiFiLogProvider mProvider;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		textArea = (TextView) this.findViewById(R.id.textArea);
		mProvider = new WiFiLogProvider(this);

		// setup listeners
		Button button = (Button) this.findViewById(R.id.Button01);
		button.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				List<WiFiLog> logs = mProvider.getWiFiLog(50, 30, 145, 120);
				if (logs.size() > 0) {
					textArea.setText("size: " + logs.size() + ", lat: "
							+ logs.get(logs.size() - 1).getLatitude() + ", lng: "
							+ logs.get(logs.size() - 1).getLongitude());
				} else {
					textArea.setText("size is zero");
				}
			}
		});
		
		// service
		Intent intent = new Intent(this, WiFiLocatorService.class);
		this.startService(intent);
	}

}
