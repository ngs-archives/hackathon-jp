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
import java.io.InputStream;
import java.net.URI;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;

public class PostActivity extends Activity implements LocationListener {
	static final String TAG = "Ashiato";
	static final String API_URI = "http://hackathon-ashiato.appspot.com/ashiato";

	LocationManager locationManager;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.post);

		locationManager = (LocationManager)this.getSystemService(Context.LOCATION_SERVICE);
		locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 3000, 0, this);
	}

	public class DownloadTask extends AsyncTask<String, Integer, Bitmap> {
		private HttpClient mClient;
		private HttpGet mGetMethod;
		private PostActivity mActivity;

		public DownloadTask(PostActivity activity) {
			mActivity = activity;
			mClient = new DefaultHttpClient();
			mGetMethod = new HttpGet();
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
				Log.v(TAG, "send to server" + getGPSLocationString(location));

				//{"email": "hoge@example.com", "lat": "39.123", "lng": "139.123" }

				//				DownloadTask task = new DownloadTask(this);
//				task.execute(API_URI);
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
}
