package com.appengine.hackathonjp;

import org.openintents.hardware.SensorManagerSimulator;
import org.openintents.provider.Hardware;

import android.app.Activity;
import android.content.Intent;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.FrameLayout;
import android.widget.TextView;

public class AccelerometerTest extends Activity implements SensorListener {

	private static final int SETTING_ID = 0;

	private SensorManagerSimulator mSensorManager;

	// should be >0
	private int dataSize = 300;

	private int accelIndex;
	private int orientationIndex;

	private float[][] accel;
	private float[][] orientation;

	private TextView mAccelText;
	private ChartView mChartView;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
//		setContentView(R.layout.main);

		resetData();

		Hardware.mContentResolver = this.getContentResolver();
		SensorManager systemSensorManager = (SensorManager) this
				.getSystemService(SENSOR_SERVICE);
		this.mSensorManager = new SensorManagerSimulator(systemSensorManager);
		
//		mAccelText = (TextView) this.findViewById(R.id.accel_text);
		FrameLayout layout = new FrameLayout(this);
		mChartView = new ChartView(this);
		mChartView.setDataSize(dataSize);
		layout.addView(mChartView);
		this.setContentView(layout);
	}

	@Override
	protected void onResume() {
		super.onResume();

//		Intent intent = new Intent(Intent.ACTION_VIEW, Hardware.Preferences.CONTENT_URI);
//		this.startActivity(intent);

//		this.mSensorManager.unregisterListener(this);
		SensorManagerSimulator.connectSimulator();
		mSensorManager.registerListener(this,
				SensorManager.SENSOR_ACCELEROMETER
						| SensorManager.SENSOR_ORIENTATION,
				SensorManager.SENSOR_DELAY_FASTEST);
	}

	@Override
	protected void onPause() {
		super.onPause();

		mSensorManager.unregisterListener(this);
	}
	
	

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);
		
		menu.add(0, SETTING_ID, 0, R.string.setting_sensor_simulator);
		
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		super.onOptionsItemSelected(item);
		
		if (item.getItemId() == SETTING_ID) {
			Intent intent = new Intent(Intent.ACTION_VIEW, Hardware.Preferences.CONTENT_URI);
			this.startActivity(intent);
		}
		
		return true;
	}

	@Override
	public void onAccuracyChanged(int arg0, int arg1) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onSensorChanged(int sensor, float[] values) {
		storeSensorData(sensor, values);

		updateSensorData();
	}

	private void resetData() {
		accel = new float[dataSize][];
		orientation = new float[dataSize][];

		accelIndex = 0;
		orientationIndex = 0;
	}

	private void storeSensorData(int sensor, float[] values) {

		if (sensor != SensorManager.SENSOR_ACCELEROMETER
				&& sensor != SensorManager.SENSOR_ORIENTATION)
			return;

		if (sensor == SensorManager.SENSOR_ACCELEROMETER) {
			// should be synchronized?
			accel[accelIndex] = values.clone();
			accelIndex = (accelIndex + 1) % dataSize;
		} else {
			orientation[orientationIndex] = values;
			orientationIndex = (orientationIndex + 1) % dataSize;
		}
		

	}

	private void updateSensorData() {
		int tmpAccelIndex = accelIndex == 0 ? dataSize - 1 : accelIndex - 1;
		int tmpOrientIndex = orientationIndex == 0 ? dataSize - 1
				: orientationIndex - 1;
		
		if (accel[tmpAccelIndex] == null)
			return;
		
//		mAccelText.setText("accel:" + accel[tmpAccelIndex][0] + ","tmpOrientIndex
//				+ accel[tmpAccelIndex][1] + "," + accel[tmpAccelIndex][2]);
		if (accelIndex % 10 == 0) {
			this.mChartView.updateData(accelIndex, accel);
			this.mChartView.repaint();
		}
	}
}