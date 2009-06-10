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
				.getSensorList(Sensor.TYPE_ORIENTATION);
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
		if (event.sensor.getType() == Sensor.TYPE_ORIENTATION) {
			// values[0]:
			// Azimuth, angle between the magnetic north direction and the Y
			// axis,
			// around the Z axis (0 to 359). 0=North, 90=East, 180=South,
			// 270=West
			// values[1]:
			// Pitch, rotation around X axis (-180 to 180),
			// with positive values when the z-axis moves toward the y-axis.
			// values[2]:
			// Roll, rotation around Y axis (-90 to 90),
			// with positive values when the x-axis moves away from the z-axis.
			Log.v("ORIENTATION", String.valueOf(event.values[0]) + ", "
					+ String.valueOf(event.values[1]) + ", "
					+ String.valueOf(event.values[2]));
			StringBuffer buff = new StringBuffer();
			buff.append("ORIENTATION\n");
			
			buff.append("Azimuth, angle between the magnetic north direction and the Y axis").append(event.values[0]).append("\n");
			buff.append("Pitch, rotation around X axis (-180 to 180)").append(event.values[1]).append("\n");
			buff.append("Roll, rotation around Y axis (-90 to 90)").append(event.values[2]).append("\n");
			TextView tv = (TextView) findViewById(R.id.counters);
			tv.setText(buff.toString());

		}

	}

}
