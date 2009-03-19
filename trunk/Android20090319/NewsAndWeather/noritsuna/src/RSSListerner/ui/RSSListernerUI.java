package RSSListerner.ui;

import java.text.DecimalFormat;

import android.app.Activity;
import android.content.res.Configuration;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.widget.LinearLayout;
import android.widget.TextView;

public class RSSListernerUI extends Activity implements SensorListener {
	
	private GestureDetector gd;

	private LinearLayout baseView;
	
	private TextView allowView;
	private TextView sensorView;
	private TextView orientationView;
	
    private SensorManager sensorManager;
    static DecimalFormat format;
    static {
        format = new DecimalFormat();
        format.applyLocalizedPattern("#0.000");
    }
	
	
	private FlingInfo flingInfo = new FlingInfo();
	class FlingInfo {
		
		public Allow allow;
		public ShuffleState shuffle;
		public boolean isFling = true;
		
	};
		
	
    // 必要な操作
    // 前と後ろ
    	// サイト自体
    // シャッフル
    	// ボリューム
    // 一時停止（終了）
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        allowView = (TextView)findViewById(R.id.allow_view);
        sensorView = (TextView)findViewById(R.id.sensor_view);
        orientationView = (TextView)findViewById(R.id.orientation_view);
        
        baseView = (LinearLayout)findViewById(R.id.base_view);
        baseView.setOnTouchListener(new OnTouchListener() {

			@Override
			public boolean onTouch(View v, MotionEvent event) {
			    return gd.onTouchEvent(event);
			}
        	
        });
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        
        gd = new GestureDetector(new GestureDetector.OnGestureListener() {
			@Override
			public boolean onFling(MotionEvent e1, MotionEvent e2,
			     float velocityX, float velocityY) {
				allowView.setText(flingInfo.allow.toString());
				
				flingInfo.isFling = true;
				onAllow(flingInfo.allow);

			    return false;
			}
				
			@Override
			public boolean onDown(MotionEvent e) {
			    return true;
			}
			@Override
			public void onLongPress(MotionEvent e) {
			}
			@Override
			public boolean onScroll(MotionEvent e1, MotionEvent e2,
			     float distanceX, float distanceY) {
				if(!flingInfo.isFling) {
					return true;
				}
				flingInfo.isFling = false;
				if(Math.abs(distanceX) > Math.abs(distanceY)) {
					if(distanceX > 0.0) {
						flingInfo.allow = Allow.LEFT;
					} else {
						flingInfo.allow = Allow.RIGTH;
					}
				} else {
					if(distanceY > 0.0) {
						flingInfo.allow = Allow.UP;
					} else {
						flingInfo.allow = Allow.DOWN;
					}
				}
			    return true;
			}
			@Override
			public void onShowPress(MotionEvent e) {
			}
			@Override
			public boolean onSingleTapUp(MotionEvent e) {
			    return false;
			}
        });
        
    }
    
    @Override
    protected void onStop() {
        sensorManager.unregisterListener((SensorListener) this);
        super.onStop();
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        sensorManager.registerListener(this, 
                SensorManager.SENSOR_ACCELEROMETER | 
                SensorManager.SENSOR_ORIENTATION,
                SensorManager.SENSOR_DELAY_FASTEST);
    }
    
    /**
     * 江川さんのコードのぱくり
     * http://www.grandnature.net/blog/archives/2009/02/androidt2.html
     */
    private float[] currentOrientationValues = {0.0f, 0.0f, 0.0f};
    private float[] currentAccelerationValues = {0.0f, 0.0f, 0.0f};
    public void onSensorChanged(int sensor, float[] values) {
        switch(sensor) {
        case SensorManager.SENSOR_ACCELEROMETER:
        	//sensorView.setText(convertFloatsToString(values));
            // 傾き（ハイカット）
            currentOrientationValues[0] = values[0] * 0.1f + currentOrientationValues[0] * (1.0f - 0.1f);
            currentOrientationValues[1] = values[1] * 0.1f + currentOrientationValues[1] * (1.0f - 0.1f);
            currentOrientationValues[2] = values[2] * 0.1f + currentOrientationValues[2] * (1.0f - 0.1f);
            // 加速度（ローカット）
            currentAccelerationValues[0] = values[0] - currentOrientationValues[0];
            currentAccelerationValues[1] = values[1] - currentOrientationValues[1];
            currentAccelerationValues[2] = values[2] - currentOrientationValues[2];
            //sensorView.setText(convertFloatsToString(currentAccelerationValues));
            orientationView.setText(convertFloatsToString(currentOrientationValues));
            // 振ってる？　絶対値（あるいは２乗の平方根）の合計がいくつ以上か？
            float targetValue = 
                Math.abs(currentAccelerationValues[0]) + 
                Math.abs(currentAccelerationValues[1]) +
                Math.abs(currentAccelerationValues[2]);
            if(targetValue > 22.0f) {
            	if(flingInfo.shuffle == ShuffleState.STILL) {
                	flingInfo.shuffle = ShuffleState.SHUFFLING;
                	sensorView.append("::Shuffle!!!");
                	onShuffle();
            	}
            } else if(targetValue < 0.3f) { 
            	if(flingInfo.shuffle != ShuffleState.STILL) {
                	sensorView.append("::STILL");
                	flingInfo.shuffle = ShuffleState.STILL;
            	}
            }
            // かたむきは？３つの絶対値（あるいは２乗の平方根）のうちどれがいちばんでかいか？
            if(Math.abs(currentOrientationValues[0]) > 7.0f) {
            	orientationView.append("::横");
            } else if(Math.abs(currentOrientationValues[1]) > 7.0f) {
            	orientationView.append("::縦");
            } else if(Math.abs(currentOrientationValues[2]) > 7.0f) {
            	orientationView.append("::水平");
            } else {
            	orientationView.append("::null");
            }
            break;
        case SensorManager.SENSOR_ORIENTATION:
        	//sensorView.setText(convertFloatsToString(values));
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
    @Override
    public void onAccuracyChanged(int sensor, int accuracy) {
        
    }
    
    
    
	private void onAllow(Enum allow) {
		// TODO Auto-generated method stub
		
	}
	private void onShuffle() {
		// TODO Auto-generated method stub
		
	}

}