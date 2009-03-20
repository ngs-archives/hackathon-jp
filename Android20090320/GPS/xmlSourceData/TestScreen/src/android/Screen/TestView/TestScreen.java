package android.Screen.TestView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

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
import android.widget.TextView;
import android.widget.Toast;

public class TestScreen extends Activity implements LocationListener {
	private PendingIntent mAlarmSender; // Alarm用
	private Location mylocation; // Location保持変数
	private PersonInfo personInfo; // person情報
	public String m_range = "1000";

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// setContentView(R.layout.main);
		setContentView(R.layout.disply_view);
		mylocation = null;
		/*
		 * // メイン画像設定 ImageView HelloWorldImageView = new ImageView(this);
		 * HelloWorldImageView.setImageResource(R.drawable.moshimoshi);
		 * setContentView(HelloWorldImageView);
		 */
		// 現在位置が変化に、メソッドが呼び出されように登録する。
		LocationManager l = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		l.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, this);
		// GPS情報のチェック
		// loadProviders();
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

		// Alarmを使用して現在値を受信処理　予定\\\\\

		// PersonInfo処理
		/*
		 * personInfo = new PersonInfo((int) mylocation.getLatitude(), (int)
		 * mylocation.getLongitude(), m_range);
		 */
		/*
		 * String url =
		 * "http://android-scouter.appspot.com/data/?id=XXXXXX&geo_x=XX.XXXX&geo_y=XX.XXXX&range=1000"
		 * ; String param = ""; String st = new String(); try { st =
		 * httpGet(url, param); } catch (IOException e) { // TODO 自動生成された
		 * catchブロック e.printStackTrace(); }
		 */
		/*
		 * personInfo = new PersonInfo(); // PersonInfo格納
		 * personInfo.setPersonInfoList();
		 *///
	}

	public void upDateDisplay(String ipAddr, String port, String deviceId) {
		final TextView changeTextView01 = (TextView) findViewById(R.id.layout_textview01);
		changeTextView01.setText(ipAddr);
		final TextView changeTextView02 = (TextView) findViewById(R.id.layout_textview02);
		changeTextView02.setText(port);

		final TextView changeTextView03 = (TextView) findViewById(R.id.layout_textview03);
		changeTextView03.setText(deviceId);

	}

	public static String httpGet(String url, String getParam)
			throws IOException {

		// GET_URLの生成
		String getURL = url;
		if (getParam != null) {
			getURL += getParam;
		}

		// 返却する結果
		String result = null;

		DefaultHttpClient con = new DefaultHttpClient();
		HttpEntity res = con.execute(new HttpGet(getURL)).getEntity();

		InputStream input = res.getContent();
		InputStreamReader in = new InputStreamReader(input);

		BufferedReader reader = new BufferedReader(in);

		// 受信用バッファ
		StringBuffer sb = new StringBuffer();
		String str = null;

		// 結果の受信
		while ((str = reader.readLine()) != null) {
			sb.append(str);
		}

		// 文字列の取得
		result = sb.toString();

		// ストリームを閉じる
		reader.close();
		input.close();

		// 結果の返却
		return result;
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
			 * latPoint = mylocation.getLatitude(); lngPoint =
			 * mylocation.getLongitude();
			 */
		} else {
			mylocation.setLatitude(latPoint);
			mylocation.setLongitude(lngPoint);

		}

	}
}
