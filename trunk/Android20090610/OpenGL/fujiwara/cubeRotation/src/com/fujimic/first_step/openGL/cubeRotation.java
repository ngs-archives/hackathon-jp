package com.fujimic.first_step.openGL;



import java.util.List;

import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Vibrator;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;


public class cubeRotation extends Activity implements SensorEventListener{
    /** Called when the activity is first created. */
	
	
	private GLCubeView mView;
	private SensorManager mySensorManager ;
	
	private double[] nowGravityVector = {0,0,0};
	private float maxScale = 1.8f;
	private float minScale = 0.05f;
	private float nowScale = 0.7f;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        mView = new GLCubeView( getApplication() );
        setContentView(mView);
        
//        mView.setOnTouchListener(sheetTouchListener);
        mySensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);

		mView.xScall = nowScale;
		mView.yScall = nowScale;
		mView.zScall = nowScale;
    
    }
    @Override
	protected void onResume() {
    	super.onResume();
    	List<Sensor> sensors;
    	Sensor sensor;
    	Boolean rc;

    	sensors = mySensorManager.getSensorList(Sensor.TYPE_ORIENTATION);
    	sensor = sensors.get(0);
    	rc =  mySensorManager.registerListener(this,sensor,SensorManager.SENSOR_DELAY_FASTEST);


    	sensors = mySensorManager.getSensorList(Sensor.TYPE_ACCELEROMETER);
    	sensor = sensors.get(0);
    	rc =  mySensorManager.registerListener(this,sensor,SensorManager.SENSOR_DELAY_NORMAL);

	}
	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		
		if (event.sensor.getType() == Sensor.TYPE_ORIENTATION) {
/*			
            Log.v("sensorOrientation",
                    "Azimuth:" + String.valueOf(event.values[0]) + ", " +
                    "Pitch:" + String.valueOf(event.values[1]) + ", " +
                    "Roll:" + String.valueOf(event.values[2]));
			*/
            mView.xrot = event.values[1];
            mView.zrot = event.values[0]-180;

            if(Math.abs(event.values[1]) > 150.0f){
				Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
				vibrator.vibrate(10);
            	
            }
            
            nowGravityVector[2] = Math.cos(event.values[1]/180 * Math.PI);

            
            
            
		}else if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
			float z_acc = event.values[2]/SensorManager.GRAVITY_EARTH ;
			
			z_acc -= this.nowGravityVector[2];
			
			if(Math.abs(z_acc) > 0.2f){
				nowScale = (float) (nowScale * Math.pow(Math.E, z_acc/2));
				if(nowScale > maxScale){
					nowScale = maxScale;
				}else if (nowScale < minScale){
					nowScale = minScale;
				}
				
				mView.xScall = nowScale;
				mView.yScall = nowScale;
				mView.zScall = nowScale;
				
			}

/*				
	            Log.v("sensorAccelerometer",
	                    "0:" + String.valueOf(event.values[0]) + ", " +
	                    "1:" + String.valueOf(event.values[1]) + ", " +
	                    "2:" + String.valueOf(event.values[2]));
*/				
			
		}
		
	}     

	/*    
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
	    	//xxx
    	   return true;
   
	    }
    };
*/



}

