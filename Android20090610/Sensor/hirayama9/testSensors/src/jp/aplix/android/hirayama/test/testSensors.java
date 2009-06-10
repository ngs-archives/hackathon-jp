package jp.aplix.android.hirayama.test;

import java.util.List;

import android.app.Activity;
import android.content.res.Resources;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.widget.TextView;

public class testSensors extends Activity implements SensorEventListener {
	private boolean mRegisteredSensor;
	private SensorManager mSensorManager;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		mRegisteredSensor = false;
		mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);

	}

	protected void onResume() {
		super.onResume();

		List<Sensor> sensors = mSensorManager
				.getSensorList(Sensor.TYPE_ALL);
		if (sensors.size() > 0) {
			Sensor sensor = sensors.get(0);
			mRegisteredSensor = mSensorManager.registerListener(this, sensor,
					SensorManager.SENSOR_DELAY_FASTEST);
		}

	}

	@Override
	protected void onPause() {
		if (mRegisteredSensor) {
			mSensorManager.unregisterListener(this);
			mRegisteredSensor = false;
		}

		super.onPause();
	}

	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		// TODO Auto-generated method stub
		StringBuffer buff = new StringBuffer();

		if (event.sensor.getType() == Sensor.TYPE_ORIENTATION) {
			Log.v("ORIENTATION", String.valueOf(event.values[0]) + ", "
					+ String.valueOf(event.values[1]) + ", "
					+ String.valueOf(event.values[2]));
			
			buff.append("ORIENTATION\n");			
			buff.append("Azimuth,rotation the Y axis").append(event.values[0]).append("\n");
			buff.append("Pitch, rotation around X axis (-180 to 180)").append(event.values[1]).append("\n");
			buff.append("Roll, rotation around Y axis (-90 to 90)").append(event.values[2]).append("\n");
			TextView tv = (TextView) findViewById(R.id.orient_counters);
			tv.setText(buff.toString());

		} 
		if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER){
			buff.append("ACCELEROMETER\n");			
			buff.append("X-axis").append(event.values[0]).append("\n");
			buff.append("Y-axis").append(event.values[1]).append("\n");
			buff.append("Z-axis").append(event.values[2]).append("\n");
			TextView tv = (TextView) findViewById(R.id.accero_counters);
			tv.setText(buff.toString());
			
		}

	}

}
