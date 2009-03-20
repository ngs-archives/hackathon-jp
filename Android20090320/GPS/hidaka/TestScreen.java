package android.Screen.TestView;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.SystemClock;
import android.telephony.TelephonyManager;
import android.widget.ImageView;
import android.widget.Toast;

public class TestScreen extends Activity implements LocationListener {
	private PendingIntent mAlarmSender; // Alarm用
	private Location mylocation; // Location保持変数
	private PersonInfo personInfo; // person情報
	public int m_range = 1000;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.main);
		mylocation = null;
		// メイン画像設定
		ImageView HelloWorldImageView = new ImageView(this);
		HelloWorldImageView.setImageResource(R.drawable.moshimoshi);
		setContentView(HelloWorldImageView);

		// 現在位置が変化に、メソッドが呼び出されように登録する。
		LocationManager l = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		l.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, this);
		// GPS情報のチェック
		//loadProviders();
		// Alarmを使用して現在値を送信処理
		mAlarmSender = PendingIntent.getService(TestScreen.this, 0, new Intent(
				TestScreen.this, AlarmService_Service.class), 0);
		long firstTime = SystemClock.elapsedRealtime();

		// Schedule the alarm!
		// AlarmManager am = (AlarmManager) getSystemService(ALARM_SERVICE);
		// これは前処理
		AlarmManager am = (AlarmManager) getSystemService(ALARM_SERVICE);
		// ここでアラーム設定をしている
		am.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, firstTime,
				30 * 1000, mAlarmSender);

		Toast.makeText(TestScreen.this, R.string.repeating_scheduled,
				Toast.LENGTH_LONG).show();
		// 小さなウィンドウで、暫くして消える

        TelephonyManager tm = (TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE);
        double a=Double.parseDouble(tm.getSimSerialNumber());
		//tm.getDeviceId()
		// Alarmを使用して現在値を受信処理　予定\\\\\
		// PersonInfo処理
		PersonInfo personInfo=new PersonInfo((double) 35.4324324, (double) 139,  (int) m_range,  (double) a);
		//personInfo = new PersonInfo((int)
		//mylocation.getLatitude(), (int) mylocation.getLongitude(), m_range);

		// PersonInfo格納
		personInfo.setPersonInfoList();
			/*
		 *///
	}

	@Override
	public void onLocationChanged(Location arg0) {
		// TODO 自動生成されたメソッド・スタブ
		// Locationが変更されたら書き換える
		mylocation = arg0;
		/*
		 * Toast.makeText(TestScreen.this, R.string.repeating_scheduled,
		 * Toast.LENGTH_LONG).show();
		 */
	}

	@Override
	public void onProviderDisabled(String provider) {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void onProviderEnabled(String provider) {
		// TODO 自動生成されたメソッド・スタブ

	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		// TODO 自動生成されたメソッド・スタブ

	}

	// 画像をURLから取得
	public void setImageFromUrl() {
		// http://stat.ameba.jp/user_images/e7/44/10038816756.jpg
	}

	public void loadProviders() {
		double latPoint = 35.631872;
		double lngPoint = 139.79561;
		if (mylocation != null) {
			/*
			 * latPoint = mylocation.getLatitude();
			 * lngPoint =mylocation.getLongitude();
			 */
		} else {
			mylocation.setLatitude(latPoint);
			mylocation.setLongitude(lngPoint);

		}

	}
}
