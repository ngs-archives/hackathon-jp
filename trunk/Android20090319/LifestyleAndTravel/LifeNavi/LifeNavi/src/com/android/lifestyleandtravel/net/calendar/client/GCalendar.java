package com.android.lifestyleandtravel.net.calendar.client;

import java.util.Date;

public class GCalendar {
	private String text;

	private String dest;

	private String startDate;

	public GCalendar(String text, String dest, String startDate){
		this.setText(text);
		this.setDest(dest);
		this.setStartDate(startDate);

	}

	public void setText(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}

	public void setDest(String dest) {
		this.dest = dest;
	}

	public String getDest() {
		return dest;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getStartDate() {
		return startDate;
	}
}
