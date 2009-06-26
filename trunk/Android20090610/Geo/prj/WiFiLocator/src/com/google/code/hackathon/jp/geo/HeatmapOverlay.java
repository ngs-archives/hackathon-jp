package com.google.code.hackathon.jp.geo;

import java.util.List;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;
import android.util.Log;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.Projection;

public class HeatmapOverlay extends Overlay {
	
	private static final String TAG = "MapOverlay";
	private WiFiLogProvider wiFiLogProvider;

	public void setWiFiLogProvider(WiFiLogProvider wiFiLogProvider) {
		this.wiFiLogProvider = wiFiLogProvider;
	}

	@Override
	public void draw(Canvas canvas, MapView mapView, boolean shadow) {
		super.draw(canvas, mapView, shadow);
		
		List<AccessPointLocation> apLocations = getAPLocations(mapView);
		
		Projection projection = mapView.getProjection();
		Paint paint = new Paint();
		paint.setColor(Color.RED);
		paint.setAlpha(100);
		for (AccessPointLocation apLocation : apLocations) {
			Log.d(TAG, "lat: " + apLocation.getGeoPoint().getLatitudeE6() + ",lng: " + apLocation.getGeoPoint().getLongitudeE6());
			Point point = projection.toPixels(apLocation.getGeoPoint(), null);
			canvas.drawCircle(point.x, point.y, 5, paint);
		}
	}
	
	private List<AccessPointLocation> getAPLocations(MapView mapView) {
		GeoPoint center = mapView.getMapCenter();
		int latitudeNorthE6 = center.getLatitudeE6() + (mapView.getLatitudeSpan() /2);
		int latitudeSouthE6 = center.getLatitudeE6() - (mapView.getLatitudeSpan() /2);
		int longitudeEastE6 = center.getLongitudeE6() + (mapView.getLongitudeSpan() /2);
		int longitudeWestE6 = center.getLongitudeE6() - (mapView.getLongitudeSpan() /2);
		return wiFiLogProvider.getAreaAccessPointLocationE6(latitudeNorthE6, latitudeSouthE6, longitudeEastE6, longitudeWestE6);
	}
	
}
