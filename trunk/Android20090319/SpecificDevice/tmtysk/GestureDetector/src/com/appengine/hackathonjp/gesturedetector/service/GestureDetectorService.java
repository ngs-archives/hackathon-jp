package com.appengine.hackathonjp.gesturedetector.service;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

public class GestureDetectorService extends Service {

	@Override
	public IBinder onBind(Intent intent) {
		// TODO Auto-generated method stub
		if (IGestureDetectorService.class.getName().equals(intent.getAction())) {
			return mGesture;
		}
		return null;
	}
	
	private final IGestureDetectorService.Stub mGesture = new IGestureDetectorService.Stub() {

		@Override
		public void registerGestureDetection(String detectionType,
				IGestureDetectorListener listener) throws RemoteException {
			// TODO Auto-generated method stub
			Log.d("Service", "register");
			listener.onBasicGestureDetect("");
		}

		@Override
		public void unregisterGestureDetection(String detectionType,
				IGestureDetectorListener listener) throws RemoteException {
			// TODO Auto-generated method stub
			
		}

		
	};

}
