package com.android.lifestyleandtravel;

import java.io.IOException;
import java.util.Calendar;

import com.android.lifestyleandtravel.net.calendar.client.CalendarServiceClient;

import android.app.Activity;
import android.os.Bundle;

public class LifestyleAndTravel extends Activity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        Calendar startDate = Calendar.getInstance();
        try{
        	CalendarServiceClient.getNewestCalendar(startDate);
        }catch(IOException ex){
        	System.out.println("excepiton");
        }
    }
}