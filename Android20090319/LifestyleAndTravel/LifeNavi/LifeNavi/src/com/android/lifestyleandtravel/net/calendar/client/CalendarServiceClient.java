package com.android.lifestyleandtravel.net.calendar.client;

import java.io.IOException;
import java.util.Calendar;

import net.arnx.jsonic.JSON;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

public class CalendarServiceClient {

	private static final String USER_ACCOUNT = "hackaton.lifestyle@gmail.com";

	private static final String PASSWORD = "hackathon";

	public CalendarServiceClient(){
	}

	public static GCalendar getNewestCalendar(Calendar startDate) throws IOException{
        HttpClient httpclient = new DefaultHttpClient();

		HttpClient http = new DefaultHttpClient();
		HttpGet method = new HttpGet("http://localhost:8080/GoogleCalendar/select");
		HttpResponse response = http.execute(method);
		String jsonstr = response.getEntity().toString();
		System.out.println("jsonstr = " + jsonstr);
		GCalendar hoge = JSON.decode(jsonstr, GCalendar.class);
		return hoge;
	}

}
