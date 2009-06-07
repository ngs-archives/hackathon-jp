package jp.ac.takushoku.operation;

import java.util.List;


import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.VideoView;

public class Operation extends Activity implements SensorEventListener{
    /** Called when the activity is first created. */
	    
    private boolean mRegisteredSensor;
    private SensorManager mSensorManager;
    private TextView tv1,tv2,tv3;
    private float shoki = -1;

	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        tv1 = (TextView) findViewById(R.id.TextView01);
        tv2 = (TextView) findViewById(R.id.TextView02);
        tv3 = (TextView) findViewById(R.id.TextView03);
        mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);

    }
    
    @Override
	protected void onResume() {
		// TODO Auto-generated method stub
        Sensor sensor = mSensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
        mRegisteredSensor = mSensorManager.registerListener(this,sensor,SensorManager.SENSOR_DELAY_FASTEST);
        super.onResume();
	}

	@Override
	protected void onPause() {
		// TODO Auto-generated method stub
		 mSensorManager.unregisterListener(this);
		super.onStop();
	}

	@Override
	public void onAccuracyChanged(Sensor arg0, int arg1) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onSensorChanged(SensorEvent arg0) {
		// TODO Auto-generated method stub
		tv1.setText("Azimuth: "+arg0.values[0]);
		tv2.setText("Pitch: "+arg0.values[1]);
		tv3.setText("Roll: "+arg0.values[2]);

		
		/*つくりかけ
		if(shoki == -1){
			shoki = arg0.values[0];
		}
        if (arg0.sensor.getType() == Sensor.TYPE_ORIENTATION) {
        	if(arg0.values[0]-shoki > 20){
        		tv.setText("左"+(arg0.values[0]-shoki));
        	}
        	else if(arg0.values[0]-shoki < -20){
        		tv.setText("右"+(arg0.values[0]-shoki));
        	}
        	else{
        		tv.setText("とくになし");
        	}	
        }
        */
	}
}