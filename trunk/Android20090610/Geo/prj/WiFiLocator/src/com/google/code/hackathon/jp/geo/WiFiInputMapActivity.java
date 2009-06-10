package com.google.code.hackathon.jp.geo;

import android.content.ContentValues;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ZoomControls;

import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;

public class WiFiInputMapActivity extends MapActivity {

	
	LinearLayout linearLayout;
	MapView mapView;
	ZoomControls zoomControls;

	@Override
	protected boolean isRouteDisplayed() {
		// TODO Auto-generated method stub
		return false;
	}
	
	@Override
	protected void onCreate(Bundle arg0) {
		super.onCreate(arg0);
		this.setContentView(R.layout.wifi_input);
		
		linearLayout = (LinearLayout) this.findViewById(R.id.wifi_input_zoom);
		mapView = (MapView) this.findViewById(R.id.wifi_input_map);
		mapView.setBuiltInZoomControls(true);
		
		mapView.getOverlays().add(new HeatmapOverlay());
		
		Button addLogButton = (Button) this.findViewById(R.id.add_wifi_log);
		addLogButton.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				saveLog();
			}});
	}
	
	protected void saveLog() {
		
		ContentValues values = getDummyContentValues(mapView.getMapCenter().getLatitudeE6() / (double)(1000000), mapView.getMapCenter().getLongitudeE6() / (double)(1000000));
		WiFiLogProvider provider = new WiFiLogProvider(this);
		
		provider.storeWiFiLog(values);
	}
	
	protected ContentValues getDummyContentValues(double lat, double lng) {
		ContentValues values = new ContentValues();
		
		values.put(WiFiLogProvider.TIME, System.currentTimeMillis());
		values.put(WiFiLogProvider.LOC_LATITUDE, lat);
		values.put(WiFiLogProvider.LOC_LONGITUDE, lng);
		values.put(WiFiLogProvider.LOC_ACCURACY, 100);

		values.put(WiFiLogProvider.SR_BSSID, "dummy_bssid");
		values.put(WiFiLogProvider.SR_SSID, "dummy_ssid");
		values.put(WiFiLogProvider.SR_CAPABILITIES, "[WPA]");
		values.put(WiFiLogProvider.SR_FREQUENCY, 10);
		values.put(WiFiLogProvider.SR_LEVEL, 10);
		
		return values;
	}
	
}
