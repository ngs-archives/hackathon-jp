package jp.co.haw.android.example.shake;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;

import jp.co.haw.android.example.shake.worker.TaskSwitcher;
import android.app.Service;
import android.content.Intent;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.os.Handler;
import android.os.IBinder;
import android.widget.Toast;

public class ShakeDetector extends Service implements SensorListener {

	private SensorManager sensorManager;
	private static DecimalFormat format;
	static {
		format = new DecimalFormat();
		format.applyLocalizedPattern("#0.000");
	}
	
	private final static float SHAKE_STRONG = 20.0f;
	
	private TaskSwitcher taskSwitcher;
	
	private float[] currentOrientationValues = {0.0f, 0.0f, 0.0f};
	private float[] currentAccelerationValues = {0.0f, 0.0f, 0.0f};
	
	private boolean waitFlag = false;
	private ArrayList<Float> valueArray = new ArrayList<Float>();
	private Handler processHandler = new Handler();
	private Runnable processRunnable = new Runnable() {
		public void run() {
			waitFlag = false;
			executeShake();
		}
	};
	
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}
	
	@Override
	public void onCreate() {
		Toast.makeText(this, R.string.shake_agent_started, Toast.LENGTH_LONG).show();
		super.onCreate();
        // --- sensors
      sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
      sensorManager.registerListener(this, 
              SensorManager.SENSOR_ACCELEROMETER | 
              SensorManager.SENSOR_ORIENTATION,
              SensorManager.SENSOR_DELAY_FASTEST);
      taskSwitcher = new TaskSwitcher(this);
	}
	
	@Override
	public void onDestroy() {
		Toast.makeText(this, R.string.shake_agent_stopped, Toast.LENGTH_LONG);
		sensorManager.unregisterListener(this);
		super.onDestroy();
	}

	@Override
	public void onAccuracyChanged(int arg0, int arg1) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onSensorChanged(int sensor, float[] values) {
		switch (sensor) {
		case SensorManager.SENSOR_ACCELEROMETER:
			currentOrientationValues[0] = values[0] * 0.1f + currentOrientationValues[0] * (1.0f - 0.1f);
            currentOrientationValues[1] = values[1] * 0.1f + currentOrientationValues[1] * (1.0f - 0.1f);
            currentOrientationValues[2] = values[2] * 0.1f + currentOrientationValues[2] * (1.0f - 0.1f);

            currentAccelerationValues[0] = values[0] - currentOrientationValues[0];
            currentAccelerationValues[1] = values[1] - currentOrientationValues[1];
            currentAccelerationValues[2] = values[2] - currentOrientationValues[2];

            float targetValue =
                Math.abs(currentAccelerationValues[0]) +
                Math.abs(currentAccelerationValues[1]) +
                Math.abs(currentAccelerationValues[2]);

            if(targetValue > 12.0f) {
                if(!waitFlag) {
                    valueArray.clear();
                    valueArray.add(targetValue);
                    waitFlag = true;
                    processHandler.postDelayed(processRunnable, 300);
                } else {
                    valueArray.add(targetValue);
                }
            }

            default:
        }
		
	}
	
	private void executeShake() {
		Collections.sort(valueArray);
		float result = valueArray.get(valueArray.size() - 1);
		if(result > SHAKE_STRONG) {
			taskSwitcher.onShake();
		} else {
			taskSwitcher.onShake();
		}
	}

}
