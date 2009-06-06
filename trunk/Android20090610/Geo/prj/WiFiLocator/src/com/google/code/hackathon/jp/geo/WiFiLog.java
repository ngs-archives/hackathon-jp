package com.google.code.hackathon.jp.geo;


public class WiFiLog {
	
	private long time;
	private double latitude;
	private double longitude;

	public WiFiLog(long time, double latitude, double longitude) {
		this.setTime(time);
		this.setLatitude(latitude);
		this.setLongitude(longitude);
	}

	public void setTime(long time) {
		this.time = time;
	}

	public long getTime() {
		return time;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public double getLongitude() {
		return longitude;
	}

	

}
