package com.google.code.hackathon.jp.geo;

import java.util.Arrays;

import android.content.ContentValues;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ZoomControls;

import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;

/**
 * デバッグ用のマップ画面。入力したり、SQL に入っている項目を見たり
 * 
 * @author ogura
 * 
 */
public class WiFiInputMapActivity extends MapActivity {

	private static final String TAG = "InputMapActivity";
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

		HeatmapOverlay overlay = new HeatmapOverlay();
		overlay.setWiFiLogProvider(new WiFiLogProvider(this));

		mapView.getOverlays().add(overlay);

		Button addLogButton = (Button) this.findViewById(R.id.add_wifi_log);
		addLogButton.setOnClickListener(new OnClickListener() {

			public void onClick(View v) {
				saveLog();
			}
		});
	}

	protected void saveLog() {

		ContentValues values = getDummyContentValues(LocationHelper
				.toGeoPointValue(mapView.getMapCenter().getLatitudeE6()),
				LocationHelper.toGeoPointValue(mapView.getMapCenter()
						.getLongitudeE6()));
		WiFiLogProvider provider = new WiFiLogProvider(this);

		provider.storeWiFiLog(Arrays.asList(new ContentValues[] { values }));
	}

	protected ContentValues getDummyContentValues(double lat, double lng) {
		ContentValues values = new ContentValues();

		values.put(WiFiLogProvider.TIME, System.currentTimeMillis());
		values.put(WiFiLogProvider.LOC_LATITUDE, lat);
		values.put(WiFiLogProvider.LOC_LONGITUDE, lng);
		values.put(WiFiLogProvider.LOC_ACCURACY, 100);

		values.put(WiFiLogProvider.SR_BSSID, "dummy_bssid");
		values.put(WiFiLogProvider.SR_SSID, "dummy_ssid"
				+ (int) (Math.random() * 10) % 10);
		values.put(WiFiLogProvider.SR_CAPABILITIES, "[WPA]");
		values.put(WiFiLogProvider.SR_FREQUENCY, 10);
		values.put(WiFiLogProvider.SR_LEVEL, 10);

		return values;
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);

		menu.addSubMenu(0, 0, Menu.NONE, "show log");
		menu.addSubMenu(0, 1, Menu.NONE, "hoge");

		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		super.onOptionsItemSelected(item);

		switch (item.getItemId()) {
		case 0:
			WiFiLogProvider provider = new WiFiLogProvider(this);
			Log.d(TAG, "log size: " + provider.getAreaAccessPointLocationE6(LocationHelper
					.toGeoPointValue(35), LocationHelper.toGeoPointValue(35),
					LocationHelper.toGeoPointValue(140), LocationHelper
							.toGeoPointValue(138)).size());
			Log.d(TAG, "all log size: " + provider.getAllWiFiLog().size());
			break;
		case 1:
			break;
		default:
			Log.e(TAG, "unknown option");
		}

		return true;
	}

}
