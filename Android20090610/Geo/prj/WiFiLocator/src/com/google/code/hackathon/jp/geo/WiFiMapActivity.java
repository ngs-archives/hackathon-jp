package com.google.code.hackathon.jp.geo;

import java.util.List;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationManager;
import android.location.LocationProvider;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ZoomControls;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;

public class WiFiMapActivity extends MapActivity {
	
	private static final String TAG = "MapActivity";
	LinearLayout linearLayout;
	MapView mapView;
	ZoomControls zoomControls;
	WiFiLogProvider wiFiLogProvider;

	@Override
	protected boolean isRouteDisplayed() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	protected void onCreate(Bundle arg0) {
		super.onCreate(arg0);
		this.setContentView(R.layout.map_view);
		
		
		//linearLayout = (LinearLayout) this.findViewById(R.id.btZin);
		mapView = (MapView) this.findViewById(R.id.geoMap);
		mapView.setBuiltInZoomControls(true);
		
		final Button btZi =(Button) findViewById(R.id.btZin);
		final Button btZo =(Button) findViewById(R.id.btZout);
		final Button btZm =(Button) findViewById(R.id.btMap);
		final Button btZs =(Button) findViewById(R.id.btSat);
		btZi.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v){
				mapView.getController().zoomIn();
			}
		});
		btZo.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v){
				mapView.getController().zoomOut();
			}
		});
		btZm.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v){
				mapView.setSatellite(false);
			}
		});
		btZs.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v){
				mapView.setSatellite(true);
			}
		});
		//mapView.getOverlays().add(new HeatmapOverlay());
		
		wiFiLogProvider = new WiFiLogProvider(this); 
		
		// service
		Intent intent = new Intent(this, WiFiLocatorService.class);
		this.startService(intent);
		Log.d("start centering", "start centering");
		
	}
	
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// TODO Auto-generated method stub
		super.onCreateOptionsMenu(menu);
		
		menu.add(0, 0, Menu.NONE, "settings").setIcon(android.R.drawable.ic_menu_set_as);
		menu.add(0, 1, Menu.NONE, "dummy").setIcon(android.R.drawable.ic_menu_agenda);
		
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// TODO Auto-generated method stub
		switch (item.getItemId()) {
		case 0:
			Log.w("AA","0");
			Intent intent = new Intent(this, WiFisetting.class);
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

	@Override
	protected void onPause() {
		// TODO Auto-generated method stub
		super.onPause();
		
	}

	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
		//centering
		mapCentering();
		Log.d("start showAreaAccessPointLocation", "start showAreaAccessPointLocation");
		
		showAreaAccessPointLocation();
		Log.d("end showAreaAccessPointLocation", "end showAreaAccessPointLocation");
	}

	private void mapCentering(){
		Location loc = getPosition();
		GeoPoint point = null;
		if(loc != null){
			point = LocationHelper.locationToGeoPoint(loc);
			Log.d(TAG, "not get position");
			Log.d(TAG, "lat: " + point.getLatitudeE6() + ", lng: " + point.getLongitudeE6());
		} else {
			point = LocationHelper.locationToGeoPoint(35.699286, 139.772959);
		}
		mapView.getController().setCenter(point);
	}
	
	private Location getPosition(){
		LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		Location loc =locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
		//Location loc =locationManager.get
//		
//		LocationProvider lp = locationManager.getProvider(LocationManager.GPS_PROVIDER);
		//lp.
		return loc;
	}
	
	
	private void showAreaAccessPointLocation(){ 
/*		GeoPoint center = mapView.getMapCenter();
		int latitudeNorthE6 = center.getLatitudeE6() + (mapView.getLatitudeSpan() /2);
		int latitudeSouthE6 = center.getLatitudeE6() - (mapView.getLatitudeSpan() /2);
		int longitudeEastE6 = center.getLatitudeE6() + (mapView.getLongitudeSpan() /2);
		int longitudeWestE6 = center.getLatitudeE6() - (mapView.getLongitudeSpan() /2);
		List<AccessPointLocation> lis = wiFiLogProvider.getAreaAccessPointLocation(latitudeNorthE6, latitudeSouthE6, longitudeEastE6, longitudeWestE6);
		
		Bitmap bmpMe = BitmapFactory.decodeResource(getResources(), R.drawable.opin);//ここではPNG使ってる
		List<Overlay> overlaylist = mapView.getOverlays();

		for(AccessPointLocation ac : lis){
			
			overlaylist.add(new MapIcon(bmpMe, ac.getGeoPoint()));
			
		} */
		HeatmapOverlay overlay = new HeatmapOverlay();
		overlay.setWiFiLogProvider(wiFiLogProvider);
		mapView.getOverlays().add(overlay);
		
	}
}
