package com.appengine.hackathonjp.gesturedetector.service;

public interface GestureDetectorListener {
	public enum BasicGestureType {
		ROTATE,
		SHAKE,
		DROP,
		CATCH,
	};
	
	public boolean onBasicGestureDetect(BasicGestureType type, GestureEvent event);
}
