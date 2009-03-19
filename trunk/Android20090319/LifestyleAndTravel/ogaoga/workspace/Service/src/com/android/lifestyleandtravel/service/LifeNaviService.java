/*
 * Copyright (C) 2007 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.android.lifestyleandtravel.service;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Binder;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

//
// Need the following import to get access to the app resources, since this
// class is in a sub-package.
//import com.example.android.apis.R;

/**
 * This is an example of implementing an application service that runs locally
 * in the same process as the application.  The {@link LocalServiceController}
 * and {@link LocalServiceBinding} classes show how to interact with the
 * service.
 *
 * <p>Notice the use of the {@link NotificationManager} when interesting things
 * happen in the service.  This is generally how background services should
 * interact with the user, rather than doing something more disruptive such as
 * calling startActivity().
 */
public class LifeNaviService extends Service implements LocationListener {
    private NotificationManager mNM;
    
    private LifeNaviServiceThread thread;
    
    private LocationManager locationManager;
    
    /**
     * Class for clients to access.  Because we know this service always
     * runs in the same process as its clients, we don't need to deal with
     * IPC.
     */
    public class LocalBinder extends Binder {
    	LifeNaviService getService() {
            return LifeNaviService.this;
        }
    }
    
    //@Override
    public void onCreate() {
        mNM = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);

        // Display a notification about us starting.  We put an icon in the status bar.
        showNotification();
        
        /*
        thread = new LifeNaviServiceThread(this);
        thread.startService();
        */
        
        // add LocationListener
        if ( locationManager == null ) {
        	locationManager = (LocationManager)getSystemService(Context.LOCATION_SERVICE);        	
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, this);
    }

    //@Override
    public void onDestroy() {
    	
    	locationManager.removeUpdates(this);
    	
    	//thread.stopService();
    	
        // Cancel the persistent notification.
        mNM.cancel(R.string.service_started);

        // Tell the user we stopped.
        Toast.makeText(this, R.string.service_stopped, Toast.LENGTH_SHORT).show();
    }

    //@Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    // This is the object that receives interactions from clients.  See
    // RemoteService for a more complete example.
    private final IBinder mBinder = new LocalBinder();

    /**
     * Show a notification while this service is running.
     */
    private void showNotification() {
        // In this sample, we'll use the same text for the ticker and the expanded notification
        CharSequence text = getText(R.string.service_started);

        // Set the icon, scrolling text and timestamp
        /*
        Notification notification = new Notification(R.drawable.stat_sample, text, 
        		System.currentTimeMillis());
        		*/
        Notification notification = new Notification(R.drawable.icon, text, 
        		System.currentTimeMillis());
        
        // The PendingIntent to launch our activity if the user selects this notification
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0,
                new Intent(this, LifeNaviServiceController.class), 0);

        // Set the info for the views that show in the notification panel.
        notification.setLatestEventInfo(this, getText(R.string.service_name),
                       text, contentIntent);

        // Send the notification.
        // We use a layout id because it is a unique number.  We use it later to cancel.
        mNM.notify(R.string.service_started, notification);
    }

	public void onLocationChanged(Location location) {
		Log.v("location", "onLocationChanged");
		Log.v("location", location.getLongitude()+","+location.getLatitude());
		
		// 場所がかわったので、それをベースに、目的地に近いかを判断する。
				
	}

	public void onProviderDisabled(String provider) {
				
	}

	public void onProviderEnabled(String provider) {
				
	}

	public void onStatusChanged(String provider, int status, Bundle extras) {
		Log.v("location", "onStatusChanged");
	}
}

