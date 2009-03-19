package jp.test2;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Random;

import android.app.Activity;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

public class Tarot2 extends Activity implements OnClickListener, Runnable, SensorListener {
	
	private Random mRandom = new Random();
	private Handler mHandler;
	private int mCount = 0;
	private int mIndex = 0;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        ImageButton button = (ImageButton)findViewById(R.id.ImageButton01);
        button.setOnClickListener(this);
        
        mHandler = new Handler();
        
        SensorManager m = (SensorManager)getSystemService(SENSOR_SERVICE);
        m.registerListener(this, SensorManager.SENSOR_ACCELEROMETER);
    }

    
    private Integer[] mImageIds = {
    		// R.drawable.card,
    		R.drawable.i1,
            R.drawable.i2,
            R.drawable.i3,
            R.drawable.i4,
            R.drawable.i5,
            R.drawable.i6,
            R.drawable.i7,
            R.drawable.i8,
            R.drawable.i9,
            R.drawable.i10,
            R.drawable.i11,
            R.drawable.i12,
            R.drawable.i13,
            R.drawable.i14,
            R.drawable.i15,
            R.drawable.i16,
            R.drawable.i17,
            R.drawable.i18,
            R.drawable.i19,
            R.drawable.i20,
            R.drawable.i21,
            R.drawable.i22,
            R.drawable.i23,
            R.drawable.i24,
            R.drawable.i25,
            R.drawable.i26,
            R.drawable.i27,
            R.drawable.i28,
            R.drawable.i29,
            R.drawable.i30,
            R.drawable.i31,
            R.drawable.i32,
            R.drawable.i33,
            R.drawable.i34,
            R.drawable.i35,
            R.drawable.i36,
            R.drawable.i37,
            R.drawable.i38,
            R.drawable.i39,
            R.drawable.i40,
            R.drawable.i41,
            R.drawable.i42,
            R.drawable.i43,
            R.drawable.i44,
            R.drawable.i45,
            R.drawable.i46,
            R.drawable.i47,
            R.drawable.i48,
            R.drawable.i49,
            R.drawable.i50,
            R.drawable.i51,
            R.drawable.i52,
            R.drawable.i53,
            R.drawable.i54,
            R.drawable.i55,
            R.drawable.i56,
            R.drawable.i57,
            R.drawable.i58,
            R.drawable.i59,
            R.drawable.i60,
            R.drawable.i61,
            R.drawable.i62,
            R.drawable.i63,
            R.drawable.i64,
            R.drawable.i65,
            R.drawable.i66,
            R.drawable.i67,
            R.drawable.i68,
            R.drawable.i69,
            R.drawable.i70,
            R.drawable.i71,
            R.drawable.i72,
            R.drawable.i73,
            R.drawable.i74,
            R.drawable.i75,
            R.drawable.i76,
            R.drawable.i77,
            //R.drawable.i78,
            R.drawable.i1r,
            R.drawable.i2r,
            R.drawable.i3r,
            R.drawable.i4r,
            R.drawable.i5r,
            R.drawable.i6r,
            R.drawable.i7r,
            R.drawable.i8r,
            R.drawable.i9r,
            R.drawable.i10r,
            R.drawable.i11r,
            R.drawable.i12r,
            R.drawable.i13r,
            R.drawable.i14r,
            R.drawable.i15r,
            R.drawable.i16r,
            R.drawable.i17r,
            R.drawable.i18r,
            R.drawable.i19r,
            R.drawable.i20r,
            R.drawable.i21r,
            R.drawable.i22r,
            R.drawable.i23r,
            R.drawable.i24r,
            R.drawable.i25r,
            R.drawable.i26r,
            R.drawable.i27r,
            R.drawable.i28r,
            R.drawable.i29r,
            R.drawable.i30r,
            R.drawable.i31r,
            R.drawable.i32r,
            R.drawable.i33r,
            R.drawable.i34r,
            R.drawable.i35r,
            R.drawable.i36r,
            R.drawable.i37r,
            R.drawable.i38r,
            R.drawable.i39r,
            R.drawable.i40r,
            R.drawable.i41r,
            R.drawable.i42r,
            R.drawable.i43r,
            R.drawable.i44r,
            R.drawable.i45r,
            R.drawable.i46r,
            R.drawable.i47r,
            R.drawable.i48r,
            R.drawable.i49r,
            R.drawable.i50r,
            R.drawable.i51r,
            R.drawable.i52r,
            R.drawable.i53r,
            R.drawable.i54r,
            R.drawable.i55r,
            R.drawable.i56r,
            R.drawable.i57r,
            R.drawable.i58r,
            R.drawable.i59r,
            R.drawable.i60r,
            R.drawable.i61r,
            R.drawable.i62r,
            R.drawable.i63r,
            R.drawable.i64r,
            R.drawable.i65r,
            R.drawable.i66r,
            R.drawable.i67r,
            R.drawable.i68r,
            R.drawable.i69r,
            R.drawable.i70r,
            R.drawable.i71r,
            R.drawable.i72r,
            R.drawable.i73r,
            R.drawable.i74r,
            R.drawable.i75r,
            R.drawable.i76r,
            R.drawable.i77r,
        //    R.drawable.i78,
    };
    
    
    private Integer[] mTextIds = {
            R.raw.i1,
            R.raw.i2,
            R.raw.i3,
            R.raw.i4,
            R.raw.i5,
            R.raw.i6,
            R.raw.i7,
            R.raw.i8,
            R.raw.i9,
            R.raw.i10,
            R.raw.i11,
            R.raw.i12,
            R.raw.i13,
            R.raw.i14,
            R.raw.i15,
            R.raw.i16,
            R.raw.i17,
            R.raw.i18,
            R.raw.i19,
            R.raw.i20,
            R.raw.i21,
            R.raw.i22,
            R.raw.i23,
            R.raw.i24,
            R.raw.i25,
            R.raw.i26,
            R.raw.i27,
            R.raw.i28,
            R.raw.i29,
            R.raw.i30,
            R.raw.i31,
            R.raw.i32,
            R.raw.i33,
            R.raw.i34,
            R.raw.i35,
            R.raw.i36,
            R.raw.i37,
            R.raw.i38,
            R.raw.i39,
            R.raw.i40,
            R.raw.i41,
            R.raw.i42,
            R.raw.i43,
            R.raw.i44,
            R.raw.i45,
            R.raw.i46,
            R.raw.i47,
            R.raw.i48,
            R.raw.i49,
            R.raw.i50,
            R.raw.i51,
            R.raw.i52,
            R.raw.i53,
            R.raw.i54,
            R.raw.i55,
            R.raw.i56,
            R.raw.i57,
            R.raw.i58,
            R.raw.i59,
            R.raw.i60,
            R.raw.i61,
            R.raw.i62,
            R.raw.i63,
            R.raw.i64,
            R.raw.i65,
            R.raw.i66,
            R.raw.i67,
            R.raw.i68,
            R.raw.i69,
            R.raw.i70,
            R.raw.i71,
            R.raw.i72,
            R.raw.i73,
            R.raw.i74,
            R.raw.i75,
            R.raw.i76,
            R.raw.i77,
            R.raw.i1r,
            R.raw.i2r,
            R.raw.i3r,
            R.raw.i4r,
            R.raw.i5r,
            R.raw.i6r,
            R.raw.i7r,
            R.raw.i8r,
            R.raw.i9r,
            R.raw.i10r,
            R.raw.i11r,
            R.raw.i12r,
            R.raw.i13r,
            R.raw.i14r,
            R.raw.i15r,
            R.raw.i16r,
            R.raw.i17r,
            R.raw.i18r,
            R.raw.i19r,
            R.raw.i20r,
            R.raw.i21r,
            R.raw.i22r,
            R.raw.i23r,
            R.raw.i24r,
            R.raw.i25r,
            R.raw.i26r,
            R.raw.i27r,
            R.raw.i28r,
            R.raw.i29r,
            R.raw.i30r,
            R.raw.i31r,
            R.raw.i32r,
            R.raw.i33r,
            R.raw.i34r,
            R.raw.i35r,
            R.raw.i36r,
            R.raw.i37r,
            R.raw.i38r,
            R.raw.i39r,
            R.raw.i40r,
            R.raw.i41r,
            R.raw.i42r,
            R.raw.i43r,
            R.raw.i44r,
            R.raw.i45r,
            R.raw.i46r,
            R.raw.i47r,
            R.raw.i48r,
            R.raw.i49r,
            R.raw.i50r,
            R.raw.i51r,
            R.raw.i52r,
            R.raw.i53r,
            R.raw.i54r,
            R.raw.i55r,
            R.raw.i56r,
            R.raw.i57r,
            R.raw.i58r,
            R.raw.i59r,
            R.raw.i60r,
            R.raw.i61r,
            R.raw.i62r,
            R.raw.i63r,
            R.raw.i64r,
            R.raw.i65r,
            R.raw.i66r,
            R.raw.i67r,
            R.raw.i68r,
            R.raw.i69r,
            R.raw.i70r,
            R.raw.i71r,
            R.raw.i72r,
            R.raw.i73r,
            R.raw.i74r,
            R.raw.i75r,
            R.raw.i76r,
            R.raw.i77r,
       //     R.raw.i78,
       
    };
    
	public void onClick(View v) {
		mCount = 1 + mRandom.nextInt(40);
		mHandler.postDelayed(this, 100);
	}

	private void setImage() {
        ImageButton button = (ImageButton)findViewById(R.id.ImageButton01);
        mIndex = mRandom.nextInt(mImageIds.length);
		button.setImageResource(mImageIds[mIndex]);
	}

	public void run() {
		setImage();		
		if ( --mCount > 0) {
			mHandler.postDelayed(this, 100);
		} else {
			TextView v = (TextView)findViewById(R.id.Result);
			v.setText(readString(mIndex));
			MediaPlayer p = MediaPlayer.create(this, R.raw.ta);
			p.start();
		}
	}

	public void onAccuracyChanged(int sensor, int accuracy) {
		// TODO Auto-generated method stub
		
	}
	
	public String readString(int index) {
		InputStreamReader r = 
			new InputStreamReader(getResources().openRawResource(mTextIds[index]));
		BufferedReader br = new BufferedReader(r);
		StringBuffer b = new StringBuffer();
		String s;
		try {
			while ( (s = br.readLine()) != null) {
				b.append(s);
				b.append("\n");
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return b.toString();
	}

	public void onSensorChanged(int sensor, float[] values) {
		if ( mCount <= 0 ) {
			if ( values[0] > 0.7 ) {
				mCount = 1 + mRandom.nextInt(40);
				run();
			}
		}
		
	}
}