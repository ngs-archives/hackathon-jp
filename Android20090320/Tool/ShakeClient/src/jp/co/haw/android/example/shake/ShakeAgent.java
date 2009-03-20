package jp.co.haw.android.example.shake;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.util.Linkify;
import android.view.Gravity;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * @author furuya
 * http://stachibana.biz/?p=451 で公開されているソースのパクリです
 */
public class ShakeAgent extends Activity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        LinearLayout mainLayout = new LinearLayout(this);
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        mainLayout.setPadding(30, 20, 30, 20);
//        
//        TextView infoView = new TextView(this);
//        infoView.setText(R.string.app_info);
//        infoView.setPadding(0, 0, 0, 20);
//        mainLayout.addView(infoView, 
//        		new LinearLayout.LayoutParams(
//        				LinearLayout.LayoutParams.FILL_PARENT,
//        				LinearLayout.LayoutParams.WRAP_CONTENT)
//        		);
//        
//        TextView urlTab = new TextView(this);
//        urlTab.setAutoLinkMask(Linkify.ALL);
//        urlTab.setText(R.string.app_url);
//        urlTab.setPadding(0, 0, 0, 20);
//        mainLayout.addView(urlTab, 
//        		new LinearLayout.LayoutParams(
//        				LinearLayout.LayoutParams.FILL_PARENT,
//        				LinearLayout.LayoutParams.WRAP_CONTENT)
//        		);
//        
        LinearLayout buttonLayout = new LinearLayout(this);
        buttonLayout.setOrientation(LinearLayout.VERTICAL);
        buttonLayout.setGravity(Gravity.CENTER_HORIZONTAL);
        
        Button startButton = new Button(this);
        startButton.setText(R.string.start_service);
        startButton.setOnClickListener(mStartListner);
        buttonLayout.addView(startButton, 
        		new LinearLayout.LayoutParams(
        				LinearLayout.LayoutParams.WRAP_CONTENT,
        				LinearLayout.LayoutParams.WRAP_CONTENT)
        		);
        Button stopButton = new Button(this);
        stopButton.setText(R.string.stop_service);
        stopButton.setOnClickListener(mStopListner);
        buttonLayout.addView(stopButton, 
        		new LinearLayout.LayoutParams(
        				LinearLayout.LayoutParams.WRAP_CONTENT,
        				LinearLayout.LayoutParams.WRAP_CONTENT)
        		);
        
        mainLayout.addView(buttonLayout, 
        		new LinearLayout.LayoutParams(
        				LinearLayout.LayoutParams.FILL_PARENT,
        				LinearLayout.LayoutParams.WRAP_CONTENT)
        		);
        
        setContentView(mainLayout);
        
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent = new Intent(ShakeAgent.this, ShakeDetector.class);
        startService(intent);
    }
    
    private OnClickListener mStartListner = new OnClickListener() {
    	public void onClick(View v) {
    		Intent intent = new Intent(Intent.ACTION_VIEW);
    		intent = new Intent(ShakeAgent.this, ShakeDetector.class);
    		startService(intent);
    	}
    };
    
    private OnClickListener mStopListner = new OnClickListener() {
    	public void onClick(View v) {
    		Intent intent = new Intent(Intent.ACTION_VIEW);
    		intent = new Intent(ShakeAgent.this, ShakeDetector.class);
    		stopService(intent);
    	}
    };
}