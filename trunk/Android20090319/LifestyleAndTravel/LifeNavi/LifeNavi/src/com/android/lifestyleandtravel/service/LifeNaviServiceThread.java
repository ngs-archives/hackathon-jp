package com.android.lifestyleandtravel.service;

/*
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Properties;
*/

import android.app.Service;
import android.content.Context;
import android.location.Location;
import android.location.LocationManager;
import android.util.Log;

public class LifeNaviServiceThread extends Thread {
	
	boolean isExit;
	Service parent;

	public LifeNaviServiceThread(Service service) {
		super();
		parent =  service;
	}
	
	public void startService() {
		super.start();
		isExit = false;
	}
	
	public void stopService() {
		isExit = true;
	}
	
	public void run() {
		//
		for ( ; ! isExit ; ) {
			Log.v("thread", "run()");
		
			LocationManager locationManager;
			locationManager = (LocationManager)parent.getSystemService(Context.LOCATION_SERVICE);
			Location location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
			if ( location != null ) {
				Log.v("location", location.getLongitude()+","+location.getLatitude());
			}
			else {
				Log.v("location", "location == null");
			}
			
			try {
				sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				isExit = true;
			}
		}
	}
}
