package com.appengine.hackathonjp.gesturedetector.service;

import android.R;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import android.widget.TextView;


public class TestGestureListenerActivity extends Activity {

	public TextView tv;
	IGestureDetectorService mService;

	private IGestureDetectorListener mListener = new IGestureDetectorListener() {

		@Override
		public boolean onBasicGestureDetect(String gestureType)
				throws RemoteException {
			// TODO Auto-generated method stub
			tv.setText("yes! takasu!");
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
				mService.registerGestureDetection("", mListener);
			} catch (RemoteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		@Override
		public void onServiceDisconnected(ComponentName name) {
			// TODO Auto-generated method stub

		}
	};

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);

		tv = new TextView(this);
		tv.setText("init");
		this.setContentView(tv);
		Log.d("TestService", "initialized activity");

		this.bindService(new Intent(IGestureDetectorService.class.getName()),
				mServiceConnection, Context.BIND_AUTO_CREATE);
		Log.d("TestService", "end bind");
	}

	@Override
	protected void onDestroy() {
		// TODO Auto-generated method stub
		super.onDestroy();

		this.unbindService(mServiceConnection);
	}

}
