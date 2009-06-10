package org.toss.janken;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class Janken extends Activity {
	private OnClickListener mButton01Listener = new OnClickListener() {
	    public void onClick(View v) {
	    	Intent i = new Intent(Janken.this, GameView.class);
	    	startActivity(i);
	    }
	};
	
	private OnClickListener mButton04Listener = new OnClickListener() {
	    public void onClick(View v) {
	    	AlertDialog.Builder builder = new AlertDialog.Builder(Janken.this);
	    	builder.setMessage(R.string.thanks)
	    	.setCancelable(false)
	    	.setPositiveButton("OK", new DialogInterface.OnClickListener() {
	    		public void onClick(DialogInterface dialog, int id) {
	    			dialog.cancel();
	    		}
	    	}
	    	);
	    	AlertDialog alert = builder.create();
	    	alert.show();
	    }
	};
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        Button button = (Button)findViewById(R.id.Button01);
        button.setOnClickListener(mButton01Listener);
        button = (Button)findViewById(R.id.Button04);
        button.setOnClickListener(mButton04Listener);
    }
	
}
