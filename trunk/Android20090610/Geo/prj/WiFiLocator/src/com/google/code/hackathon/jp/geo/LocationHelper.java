package com.google.code.hackathon.jp.geo;

import android.location.Location;

import com.google.android.maps.GeoPoint;

public class LocationHelper {
	
	public static GeoPoint locationToGeoPoint(Location loc) {
		return locationToGeoPoint(loc.getLatitude(), loc.getLongitude());
	}
	
	public static int toGeoPointValue(double latlng) {
		return (int) (latlng * 1E6);
	}
	
	public static double toLocationValue(int latlngE6) {
		return (double)latlngE6 / (double)1E6;
	}

	public static GeoPoint locationToGeoPoint(double lat, double lng) {
		return new GeoPoint(toGeoPointValue(lat), toGeoPointValue(lng));
	}

}
