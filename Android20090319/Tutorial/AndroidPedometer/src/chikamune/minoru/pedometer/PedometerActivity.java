package chikamune.minoru.pedometer;

import static java.lang.Math.abs;
import static java.lang.Math.pow;
import static java.lang.Math.sqrt;
import static java.util.Arrays.fill;
import android.app.Activity;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

public class PedometerActivity extends Activity {
    protected TextView stepsView;
    protected TextView gps;
    protected long steps;
    protected Vibrator vibrator;
    SensorManager sensorManager;
    protected Vibrator getVibrator() {
        if (vibrator == null) {
            vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
        }
        return vibrator;
    }
    protected SensorManager getSensorManager() {
        if (sensorManager == null) {
            sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        }
        return sensorManager;
    }
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        stepsView = (TextView) findViewById(R.id.steps);
        gps = (TextView) findViewById(R.id.gps);
        ((Button) findViewById(R.id.start)).setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                getSensorManager().registerListener(sensorListener, SensorManager.SENSOR_ACCELEROMETER);
                getVibrator().vibrate(100);
            }
        });
        ((Button) findViewById(R.id.stop)).setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                getSensorManager().unregisterListener(sensorListener);
                getVibrator().vibrate(100);
            }
        });
        ((Button) findViewById(R.id.reset_button)).setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                steps = 0;
                stepsView.setText(steps + " •à");
            }
        });
        getSensorManager().registerListener(sensorListener, SensorManager.SENSOR_ACCELEROMETER);
        LocationManager locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, new LocationListener() {
            public void onLocationChanged(Location location) {
                gps.setText("Œo“x : " + location.getLongitude() + "\n" + "ˆÜ“x : " + location.getLatitude());
            }
            public void onStatusChanged(String provider, int status, Bundle extras) {
            //                gps.setText("onStatusChanged");
            }
            public void onProviderEnabled(String provider) {
                gps.setText("onProviderEnabled " + provider);
            }
            public void onProviderDisabled(String provider) {
                gps.setText("onProviderDisabled " + provider);
            }
        });
    }
    protected SensorListener sensorListener = new SensorListener() {
        public void onSensorChanged(int sensor, float[] values) {
            if (SensorManager.SENSOR_ACCELEROMETER == sensor) {
                // http://lampwww.epfl.ch/~linuxsoft/android/android-0.9_beta/docs/reference/android/hardware/SensorManager.html#SENSOR_ACCELEROMETER
                // A constant describing an accelerometer. Sensor values are acceleration in the X, Y and Z axis,
                // where the X axis has positive direction toward the right side of the device,
                // the Y axis has positive direction toward the top of the device and
                // the Z axis has positive direction toward the front of the device.
                // The direction of the force of gravity is indicated by acceleration values in the X, Y and Z axes.
                // The typical case where the device is flat relative to the surface of the Earth appears as -STANDARD_GRAVITY in the Z axis and X and Z values close to zero.
                // Acceleration values are given in SI units (m/s^2)
                synchronized (PedometerActivity.class) {
                    if (isStep(values)) {
                        steps++;
                    }
                }
            }
        }
        public void onAccuracyChanged(int sensor, int accuracy) {}
    };
    int longRecentDatasIndex = 0;
    float[] longRecentDatas;
    int shortRecentDatasIndex = 0;
    float[] shortRecentDatas;
    long previousStep = System.currentTimeMillis();
    protected boolean isStep(float[] values) {
        float current = (float) sqrt(pow(values[3], 2) + pow(values[4], 2) + pow(values[5], 2));
        if (longRecentDatas != null) {
            longRecentDatas[longRecentDatasIndex] = current;
            if (longRecentDatasIndex == longRecentDatas.length - 1) {
                longRecentDatasIndex = 0;
            } else {
                longRecentDatasIndex++;
            }
        } else {
            longRecentDatas = new float[5];
            fill(longRecentDatas, current);
        }
        if (shortRecentDatas != null) {
            shortRecentDatas[shortRecentDatasIndex] = current;
            if (shortRecentDatasIndex == shortRecentDatas.length - 1) {
                shortRecentDatasIndex = 0;
            } else {
                shortRecentDatasIndex++;
            }
        } else {
            shortRecentDatas = new float[2];
            fill(shortRecentDatas, current);
        }
        stepsView.setText(+steps + " •à");
        if (abs(averagePower() - currentPower()) > 0.15 && (System.currentTimeMillis() - previousStep > 300)) {
            fill(longRecentDatas, currentPower());
            previousStep = System.currentTimeMillis();
            return true;
        } else {
            return false;
        }
    }
    protected float averagePower() {
        return average(longRecentDatas);
    }
    protected float currentPower() {
        return average(shortRecentDatas);
    }
    protected float average(float[] values) {
        float sum = 0;
        for (float value : values) {
            sum += value;
        }
        return sum / values.length;
    }
}