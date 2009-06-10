package com.google.code.hackathon.jp.geo;

import java.util.List;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

public class WiFiLocatorService extends Service {

	static protected final String TAG = "WIFI_SERVICE";

	LocationListener locationListener;
	LocationManager locationManager;
	WiFiLogProvider mProvider;
	WifiManager mWiFiManager;

	@Override
	public void onCreate() {
		// TODO Auto-generated method stub
		super.onCreate();
		mProvider = new WiFiLogProvider(this);

		mWiFiManager = (WifiManager) this
				.getSystemService(Context.WIFI_SERVICE);
		List<ScanResult> scanResult = mWiFiManager.getScanResults();
		Log.d(TAG, "sr: " + scanResult.size());
		if (scanResult.size() > 0) {
			Log.d(TAG, "sr bssid: " + scanResult.get(0).BSSID);
			Log.d(TAG, "sr ssid: " + scanResult.get(0).SSID);
			Log.d(TAG, "sr capabilities: " + scanResult.get(0).capabilities);
			Log.d(TAG, "sr freq: " + scanResult.get(0).frequency);
			Log.d(TAG, "sr level: " + scanResult.get(0).level);
		}
		locationManager = (LocationManager) this
				.getSystemService(Context.LOCATION_SERVICE);
		locationListener = new LocationListener() {

			@Override
			public void onLocationChanged(Location location) {

				Log.d(TAG, location.getLatitude() + ","
						+ location.getLongitude());
				

				mProvider.storeWiFiLog(location, null);
			}

			@Override
			public void onProviderDisabled(String provider) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onProviderEnabled(String provider) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onStatusChanged(String provider, int status,
					Bundle extras) {
				// TODO Auto-generated method stub

			}

		};

	}

	@Override
	public void onStart(Intent intent, int startId) {
		super.onStart(intent, startId);
		enableLocationListener();
	}

	private void enableLocationListener() {
		// TODO distance should be a parameter
		locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,
				1000 * 60, 300, locationListener);
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
		disableLocationListener();
	}

	private void disableLocationListener() {
		locationManager.removeUpdates(locationListener);
	}

	public IBinder asBinder() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public IBinder onBind(Intent intent) {
		// TODO Auto-generated method stub
		return null;
	}

}
