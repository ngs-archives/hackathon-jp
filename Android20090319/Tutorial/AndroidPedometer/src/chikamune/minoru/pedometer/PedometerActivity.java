package chikamune.minoru.pedometer;

import java.util.Arrays;
import android.app.Activity;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

public class PedometerActivity extends Activity {
    protected TextView stepsView;
    protected long steps;
    protected Vibrator vibrator;
    SensorManager sensorManager;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        stepsView = (TextView) findViewById(R.id.steps);
        handleSystemService();
        //        ((TextView) findViewById(R.id.title)).setGravity();
        ((Button) findViewById(R.id.start)).setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                sensorManager.registerListener(sensorListener, SensorManager.SENSOR_ACCELEROMETER);
                vibrator.vibrate(100);
            }
        });
        ((Button) findViewById(R.id.stop)).setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                sensorManager.unregisterListener(sensorListener);
                vibrator.vibrate(100);
            }
        });
        ((Button) findViewById(R.id.reset_button)).setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                steps = 0;
                stepsView.setText(steps + " •à");
                vibrator.vibrate(100);
            }
        });
        sensorManager.registerListener(sensorListener, SensorManager.SENSOR_ACCELEROMETER);
        vibrator.vibrate(100);
        //            LocationManager locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
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
                        vibrator.vibrate(30);
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
        float current = (float) Math.pow((power(values[3]) + power(values[4]) + power(values[5])), 1.0 / 3.0);
        if (longRecentDatas != null) {
            longRecentDatas[longRecentDatasIndex] = current;
            if (longRecentDatasIndex == longRecentDatas.length - 1) {
                longRecentDatasIndex = 0;
            } else {
                longRecentDatasIndex++;
            }
        } else {
            longRecentDatas = new float[5];
            Arrays.fill(longRecentDatas, current);
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
            Arrays.fill(shortRecentDatas, current);
        }
        stepsView.setText(//values[0]
                //                + "\n"
                //                + values[1]
                //                + "\n"
                //                + values[2]
                //                + "\n"
                //                +values[3]
                //                        + "\n"
                //                        + values[4]
                //                        + "\n"
                //                        + values[5]
                //                        + "\n----------\n"
                averagePower()
                        + " ave"
                        + "\n"
                        + currentPower()
                        + " current"
                        + "\n"
                        + Math.abs(averagePower() - currentPower())
                        + " "
                        + "\n----------\n"
                        + steps
                        + " •à");
        if (Math.abs(averagePower() - currentPower()) > 0.1 /*&& (System.currentTimeMillis() - previousStep > 500)*/) {
            Arrays.fill(longRecentDatas, currentPower());
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
    protected static float power(float value) {
        return value * value;
    }
    protected void handleSystemService() {
    //        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
    //        Notification notification = new Notification(R.drawable.icon, "notified by M.Chikamune", System.currentTimeMillis());
    //        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, new Intent(this, PedometerActivity.class), 0);
    //        notification.setLatestEventInfo(this, // the context to use
    //                "notify title",
    //                // the title for the notification
    //                "abc", // the details to display in the notification
    //                contentIntent); // the contentIntent (see above)
    //        notificationManager.notify(0, notification);
    //
    //
    //        // The top-level window manager in which you can place custom windows. The returned object is a WindowManager.
    //        WindowManager windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
    //        // A LayoutInflater for inflating layout resources in this context.
    //        LayoutInflater layoutInflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
    //        // A ActivityManager for interacting with the global activity state of the system.
    //        ActivityManager activityManager = (ActivityManager) getSystemService(ACTIVITY_SERVICE);
    //        // A PowerManager for controlling power management.
    //        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
    //        // A AlarmManager for receiving intents at the time of your choosing.
    //        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
    //        // A NotificationManager for informing the user of background events.
    //        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
    //        Notification notification = new Notification(R.drawable.icon, "notified by M.Chikamune", System.currentTimeMillis());
    //        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, new Intent(this, PedometerActivity.class), 0);
    //        notification.setLatestEventInfo(this, // the context to use
    //                "notify title",
    //                // the title for the notification
    //                "abc", // the details to display in the notification
    //                contentIntent); // the contentIntent (see above)
    //        notificationManager.notify(0, notification);
    //        // A KeyguardManager for controlling keyguard.
    //        KeyguardManager keyguardManager = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
    //        // A LocationManager for controlling location (e.g., GPS) updates.
    //        LocationManager locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
    //        // A SearchManager for handling search.
    //        SearchManager searchManager = (SearchManager) getSystemService(SEARCH_SERVICE);
    //        // A Vibrator for interacting with the vibrator hardware.
    //        Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
    //        vibrator.vibrate(1000);
    //        // A ConnectivityManager for handling management of network connections.
    //        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
    //        // A WifiManager for management of Wi-Fi connectivity.        
    //        WifiManager wifiManager = (WifiManager) getSystemService(WIFI_SERVICE);
    }
}