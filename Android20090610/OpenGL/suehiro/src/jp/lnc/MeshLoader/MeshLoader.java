package jp.lnc.MeshLoader;

import java.util.List;

import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;

public class MeshLoader extends Activity implements SensorEventListener{
    /** Called when the activity is first created. */
	
	GLCubeView mView;
    private Sensor orientationSensor;
	private Sensor accelerometerSensor;
	private SensorManager sm;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        mView = new GLCubeView( getApplication() );
        setContentView(mView);
        
        mView.setOnTouchListener(sheetTouchListener);

    
    }
    @Override
	protected void onResume() {
		// TODO Auto-generated method stub
    	sm = (SensorManager) getSystemService(SENSOR_SERVICE);
    	List<Sensor> sensorList;
    	sensorList = sm.getSensorList(Sensor.TYPE_ORIENTATION);
    	orientationSensor = sensorList.get(0);
    	sensorList = sm.getSensorList(Sensor.TYPE_ACCELEROMETER);
    	accelerometerSensor = sensorList.get(0);

        sm.registerListener(this, orientationSensor, SensorManager.SENSOR_DELAY_NORMAL);
        sm.registerListener(this, accelerometerSensor, SensorManager.SENSOR_DELAY_NORMAL);

		super.onResume();
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
	    	//xxx
    	   return true;
   
	    }
    };

	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		// TODO Auto-generated method stub
		if (event.sensor == orientationSensor) {
			if(-60<event.values[1] && event.values[1]<0){
    		
				mView.xrot -= 3;
    			//mView.yrot += (pre_x - x) / 2;
			}else if(-180<event.values[1]&&event.values[1]<-115){
    			mView.xrot += 3;
    			//mView.yrot += (pre_x - x) / 2;
			}else{
				//なにもなし
			}
		}
		
	}     
}