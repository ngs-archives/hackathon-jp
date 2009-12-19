package org.hackathon.ashiato;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

import java.io.InputStream;
import java.net.URI;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.HttpParams;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;

public class PostActivity extends Activity implements LocationListener, OnClickListener {
	static final String TAG = "Ashiato";
	static final String API_URI_GET = "http://hackathon-ashiato.appspot.com/ashi/get?";
	static final String API_URI_POST = "http://hackathon-ashiato.appspot.com/ashi/put?";
	LocationManager locationManager;
	Button button;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.post);
		
		button = (Button)findViewById(R.id.get_location);
		button.setOnClickListener(this);
		
		locationManager = (LocationManager)this.getSystemService(Context.LOCATION_SERVICE);
		locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 3000, 0, this);
	}

	public class DownloadTask extends AsyncTask<String, Integer, Bitmap> {
		private HttpClient mClient;
		private HttpGet mGetMethod;
//		private HttpGet mPostMethod;
		private PostActivity mActivity;

		public DownloadTask(PostActivity activity) {
			mActivity = activity;
			mClient = new DefaultHttpClient();
			mGetMethod = new HttpGet();
//			mPostMethod = new HttpPost();
		}

		Bitmap downloadImage(String uri) {
			try {
				mGetMethod.setURI(new URI(uri));
				HttpResponse resp = mClient.execute(mGetMethod);

				if (resp.getStatusLine().getStatusCode() < 400) {
					InputStream is = resp.getEntity().getContent();
					
					String tmp = convertStreamToString(is);
					Log.d(TAG, "hoge" + tmp);
//					Bitmap bit = createBitmap(is);
					is.close();
					return null;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			return null;
		}

		public String convertStreamToString(InputStream is) throws IOException {
			if (is != null) {
				StringBuilder sb = new StringBuilder();
				String line;

				try {
					BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
					while ((line = reader.readLine()) != null) {
						sb.append(line).append("\n");
					}
				} finally {
					is.close();
				}
				return sb.toString();
			} else {       
				return "";
			}
		}

		private Bitmap createBitmap(InputStream is) {
			return BitmapFactory.decodeStream(is);
		}

		// バックグラウンドで画像をダウンロードする
		@Override
		protected Bitmap doInBackground(String... params) {
			String uri = params[0];
			return downloadImage(uri);
		}

		// 画像を描画して、タイマーを停止する
		@Override
		protected void onPostExecute(Bitmap result) {
			// mActivity.setResultImage(result);
			// mActivity.stopTimer();
		}
	}
	
	long last = 0;
	//@Override
	public void onLocationChanged(Location location) {
		if ( location != null ) {
			if (System.currentTimeMillis() - last > 5000) {
				String request = API_URI_POST + "email=kazunori279@gmail.com&lat="
								+ String.valueOf(location.getLatitude())
								+ "&lng=" + String.valueOf(location.getLongitude());
				Log.v(TAG, "Send " + request);
				DownloadTask task = new DownloadTask(this);
				task.execute(request);
				last = System.currentTimeMillis();
			}
		}
	}

	//@Override
	public void onProviderDisabled(String provider) {
		// TODO Auto-generated method stub
		Log.v("gps", "onProviderDisabled");
	}

	//@Override
	public void onProviderEnabled(String provider) {
		// TODO Auto-generated method stub
		Log.v("gps", "onProviderEnabled");
	}

	//@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		// TODO Auto-generated method stub
		Log.v("gps", "onStatusChanged");
	}
	
	/**
	 * 
	 */
	private String getGPSLocationString(Location location) {
		String s;
		if (location == null) {
			s = "Location[unknown]\n";
		}
		else {
			//log(location.toString());
			s = String.format("%f,%f,%d,%s\n",
					location.getLatitude(), location.getLongitude(), location.getTime(), location.getProvider());
		}
		return s;
	}

	@Override
	public void onClick(View v) {
		String request = API_URI_GET + "email=kazunori279@gmail.com";
		Log.v(TAG, "Send " + request);
		DownloadTask task = new DownloadTask(this);
		task.execute(request);
	}
}
