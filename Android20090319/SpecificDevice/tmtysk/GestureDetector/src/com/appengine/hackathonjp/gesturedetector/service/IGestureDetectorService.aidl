package com.appengine.hackathonjp.gesturedetector.service;

import com.appengine.hackathonjp.gesturedetector.service.IGestureDetectorListener;

interface IGestureDetectorService {
    /*
     * see IGestureDetectorListener
     */
    void registerGestureDetection(int detectionType, IGestureDetectorListener listener);
    void unregisterGestureDetection(int detectionType, IGestureDetectorListener listener);
}
