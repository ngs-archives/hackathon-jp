package com.android.lifestyleandtravel.service;

import java.io.IOException;
import com.android.lifestyleandtravel.net.calendar.client.CalendarServiceClient;
import com.android.lifestyleandtravel.net.calendar.client.GCalendar;
import com.android.lifestyleandtravel.net.http.CustomHttpClient;
import com.android.lifestyleandtravel.net.transit.TransitRequest;
import com.android.lifestyleandtravel.net.transit.TransitResponse;
import com.android.lifestyleandtravel.net.transit.TransitResponseHandler;
import com.android.lifestyleandtravel.net.transit.TransitService;


public class GetTravelInfo /*extends Activity*/ {

	String[] travelInfo;
	
	// Name of current location i.e. "Shinjuku"
	String currentLocation;
	// Name of current destination
	String destinationLocation;
	String startDate;
	String title;
	
	String serverURL = "";
	
	// Location and time from Calendar for next appointment
	String[] calendarData = null;
	
	// Calendar object
	GCalendar calendar = null;
	
	// JSon component
	TransitRequest transitRequest = null;
	
	TransitResponseHandlerImpl handler = new TransitResponseHandlerImpl();
	
	// Constructor
	public GetTravelInfo( ) {
		
	}
/*	
	@Override
    public void onCreate( Bundle savedInstanceState ) {
		super.onCreate( savedInstanceState );
		
		calendar = new LifeStyleCalendar();
		
		if( calendar != null ) {
			// Time, location of appointment and some title
			calendarData= calendar.getNextSchedule();
			
			// Call JSon component here
		}
		
	}
	*/
	
	
	public void setCurrentLocation( String str ) {
		this.currentLocation = str;	
	}
	
	
	public void setDestinationLocation( String str ) {
		this.destinationLocation = str;	
	}
	
	
	public String getCurrentLocation() {
		if( currentLocation != "" ) {
			return currentLocation;
		} else {
			return "No Location";
		}
	}
	
	// Use JSon component
	public TransitResponse getServerData() {
		TransitResponse response  = null;

		GCalendar gcal = null;
		try {
			gcal = CalendarServiceClient.getNewestCalendar( "2009/03/20 12:00:00"  );
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		if( gcal != null ) {
			// Time, location of appointment and some title
			
			destinationLocation = gcal.getDest();
			title = gcal.getText();
			startDate = gcal.getStartDate();
			
			// Call JSon component here with CurrentLocation, coords. for destination
			transitRequest = new TransitRequest( );
			
			if( currentLocation != "" ) {
				transitRequest.saddr = currentLocation;	
			} else {
				transitRequest.saddr = "新宿駅";
			}
			
			if( destinationLocation != "" ) {
				transitRequest.daddr = destinationLocation;
			} else {
				// 
				transitRequest.daddr = "37.0625,-95.677068";
			}
			
			try {
		        final TransitService service = new TransitService( new CustomHttpClient() );
		        service.execute(handler, transitRequest);

		        // This is the response for the Map Ui
		         response = handler.getResponse();
		        
		       // prepareServerData( parent, response );
			} catch( Exception ex ) {

			}
		}
		
		return response;
	}
	


    private class TransitResponseHandlerImpl implements TransitResponseHandler {

        private TransitResponse mResponse;
        public final TransitResponse getResponse() {
            return mResponse;
        }

        
        @Override
        public void post( final TransitResponse response ) {
            mResponse = response;
        }
    }

} // end class