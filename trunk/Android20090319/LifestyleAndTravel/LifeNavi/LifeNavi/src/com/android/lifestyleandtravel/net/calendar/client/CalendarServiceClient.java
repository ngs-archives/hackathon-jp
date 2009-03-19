package com.android.lifestyleandtravel.net.calendar.client;

import java.io.IOException;
import java.util.Calendar;

import net.arnx.jsonic.JSON;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import com.android.lifestyleandtravel.server.calendar.model.GCalendar;

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
			System.out.println("jsonstr = " + jsonstr);
			hoge = JSON.decode(jsonstr, GCalendar.class);

        }catch(Exception ex){
        	ex.printStackTrace();

        }
		return hoge;
	}

	public static GCalendar getNewestCalendar(String startDate) throws IOException{
		GCalendar hoge = null;
		try{
			GCalendar gcal = new GCalendar("AndroidHackathon", "渋谷セルリアンタワー", "2009/03/20 12:00:00");
			return gcal;
        }catch(Exception ex){
        	ex.printStackTrace();

        }
		return hoge;
	}

}
