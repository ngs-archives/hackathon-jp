package com.appengine.hackathonjp.gesturedetector.service;

import com.appengine.hackathonjp.gesturedetector.service.IGestureDetectorListener;

interface IGestureDetectorService {
    /*
     * see IGestureDetectorListener
     */
    void registerGestureDetection(String detectionType, IGestureDetectorListener listener);
    void unregisterGestureDetection(String detectionType, IGestureDetectorListener listener);
}
