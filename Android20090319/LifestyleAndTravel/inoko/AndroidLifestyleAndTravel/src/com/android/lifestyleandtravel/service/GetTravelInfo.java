package com.android.lifestyleandtravel.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.view.View;


public class GetTravelInfo {

	String[] travelInfo;
	
	// Name of current location i.e. "Shinjuku"
	String currentLocation;
	String serverURL = "";
	
	
	public GetTravelInfo() {
		
	}
	
	
	public void setCurrentLocation( String str ) {
		this.currentLocation = str;	
	}
	
	
	public String getCurrentLocation() {
		if( currentLocation != "" ) {
			return currentLocation;
		} else {
			return "No Location";
		}
	}
	
	
	public void getServerData() {
		String webContent = null;
		
		try {   
	    	   DefaultHttpClient client = new DefaultHttpClient();
	    	
	    	   URI uri = new URI( serverURL );  
	    	   HttpGet method = new HttpGet(uri);  
	    	   HttpResponse res = client.execute(method);  
	    	   InputStream data = res.getEntity().getContent();  
	    	   
	    	   // webContent contains 
	    	   // #1. Nearest station
	    	   // #2. Transfer station
	    	   // #3. Destination station
	    	   // #4. Final destination ( Cerulean Tower )
	    	   // #5. Total distance to destination 
	    	   webContent = generateString( data );
	    	   
		    	   if(webContent != null) {
		    		   prepareServerData( webContent );  
		    	   }
	    	   } 
	       catch (ClientProtocolException e) { 
	    		   e.printStackTrace();
	    		   System.out.println( "ERROR: ClientProtocolException " + e.toString() );
	    		   
	    	   }
	       catch (IOException e) { 
	    		   e.printStackTrace(); 
	    		   System.out.println( "ERROR: IOException " + e.toString() );
	    		   
	    	   } 
	       catch (URISyntaxException e) {  
	    		   e.printStackTrace();      
	    		   System.out.println( "ERROR: URISyntaxException " + e.toString() );
	    	   }   

	        }
	
	
	public String generateString(InputStream stream) {   
    	InputStreamReader reader = new InputStreamReader(stream); 
    	BufferedReader buffer = new BufferedReader(reader); 
    	StringBuilder sb = new StringBuilder();  
    	try {
    		String cur; 
    		while ((cur = buffer.readLine()) != null) { 
    			sb.append(cur + "\n"); 
    			}  
    		}
    	catch (IOException e) { 
    			e.printStackTrace(); 
    		} 
    	try {  
    		stream.close(); 
    		} 
    	catch (IOException e) {  
    			e.printStackTrace(); 
    		} 
    	
    	return sb.toString();  
     }
	
	
	void prepareServerData(  String dataFromServer ) {
		String delims = "[,]";
		// How to pass tokens to UI?
		String[] tokens = dataFromServer.split( delims );
		
		
	}


} // end class