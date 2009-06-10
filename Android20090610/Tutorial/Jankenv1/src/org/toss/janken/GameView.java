package org.toss.janken;

import java.text.DecimalFormat;

import android.app.Activity;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public class GameView extends Activity implements SensorListener{
	private Settings setting;
	View layout;
    TextView orientationValue;
    ImageView toss;
    SensorManager sensorManager;
    Button startButton;
    Button cancelButton;
    static DecimalFormat format;
    static {
        format = new DecimalFormat();
        format.applyLocalizedPattern("#0.000");
    }
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // --- views
        setContentView(R.layout.start);
        setting = new Settings(this); 
        layout = findViewById(R.id.layout);
        startButton = (Button) findViewById(R.id.Button01);
        cancelButton = (Button) findViewById(R.id.Button02);
        orientationValue=(TextView) findViewById(R.id.TextView01);
        toss = (ImageView)findViewById(R.id.ImageView01);
        startButton.setOnClickListener(new OnClickListener(){
			public void onClick(View v) {
				// TODO Auto-generated method stub
		        sensorManager.registerListener(GameView.this, 
		                SensorManager.SENSOR_ACCELEROMETER | 
		                SensorManager.SENSOR_ORIENTATION,
		                SensorManager.SENSOR_DELAY_FASTEST);
		        orientationValue.setText("端末を振ってください");
		        //orientationValue.setTextSize(15.0f);
		        startButton.setVisibility(View.GONE);
		        cancelButton.setVisibility(ViewGroup.VISIBLE);
			}        	
        });
        cancelButton.setOnClickListener(new OnClickListener(){
			public void onClick(View v) {
				// TODO Auto-generated method stub
				//サーバ側に
				finish();
			}        	
        });
        setting.set("userid",JankenApi.login(setting.get("nickname")));
        // --- sensors
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
    }

    Handler mJankenResultHandler = new Handler() {
    	public void handleMessage(Message msg) {
    		String result = (String)msg.obj;
    		Log.e("janken", "result="+result);
    		if (result.startsWith("W")) {
    			//勝った
    		} else if (result.startsWith("F")) {
    			//負けた？
    		} else if (result.startsWith("T")) {
    			//あいこ？
    		}
    	}
    };
    
    @Override
    protected void onStop() {
        sensorManager.unregisterListener(this);
        super.onStop();
    }
    @Override
    protected void onResume() {
        super.onResume();
        /*sensorManager.registerListener(this, 
                SensorManager.SENSOR_ACCELEROMETER | 
                SensorManager.SENSOR_ORIENTATION,
                SensorManager.SENSOR_DELAY_FASTEST);*/
    }
    private float[] currentOrientationValues = {0.0f, 0.0f, 0.0f};
    private float[] currentAccelerationValues = {0.0f, 0.0f, 0.0f};
    public void onSensorChanged(int sensor, float[] values) {
        switch(sensor) {
        case SensorManager.SENSOR_ACCELEROMETER:
            currentOrientationValues[0] = values[0] * 0.1f + currentOrientationValues[0] * (1.0f - 0.1f);
            currentOrientationValues[1] = values[1] * 0.1f + currentOrientationValues[1] * (1.0f - 0.1f);
            currentOrientationValues[2] = values[2] * 0.1f + currentOrientationValues[2] * (1.0f - 0.1f);
            currentAccelerationValues[0] = values[0] - currentOrientationValues[0];
            currentAccelerationValues[1] = values[1] - currentOrientationValues[1];
            currentAccelerationValues[2] = values[2] - currentOrientationValues[2];
            
            String hand = null;
            
            if(Math.abs(currentAccelerationValues[0]) > 10.0f) {
            	//チョキ
            	hand = JankenApi.JANKEN_CHOKI;
                toss.setImageResource(R.drawable.ch);
                sensorManager.unregisterListener(this);
                orientationValue.setText("ゲーム終了。しばらくお待ちください");
                cancelButton.setVisibility(View.GONE);
            } else if(Math.abs(currentAccelerationValues[1]) > 10.0f) {
            	//グー
            	hand = JankenApi.JANKEN_GU;
                toss.setImageResource(R.drawable.gu);
                sensorManager.unregisterListener(this);
                orientationValue.setText("ゲーム終了。しばらくお待ちください");
                cancelButton.setVisibility(View.GONE);
            } else if(Math.abs(currentAccelerationValues[2]) > 10.0f) {
            	//パー
            	hand = JankenApi.JANKEN_PAR;
                toss.setImageResource(R.drawable.pa);
                sensorManager.unregisterListener(this);
                orientationValue.setText("ゲーム終了。しばらくお待ちください");
                cancelButton.setVisibility(View.GONE);
            } else {
                //orientation.setText("");
            	//toss.setImageResource(R.drawable.gu);
            }
            if (hand!=null) {
            	//じゃんけん開始
	            JankenApi.attack(setting.get("userid"), hand);
	            new Thread(new ResultRequest(this, mJankenResultHandler)).start();
            }
            break;
        case SensorManager.SENSOR_ORIENTATION:
            //orientationValue.setText(convertFloatsToString(values));
            break;
        default:
        }
    }
    private String convertFloatsToString(float[] values) {
        return 
        String.valueOf(format.format(values[0])) + ", " + 
        String.valueOf(format.format(values[1])) + ", " + 
        String.valueOf(format.format(values[2]));
        
    }
	public void onAccuracyChanged(int sensor, int accuracy) {
		// TODO Auto-generated method stub
		
	}
}
