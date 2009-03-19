package com.appengine.hackathonjp.gesturedetector.service;

import java.util.ArrayList;
import java.util.List;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

/**
 * @author ogura
 * 
 * GestureDetectorService detects basic gesture
 * 
 * how to use:
 * 
 * GestureDetectorService.setGestureDetectorListener(new GestureDetectorListener() {
 *   public onBasicGestureDetect() {
 *   }
 * });
 * 
 * see below:
 * http://developerlife.com/tutorials/?p=356
 *
 */
public class GestureDetectorService extends Service {
	
	private static List<GestureDetectorListener> gestureDetectorListeners;
	
	static {
		gestureDetectorListeners = new ArrayList<GestureDetectorListener>();
	}
	
	public static void setGestureDetectorListener(GestureDetectorListener l) {
		gestureDetectorListeners.add(l);
	}

	@Override
	public IBinder onBind(Intent intent) {
		// TODO Auto-generated method stub
		return null;
	}
	

}
