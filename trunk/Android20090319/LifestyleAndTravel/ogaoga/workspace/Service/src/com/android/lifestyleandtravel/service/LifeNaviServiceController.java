package com.android.lifestyleandtravel.service;

import android.app.Activity;
import android.os.Bundle;
import android.widget.Button;
import android.view.View.OnClickListener;
//import java.util.Iterator;
//import java.util.List;

//import android.app.AlertDialog;
//import android.content.Context;
import android.content.Intent;
//import android.net.Uri;
import android.view.View;

public class LifeNaviServiceController extends Activity {

	Button stopButton;
	Button startButton;

	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        startButton = (Button)findViewById(R.id.start);
        startButton.setOnClickListener(mStartListener);
        startButton.setEnabled(true);
        stopButton = (Button)findViewById(R.id.stop);
        stopButton.setOnClickListener(mStopListener);
        
        
        //stopButton.setEnabled(false);
        stopButton.setEnabled(true);
    }
    
	private OnClickListener mStartListener = new OnClickListener() {
        public void onClick(View v)
        {
            // Make sure the service is started.  It will continue running
            // until someone calls stopService().  The Intent we use to find
            // the service explicitly specifies our service component, because
            // we want it running in our own process and don't want other
            // applications to replace it.
            startService(new Intent(LifeNaviServiceController.this,
                    LifeNaviService.class));
            /*
            startButton.setEnabled(false);
            stopButton.setEnabled(true);
            */
        }
    };

    private OnClickListener mStopListener = new OnClickListener() {
        public void onClick(View v)
        {
            // Cancel a previous call to startService().  Note that the
            // service will not actually stop at this point if there are
            // still bound clients.
            stopService(new Intent(LifeNaviServiceController.this,
            		LifeNaviService.class));
            /*
            startButton.setEnabled(true);
            stopButton.setEnabled(false);
            */
        }
    };
    
}
