package com.appengine.hackathonjp.gesturedetector.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

public class GestureDetectorService extends Service {
	
	Map<String, List<IGestureDetectorListener>> mListeners;
	
	@Override
	public void onCreate() {
		super.onCreate();
		
		this.mListeners = new HashMap<String, List<IGestureDetectorListener>>();
	}

	@Override
	public void onDestroy() {
		// TODO Auto-generated method stub
		super.onDestroy();
	}

	@Override
	public void onStart(Intent intent, int startId) {
		super.onStart(intent, startId);
		
	}

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
			Log.d("GestureDetectorService", "register: " + detectionType);
			if (!mListeners.containsKey(detectionType) && mListeners.get(detectionType) == null) {
				mListeners.put(detectionType, new ArrayList<IGestureDetectorListener>());
			}
			mListeners.get(detectionType).add(listener);
		}

		@Override
		public void unregisterGestureDetection(String detectionType,
				IGestureDetectorListener listener) throws RemoteException {
			if (mListeners.containsKey(detectionType) && mListeners.get(detectionType) != null) {
				for (IGestureDetectorListener l : mListeners.get(detectionType)) {
					if (l == listener)
						mListeners.get(detectionType).remove(listener);
				}
			}
		}

		
	};

}
