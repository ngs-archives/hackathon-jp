package com.google.code.hackathon.jp.geo;

import com.google.android.maps.GeoPoint;

public class AccessPointLocation {

	private GeoPoint geoPoint;
	private String ssid;
	private int level;

	public GeoPoint getGeoPoint() {
		return geoPoint;
	}

	public void setGeoPoint(GeoPoint geoPoint) {
		this.geoPoint = geoPoint;
	}

	public String getSsid() {
		return ssid;
	}

	public void setSsid(String ssid) {
		this.ssid = ssid;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}
}
