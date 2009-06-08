package com.fujimic.first_step.openGL;



import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;


public class cubeRotation extends Activity {
    /** Called when the activity is first created. */
	
	
	GLCubeView mView;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        mView = new GLCubeView( getApplication() );
        setContentView(mView);
        
        mView.setOnTouchListener(sheetTouchListener);
    }
    
    float pre_x;
    float pre_y;
    
    OnTouchListener sheetTouchListener = new OnTouchListener() {
	    public boolean onTouch(View v, MotionEvent e){
	    	float x = e.getX();
	    	float y = e.getY();
	    	
	    	
	    	switch(e.getAction()){
	    	
	    		case MotionEvent.ACTION_DOWN:
	    			pre_x = x;
	    			pre_y = y;
	    			break;
	    		case MotionEvent.ACTION_UP:
	    			break;
	    		case MotionEvent.ACTION_MOVE:
    	    	Log.v("Debug","mouse_move x=" + x + " pre_x=" + pre_x);
	    			
	    			
	    			mView.xrot -= (pre_y - y) / 2;
	    			mView.yrot += (pre_x - x) / 2;
	    			
	    			pre_x = x;
	    			pre_y = y;
	    			break;
	    		default:
	    			break;
	    	}
    	
    	   return true;
   
	    }
    };     
}

