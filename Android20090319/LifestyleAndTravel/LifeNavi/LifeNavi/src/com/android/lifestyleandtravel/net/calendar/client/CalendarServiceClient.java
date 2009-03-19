package com.android.lifestyleandtravel.net.calendar.client;

import java.io.IOException;
import java.util.Calendar;

import net.arnx.jsonic.JSON;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

public class CalendarServiceClient {

	private static final String USER_ACCOUNT = "hackaton.lifestyle@gmail.com";

	private static final String PASSWORD = "hackathon";

	public CalendarServiceClient(){
	}

	public static GCalendar getNewestCalendar(Calendar startDate) throws IOException{
		GCalendar hoge = null;
		try{
			HttpClient httpclient = new DefaultHttpClient();

			HttpClient http = new DefaultHttpClient();
			HttpGet method = new HttpGet("http://192.168.152.52:8080/GoogleCalendar/select");
			HttpResponse response = http.execute(method);

			String jsonstr = EntityUtils.toString(response.getEntity());
			jsonstr = jsonstr.substring(0, jsonstr.length() - 2);
			String title = jsonstr.substring(jsonstr.indexOf("text") + 7,
					jsonstr.indexOf("\"", jsonstr.indexOf("text") + 7));
			String dest = jsonstr.substring(jsonstr.indexOf("dest") + 7,
					jsonstr.indexOf("\"", jsonstr.indexOf("dest") + 7));
			String sDate = jsonstr.substring(jsonstr.indexOf("startDate") + 12,
					jsonstr.indexOf("\"", jsonstr.indexOf("startDate") + 12));
			System.out.println("jsonstr = " + jsonstr);
			//hoge = JSON.decode(jsonstr, GCalendar.class);
			hoge = new GCalendar(title, dest, sDate);

        }catch(Exception ex){
        	ex.printStackTrace();

        }
		return hoge;
	}

	public static GCalendar getNewestCalendar(String startDate) throws IOException{
		GCalendar hoge = null;
		try{
			hoge = CalendarServiceClient.getNewestCalendar(Calendar.getInstance());
        }catch(Exception ex){
        	ex.printStackTrace();

        }
		return hoge;
	}

}
