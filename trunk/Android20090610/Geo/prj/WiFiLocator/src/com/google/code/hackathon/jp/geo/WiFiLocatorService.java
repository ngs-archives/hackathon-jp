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
		super.onCreate();

		mWiFiManager = (WifiManager) this
				.getSystemService(Context.WIFI_SERVICE);
		mWiFiManager.setWifiEnabled(true);
		
		mProvider = new WiFiLogProvider(this);

		getScanResult();

		locationManager = (LocationManager) this
				.getSystemService(Context.LOCATION_SERVICE);
		locationListener = new LocationListener() {

			public void onLocationChanged(Location location) {

				Log.d(TAG, location.getLatitude() + ","
						+ location.getLongitude());

				mProvider.storeWiFiLog(location, getScanResult());
			}

			public void onProviderDisabled(String provider) {
				// TODO Auto-generated method stub

			}

			public void onProviderEnabled(String provider) {
				// TODO Auto-generated method stub

			}

			public void onStatusChanged(String provider, int status,
					Bundle extras) {
				// TODO Auto-generated method stub

			}

		};

	}

	public List<ScanResult> getScanResult() {
		mWiFiManager.startScan();
		List<ScanResult> results = mWiFiManager.getScanResults();

		if (results != null && results.size() > 0) {
			for (ScanResult result : results) {
				Log.d(TAG, "ssid: " + result.SSID);
				Log.d(TAG, "level: " + result.level);
			}
		}

		return results;
	}

	@Override
	public void onStart(Intent intent, int startId) {
		super.onStart(intent, startId);
		Log.d(TAG, "start service");
		enableLocationListener();
		Log.d(TAG, "set listener done");
	}

	private void enableLocationListener() {
		locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,
				1000 * 60, 300, locationListener);
		locationManager.requestLocationUpdates(
				LocationManager.NETWORK_PROVIDER, 1000 * 60, 300,
				locationListener);
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
