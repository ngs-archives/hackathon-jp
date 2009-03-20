package net.grandnature.android.sdkwg.examples.sensor;

import java.text.DecimalFormat;

import android.app.Activity;
import android.graphics.Color;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

public class Main extends Activity implements SensorListener {
	View layout;
	TextView accelerometerValue;
	TextView orientationValue;
	TextView filteredAccelerationValue;
	TextView filteredOrientationValue;
	TextView orientation;
	SensorManager sensorManager;
	static DecimalFormat format;
	static {
		format = new DecimalFormat();
		format.applyLocalizedPattern("#0.000");
	}

	private boolean waitFlag = false;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// --- views
		setContentView(R.layout.main);
		layout = findViewById(R.id.layout);
		accelerometerValue = (TextView) findViewById(R.id.accelerometer_value);
		orientationValue = (TextView) findViewById(R.id.orientation_value);
		filteredAccelerationValue = (TextView) findViewById(R.id.filtered_acceleration_value);
		filteredOrientationValue = (TextView) findViewById(R.id.filtered_orientation_value);
		orientation = (TextView) findViewById(R.id.orientation);
		// --- sensors
		sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
	}

	@Override
	protected void onStop() {
		sensorManager.unregisterListener(this);
		super.onStop();
	}

	@Override
	protected void onResume() {
		super.onResume();
		sensorManager.registerListener(this, SensorManager.SENSOR_ACCELEROMETER
				| SensorManager.SENSOR_ORIENTATION, SensorManager.SENSOR_DELAY_FASTEST);
	}

	private float[] currentOrientationValues = { 0.0f, 0.0f, 0.0f };
	private float[] currentGravity = { 0.0f, 0.0f, 0.0f };
	private float[] divOrientationValues = { 0.0f, 0.0f, 0.0f };
	private float[] currentAccelerationValues = { 0.0f, 0.0f, 0.0f };
	private double theta = 0.0f;
	private double delta = 0.0f;
	private double currentTheta = 0.0f;

	public void onSensorChanged(int sensor, float[] values) {
		switch (sensor) {
		case SensorManager.SENSOR_ACCELEROMETER:
			accelerometerValue.setText(convertFloatsToString(values)); // 傾き（ハイカット）
			currentGravity = values;
			// currentOrientationValues.max
			float[] newOrientationValues = { 0.0f, 0.0f, 0.0f };
			newOrientationValues[0] = values[0] * 0.1f + currentOrientationValues[0]
					* (1.0f - 0.1f);
			newOrientationValues[1] = values[1] * 0.1f + currentOrientationValues[1]
					* (1.0f - 0.1f);
			newOrientationValues[2] = values[2] * 0.1f + currentOrientationValues[2]
					* (1.0f - 0.1f);
			divOrientationValues[0] = Math.abs(newOrientationValues[0]
					- currentOrientationValues[0]);
			divOrientationValues[1] = Math.abs(newOrientationValues[1]
					- currentOrientationValues[1]);
			divOrientationValues[2] = Math.abs(newOrientationValues[2]
					- currentOrientationValues[2]);

			// orientationValue.setText(convertFloatsToString(divOrientationValues));

			currentOrientationValues = newOrientationValues;
			float g = (float) Math.sqrt(Math.pow(values[0], 2)
					+ Math.pow(values[1], 2) + Math.pow(values[2], 2));
			theta = Math.asin(values[2] / g);

			delta = Math.acos(values[1] / g * Math.cos(theta));
			divOrientationValues[0] = (float) theta;
			divOrientationValues[1] = (float) delta;
			divOrientationValues[2] = 0.0f;
			//float[] hoge = { (float) theta, (float) delta };

			float divTheta = (float) Math.abs(theta - currentTheta);
			currentTheta = theta;
			orientationValue.setText(convertFloatsToString(divOrientationValues));
			orientation.setText(format.format(divTheta));
			currentAccelerationValues[0] = values[0] - currentOrientationValues[0];
			currentAccelerationValues[1] = values[1] - currentOrientationValues[1];
			currentAccelerationValues[2] = values[2] - currentOrientationValues[2];
			filteredAccelerationValue
					.setText(convertFloatsToString(currentAccelerationValues));
			filteredOrientationValue
					.setText(convertFloatsToString(currentOrientationValues));

			if (Math.abs(currentAccelerationValues[0]) > 3.0f) {
				if (divTheta > 0.4) {
					// orientation.setText("ひねり");
				} else {
					// orientation.setText("横");
				}
			} else {
				// orientation.setText("");
			}

			break;
		case SensorManager.SENSOR_ORIENTATION:
			break;
		default:
		}
	}

	private String convertFloatsToString(float[] values) {
		return String.valueOf(format.format(values[0])) + ", "
				+ String.valueOf(format.format(values[1])) + ", "
				+ String.valueOf(format.format(values[2]));

	}

	public void onAccuracyChanged(int sensor, int accuracy) {

	}

}