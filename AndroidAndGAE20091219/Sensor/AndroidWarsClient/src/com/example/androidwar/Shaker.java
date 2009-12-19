/***
	Copyright (c) 2008-2009 CommonsWare, LLC
	
	Licensed under the Apache License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may obtain
	a copy of the License at
		http://www.apache.org/licenses/LICENSE-2.0
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
 */

package com.example.androidwar;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.SystemClock;

public class Shaker {
  private SensorManager mgr = null;
  private long lastShakeTimestamp = 0;
  private double threshold = 1.0d;
  private long gap = 0;
  private Shaker.Callback cb = null;
  
  public Shaker(Context ctxt, double threshold, long gap, Shaker.Callback cb) {
    this.threshold = threshold * threshold;
    this.threshold = this.threshold * SensorManager.GRAVITY_EARTH * SensorManager.GRAVITY_EARTH;
    
    this.gap = gap;
    this.cb = cb;

    mgr = (SensorManager) ctxt.getSystemService(Context.SENSOR_SERVICE);
    mgr.registerListener(listener, mgr.getDefaultSensor(Sensor.TYPE_ACCELEROMETER), SensorManager.SENSOR_DELAY_UI);
  }

  public void close() {
    mgr.unregisterListener(listener);
  }

  private void isShaking(int power) {
    long now = SystemClock.uptimeMillis();

    if (lastShakeTimestamp == 0) {
      lastShakeTimestamp = now;

      if (cb != null) {
        cb.shakingStarted(power);
      }
    } else {
      lastShakeTimestamp = now;
    }
  }

  private void isNotShaking() {
    long now = SystemClock.uptimeMillis();

    if (lastShakeTimestamp > 0) {
      if (now - lastShakeTimestamp > gap) {
        lastShakeTimestamp = 0;

        if (cb != null) {
          cb.shakingStopped();
        }
      }
    }
  }

  public interface Callback {
    void shakingStarted(int power);

    void shakingStopped();
  }

  
  private SensorEventListener listener = new SensorEventListener() {
    public void onSensorChanged(SensorEvent e) {
      if (e.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
        double netForce = e.values[SensorManager.DATA_X] * e.values[SensorManager.DATA_X];

        netForce += e.values[SensorManager.DATA_Y] * e.values[SensorManager.DATA_Y];
        netForce += e.values[SensorManager.DATA_Z] * e.values[SensorManager.DATA_Z];

        if (threshold < netForce) {
          if(Math.random() > 0.9){
            isShaking((int)(netForce * Math.random() * 1000000));            
          }else{
            isShaking((int)netForce);            
          }
        } else {
          isNotShaking();
        }
      }
    }

    public void onAccuracyChanged(Sensor sensor, int accuracy) {
      // unused
    }
  };
}