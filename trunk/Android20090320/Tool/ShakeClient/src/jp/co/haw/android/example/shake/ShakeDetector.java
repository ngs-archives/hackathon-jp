package jp.co.haw.android.example.shake;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;

import org.apache.http.conn.ManagedClientConnection;

import jp.co.haw.android.example.shake.Application.Apps;
import jp.co.haw.android.example.shake.worker.TaskSwitcher;
import android.app.Service;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

public class ShakeDetector extends Service implements SensorListener {

	private SensorManager sensorManager;
	private static DecimalFormat format;
    static boolean right = false;
    static boolean left = false;
    static boolean back = false;
    static boolean front = false;
    static long tmptime = 0;
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

            
			if (!right && currentAccelerationValues[0]<=-8){
				right = true;
				tmptime = new Date().getTime();
			} else if (!left && currentAccelerationValues[0]>=8){
				left = true;
				tmptime = new Date().getTime();
			} else if (!back && currentAccelerationValues[2]>=8){
				back = true;
				tmptime = new Date().getTime();
			} else if (!front && currentAccelerationValues[2]<=-8){
				front = true;
				tmptime = new Date().getTime();
			}
			if (tmptime != 0 && new Date().getTime() - tmptime <3000) {
				if (right && currentAccelerationValues[0]>=8){
					right = !right;
					tmptime = 0;
					//右にふられたので、右に振られた時にキックするものがあればキック。
					startApplication(0);
				} else if (left && currentAccelerationValues[0]<=-8){
					left = !left;
					tmptime = 0;
					//左にふられたので、左に振られた時にキックするものがあればキック。
					startApplication(1);
				} else if (back && currentAccelerationValues[2]<=-8){
					back = !back;
					tmptime = 0;
					//奥にふられたので、奥に振られた時にキックするものがあればキック。
					startApplication(2);
				} else if (front && currentAccelerationValues[2]>=8){
					front = !front;
					tmptime = 0;
					//手前にふられたので、手前に振られた時にキックするものがあればキック。
					startApplication(3);
				}
			} else {
				tmptime = 0;
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
	
	/*
	 * 毎回DBを読むのは電力がもったいないかもしれない
	 * 毎回読まないとサービスを再実行しないと更新が反映されない
	 */
	public void startApplication(int direction) {
		String[] proj = {Apps.CLASS};
		ContentResolver cr = getContentResolver();
		String[] args = {"" + direction};
		
        Cursor cur = cr.query(Apps.CONTENT_URI, proj, Apps.ACTION + " = ?", args, Apps.DEFAULT_SORT_ORDER);
        int classColumn = cur.getColumnIndexOrThrow(Apps.CLASS); 
        
        if (cur.moveToFirst()) {
        	// Get the field values
        	String clazz = cur.getString(classColumn);
        	Log.d("TEST", "clazz is " + clazz);
        	Intent i;
			try {
				i = new Intent(getApplicationContext(), Class.forName(clazz));
			} catch (ClassNotFoundException e) {
				return;
			}
        	startActivity(i);
        }
		
	}
}
