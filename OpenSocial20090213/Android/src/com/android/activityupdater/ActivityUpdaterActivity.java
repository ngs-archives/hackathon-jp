package com.android.activityupdater;

import java.util.Collection;

import org.opensocial.client.OpenSocialClient;
import org.opensocial.data.OpenSocialPerson;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.*;
import android.os.Handler;
import java.util.*;

public class ActivityUpdaterActivity extends Activity {
	public OpenSocialClient client;
	public ArrayAdapter<String> arrayFriendInfo;
	public List<String> infoList;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        infoList = new ArrayList<String>();
        try {
        	TextView status = (TextView)findViewById(R.id.status);
        	status.setText("Now Updating...");        	
        	
			client = new OpenSocialClient("orkut.com");
	
	        // orkut supports both the REST and RPC protocols; RPC is preferred because
	        // RPC supports batch requests
	        client.setProperty(OpenSocialClient.Properties.RPC_ENDPOINT,
	            "http://sandbox.orkut.com/social/rpc");
	        
	        // Credentials provided here are associated with the gadget located at
	        // http://opensocial-resources.googlecode.com/svn/samples/rest_rpc/sample.xml;
	        // If you install this gadget, you can substitute your own OpenSocial ID
	        // for the one used below and fetch your profile data and friends
	        client.setProperty(OpenSocialClient.Properties.CONSUMER_SECRET,
	            "uynAeXiWTisflWX99KU1D2q5");
	        client.setProperty(OpenSocialClient.Properties.CONSUMER_KEY,
	            "orkut.com:623061448914");
	        client.setProperty(OpenSocialClient.Properties.VIEWER_ID,
	            "00870763496448511064");

	        Log.d("-", "OK");
	        Thread thr = new WorkerThread(client);
	        thr.start();
        } catch (Exception e) {
        	Log.d("-", e.toString());
        }
    }
    
    class UIUpdater extends Thread {
    	private String mText;
    	private int mMode;
    	public static final int MODE_LIST = 0;
    	public static final int MODE_STATUS = 1;
    	
    	UIUpdater(String text, int mode)
    	{
    		mText = text;
    		mMode = mode;
    	}
    	
    	synchronized public void run()
    	{
    		ActivityUpdaterActivity parent = ActivityUpdaterActivity.this;
    		switch(mMode) {
    		case MODE_LIST:
    			infoList.add(mText);
        		ListView friendList = (ListView)parent.findViewById(R.id.listFriendInfo);
        		friendList.setAdapter(new ArrayAdapter<String>(parent, R.layout.rowdata, ActivityUpdaterActivity.this.infoList));
    			break;

    		case MODE_STATUS:
            	TextView status = (TextView)parent.findViewById(R.id.status);
            	status.setText(mText);
    			break;

    		default:
    			break;	
    		}
    	}
    }

    class WorkerThread extends Thread {
    	private OpenSocialClient mClient;
    	private final Handler mHandler;
 
    	WorkerThread(OpenSocialClient osClient)
    	{
    		mClient = osClient;
    		mHandler = new Handler();
    	}
    	
    	public void run() {
            try {
                // Retrieve the friends of the specified user using the OpenSocialClient
                // method fetchFriends
                Collection<OpenSocialPerson> friends = mClient.fetchFriends("00870763496448511064");
                
                // The fetchFriends method returns a typical Java Collection object with
                // all of the methods you're already accustomed to like size()
                // mHandler.post(new UIUpdater(friends.size() + " friends:"));

                // Iterate through the Collection
                for (OpenSocialPerson friend : friends) {
                  // Output the name of the current friend
                  mHandler.post(new UIUpdater(friend.getDisplayName(), UIUpdater.MODE_LIST));
                }

            } catch (Exception e) {
            	Log.d("-", e.toString());
            }
        	mHandler.post(new UIUpdater("Updating has been completed successfully.", UIUpdater.MODE_STATUS));
    	}
    }
}