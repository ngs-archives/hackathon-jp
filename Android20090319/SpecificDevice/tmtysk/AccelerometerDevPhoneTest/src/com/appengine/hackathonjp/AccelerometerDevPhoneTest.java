package com.appengine.hackathonjp;

import android.app.Activity;
import android.content.Context;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.FrameLayout;

public class AccelerometerDevPhoneTest extends Activity
{

	private SensorManager sensorManager;
	private MySensorListener mySensorListener;

	// should be >0
	private int dataSize = 300;

	private int accelIndex;
	private int orientationIndex;

	private float[][] accel;
	private float[][] orientation;

	private ChartView mChartView;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);

		resetData();
        sensorManager = (SensorManager)getSystemService(Context.SENSOR_SERVICE);

		FrameLayout layout = new FrameLayout(this);
		mChartView = new ChartView(this);
		mChartView.setDataSize(dataSize);
		layout.addView(mChartView);
		this.setContentView(layout);
		
		mySensorListener = new MySensorListener();
	}

	@Override
	protected void onResume()
	{
		super.onResume();
        sensorManager.registerListener(mySensorListener, 
        		SensorManager.SENSOR_ACCELEROMETER|SensorManager.SENSOR_ORIENTATION);
	}

	@Override
	protected void onPause()
	{
		super.onPause();
		sensorManager.unregisterListener(mySensorListener);
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu)
	{
		super.onCreateOptionsMenu(menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item)
	{
		super.onOptionsItemSelected(item);
		return true;
	}

	private void resetData() {
		accel = new float[dataSize][];
		orientation = new float[dataSize][];

		accelIndex = 0;
		orientationIndex = 0;
	}
	
	class MySensorListener implements SensorListener
	{
        public void onAccuracyChanged(int sensor, int accuracy)
        {
        }

		public void onSensorChanged(int sensor, float[] values)
		{
			storeSensorData(sensor, values);
			updateSensorData();
		}
		
		private void storeSensorData(int sensor, float[] values)
		{
			if (sensor != SensorManager.SENSOR_ACCELEROMETER
					&& sensor != SensorManager.SENSOR_ORIENTATION)
				return;
			
			if (sensor == SensorManager.SENSOR_ACCELEROMETER)
			{
				// should be synchronized?
				accel[accelIndex] = values.clone();
				accelIndex = (accelIndex + 1) % dataSize;
			} 
			else 
			{
				orientation[orientationIndex] = values;
				orientationIndex = (orientationIndex + 1) % dataSize;
			}
		}

		private void updateSensorData() {
			int tmpAccelIndex = accelIndex == 0 ? dataSize - 1 : accelIndex - 1;
			int tmpOrientIndex = orientationIndex == 0 ? dataSize - 1
					: orientationIndex - 1;
		
			if (accel[tmpAccelIndex] == null) return;
		
			if (accelIndex % 3 == 0) {
				mChartView.updateData(accelIndex, accel);
				mChartView.repaint();
			}
		}
	}
}