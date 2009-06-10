package org.toss.janken;

import android.app.Activity;
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
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        Button button = (Button)findViewById(R.id.Button01);
        button.setOnClickListener(mButton01Listener);
    }
    
}
