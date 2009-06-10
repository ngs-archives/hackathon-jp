package com.google.code.hackathon.jp.geo;

import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.ZoomControls;

import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;

public class WiFiMapActivity extends MapActivity {
	
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
		this.setContentView(R.layout.map_view);
		
		linearLayout = (LinearLayout) this.findViewById(R.id.zoomview);
		mapView = (MapView) this.findViewById(R.id.map_view);
		mapView.setBuiltInZoomControls(true);
		
		mapView.getOverlays().add(new HeatmapOverlay());
	}
	
	

}
