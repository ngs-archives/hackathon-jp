package com.appengine.hackathonjp;


import java.io.IOException;

import com.appengine.hackathonjp.gesturedetector.service.IGestureDetectorListener;
import com.appengine.hackathonjp.gesturedetector.service.IGestureDetectorService;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.widget.ImageView;
import android.widget.TextView;

public class showDirection extends Activity {
	
	private TextView tv;
	private ImageView iv;
	private Bitmap up,down,left,right,up_right,up_left,down_right,down_left;
	private MediaPlayer mp;
 
   
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.gestureview);   
        tv = (TextView)findViewById(R.id.text);
        iv = (ImageView)findViewById(R.id.view);
        this.bindService(new Intent(IGestureDetectorService.class.getName()),
			mServiceConnection, Context.BIND_AUTO_CREATE);
        
        Resources r = getResources();
        up = BitmapFactory.decodeResource(r, R.drawable.up);
        down = BitmapFactory.decodeResource(r, R.drawable.down);
        right = BitmapFactory.decodeResource(r, R.drawable.right);
        left = BitmapFactory.decodeResource(r, R.drawable.left);
        up_right = BitmapFactory.decodeResource(r, R.drawable.rightup);
        up_left = BitmapFactory.decodeResource(r, R.drawable.leftup);
        down_right = BitmapFactory.decodeResource(r, R.drawable.rightdown);
        down_left = BitmapFactory.decodeResource(r, R.drawable.leftdown);
        
        try {
        	mp = MediaPlayer.create(getApplicationContext(), R.raw.kamehameha);
			mp.prepare();
		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
    

	@Override
	protected void onDestroy() {
		// TODO Auto-generated method stub
		this.unbindService(mServiceConnection);
		super.onDestroy();
	}




	IGestureDetectorService mService;

	private IGestureDetectorListener mListener = new IGestureDetectorListener() {

		@Override
		public boolean onBasicGestureDetect(int gestureType)
				throws RemoteException {
			// TODO Auto-generated method stub
			if(gestureType == 1){
				iv.setImageBitmap(up);
				//mp.start();
			}
			else if(gestureType == 2){
				iv.setImageBitmap(up_right);
				
			}
			else if(gestureType == 3){
				iv.setImageBitmap(right);
			}
			else if(gestureType == 4){
				iv.setImageBitmap(down_right);
				
			}
			else if(gestureType == 5){
				iv.setImageBitmap(down);
				//mp.pause();
			}
			else if(gestureType == 6){
				iv.setImageBitmap(down_left);
				
			}
			else if(gestureType == 7){
				iv.setImageBitmap(left);
			}
			else if(gestureType == 8){
				iv.setImageBitmap(up_left);
			}
											
			return false;
		}

		@Override
		public IBinder asBinder() {
			// TODO Auto-generated method stub
			return null;
		}
	};

	private ServiceConnection mServiceConnection = new ServiceConnection() {

		@Override
		public void onServiceConnected(ComponentName name, IBinder service) {
			// TODO Auto-generated method stub
			mService = (IGestureDetectorService) IGestureDetectorService.Stub
					.asInterface(service);
			try {
				Log.d("GD", "register");
				for (int i = 1; i <= 8; ++i)
					mService.registerGestureDetection(i, mListener);
			} catch (RemoteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		@Override
		public void onServiceDisconnected(ComponentName name) {
			// TODO Auto-generated method stub
			try {
				Log.d("GD", "register");
				for (int i = 1; i <= 8; ++i)
					mService.unregisterGestureDetection(i, mListener);
			} catch (RemoteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	};

	@Override
	public boolean onKeyUp(int keyCode, KeyEvent event) {
		// TODO Auto-generated method stub
		return super.onKeyUp(keyCode, event);
	} 
	@Override
	protected void onPause() {
		// TODO Auto-generated method stub
		super.onPause();
	}

	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
	}

	@Override
	protected void onStart() {
		// TODO Auto-generated method stub
		super.onStart();
	}

	@Override
	protected void onStop() {
		// TODO Auto-generated method stub
		super.onStop();
	}
}