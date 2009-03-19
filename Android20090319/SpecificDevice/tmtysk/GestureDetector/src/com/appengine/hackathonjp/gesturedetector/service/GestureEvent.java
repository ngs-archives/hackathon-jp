package com.appengine.hackathonjp.gesturedetector.service;

public interface GestureEvent {
	
	/**
	 * returns gesture start time
	 * @return
	 */
	public long getStartTime();
	
	/**
	 * returns gesture end time
	 * @return
	 */
	public long getEndTime();
}
