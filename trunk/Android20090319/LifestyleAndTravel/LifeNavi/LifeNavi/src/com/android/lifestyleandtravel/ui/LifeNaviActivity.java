package com.android.lifestyleandtravel.ui;

import android.app.AlertDialog;
import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.ZoomControls;

import com.android.lifestyleandtravel.R;
import com.android.lifestyleandtravel.net.transit.TransitResponse;
import com.android.lifestyleandtravel.service.GetTravelInfo;
import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;

public class LifeNaviActivity extends MapActivity implements LocationListener {

	/** Called when the activity is first created. */
	LocationManager locationManager;
	Location nowLocation; 
	MapController c;
	MapView m;
	GetTravelInfo travelInfo;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.map);

        //       TextView tv = new TextView(this);
        //       tv.setText("! LifeStyle and Travel !");
        //       setContentView(tv);        

        // get GPS
        if ( locationManager == null ) {
        	locationManager = (LocationManager)getSystemService(Context.LOCATION_SERVICE);        	
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, this);

        //MapView m = (MapView)findViewById(1);
        m = (MapView) findViewById(R.id.mapview);
        c = m.getController();
        c.setZoom(15);
        ZoomControls zc = (ZoomControls) m.getZoomControls();
        zc.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.FILL_PARENT,
                ViewGroup.LayoutParams.FILL_PARENT));
        zc.setGravity(Gravity.BOTTOM + Gravity.CENTER_HORIZONTAL);
        m.addView(zc);
        /*
        if ( nowLocation != null ) {
        	c.setCenter(new GeoPoint((int)(nowLocation.getLatitude()*1E6), (int)(nowLocation.getLongitude()*1E6)));
        }
        */
        c.setCenter(new GeoPoint(35690670, 139701160));
    }

    @Override
    protected boolean isRouteDisplayed() {
        return false;
    }

	public void onLocationChanged(Location location) {
		
        //
		/*
		if ( travelInfo == null ) {
			GetTravelInfo travelInfo = new GetTravelInfo();
			travelInfo.setCurrentLocation(location.getLatitude()+","+location.getLongitude());
			TransitResponse response = travelInfo.getServerData();
		}
		*/

		/*
		if ( nowLocation.getLatitude() == 0.0 ) {
			final AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
			
			AlertDialog alertDialog = alertDialogBuilder.create();
			alertDialog.show();

		}
		else {
			// TODO Auto-generated method stub
			nowLocation = location;
			c.setCenter(new GeoPoint((int)(nowLocation.getLatitude()*1E6), (int)(nowLocation.getLongitude()*1E6)));
		}
		*/
		// TODO Auto-generated method stub
		nowLocation = location;
		c.setCenter(new GeoPoint((int)(nowLocation.getLatitude()*1E6), (int)(nowLocation.getLongitude()*1E6)));
	}

	public void onProviderDisabled(String provider) {
		// TODO Auto-generated method stub
		
	}

	public void onProviderEnabled(String provider) {
		// TODO Auto-generated method stub
		
	}

	public void onStatusChanged(String provider, int status, Bundle extras) {
		// TODO Auto-generated method stub
		
	}
}