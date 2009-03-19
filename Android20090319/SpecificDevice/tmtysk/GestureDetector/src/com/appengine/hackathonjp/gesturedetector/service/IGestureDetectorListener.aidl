package com.appengine.hackathonjp.gesturedetector.service;

interface IGestureDetectorListener {

    /*
    * gestureType includes: ROTATE, SHAKE, CATCH, DROP
    * 
    */
    boolean onBasicGestureDetect(String gestureType);
}
