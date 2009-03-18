package com.appengine.hackathonjp;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

import android.app.Activity;
import android.content.Context;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ToggleButton;
import android.widget.TextView;

public class GestureMeasure extends Activity
{
	private SensorManager sensorManager;
	private MySensorListener mySensorListener;
	private StringBuffer sensorValueHistory;
	private BufferedWriter bufferedWriter;

	private TextView accelView;
	private ToggleButton opButton;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);

		setContentView(R.layout.main);
        sensorManager = (SensorManager)getSystemService(Context.SENSOR_SERVICE);
		BufferedWriter bufferedWriter = null;
		mySensorListener = new MySensorListener();
		accelView = (TextView) findViewById(R.id.accelView);
		opButton = (ToggleButton) findViewById(R.id.opButton);
		opButton.setOnClickListener(new OnClickListener()
		{
            public void onClick(View v)
            {
            	if(((ToggleButton) v).isChecked())
            	{
            		sensorValueHistory = new StringBuffer();
            		sensorManager.registerListener(mySensorListener, 
                    		SensorManager.SENSOR_ACCELEROMETER|SensorManager.SENSOR_ORIENTATION);
            	}
            	else
            	{
            		try
            		{
            			saveMeasuredData();
            		}
            		catch(Exception e)
            		{
            		}
            		sensorManager.unregisterListener(mySensorListener);
            	}
            }
        }
		);
	}
	
	public void saveMeasuredData() throws Exception
	{
		try
		{
			bufferedWriter = new BufferedWriter(
					new FileWriter("/sdcard/"
							+ (new Long(System.currentTimeMillis()).toString()) + ".csv"));
			bufferedWriter.write(sensorValueHistory.toString(), 0, sensorValueHistory.length());
		} 
		finally
		{
			if(bufferedWriter != null)
			{
				try
				{
					bufferedWriter.close();
					bufferedWriter = null;
				}
				catch(IOException exception)
				{
				}
			}
		}
	}

	class MySensorListener implements SensorListener
	{
        public void onAccuracyChanged(int sensor, int accuracy)
        {
        }

		public void onSensorChanged(int sensor, float[] values)
		{
			if (sensor != SensorManager.SENSOR_ACCELEROMETER
					&& sensor != SensorManager.SENSOR_ORIENTATION)
				return;
			
			if (sensor == SensorManager.SENSOR_ACCELEROMETER)
			{
				sensorValueHistory.append(
						"accelero," + (new Float(values[0]).toString()) +
						"," + (new Float(values[1]).toString()) +
						"," + (new Float(values[2]).toString()) + "\n");
			} 
			else 
			{
				sensorValueHistory.append(
						"orientation," + (new Float(values[0]).toString()) +
						"," + (new Float(values[1]).toString()) +
						"," + (new Float(values[2]).toString()) + "\n");
			}
			accelView.setText(sensorValueHistory);
		}

	}
}