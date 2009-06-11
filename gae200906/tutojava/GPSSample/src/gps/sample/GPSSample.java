package gps.sample;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;

public class GPSSample extends MapActivity implements LocationListener {
	private final String strLat = "緯度 = ";
	private final String strLongi = "経度= ";
	// 地図の初期値
	static final int INITIAL_ZOOM_LEVE = 16;
	
	MapController mapController;
	LocationManager locationMrg;
    MapView mapView;

    TextView textLat;
    TextView textLongi;
    
    
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        //テキスト
        this.textLat = (TextView)findViewById(R.id.lat);
        this.textLongi = (TextView)findViewById(R.id.longi);
        
        this.mapView = (MapView) findViewById(R.id.mapview);
        this.mapView.setBuiltInZoomControls(true);
        
        //位置とズームレベルの初期状態を設定する
        this.mapController = mapView.getController();
        this.mapController.setZoom(INITIAL_ZOOM_LEVE);

        //位置情報取得用のクラス
        this.locationMrg = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
    }

    private void showPoint(){
    	StringBuilder sb = new StringBuilder();
    	GeoPoint p = mapView.getMapCenter();
    	sb.append(strLat);
    	sb.append(((double)p.getLatitudeE6()) / 1E6);
    	sb.append("\n");
    	sb.append(strLongi);
    	sb.append(((double)p.getLongitudeE6()) / 1E6);
    	this.textLat.setText(sb.toString());
    	
    }
    
	@Override
	protected boolean isRouteDisplayed() {
		return false;
	}

	@Override
	protected void onPause() {
		super.onPause();
		//位置情報通知の登録を解除する
		this.locationMrg.removeUpdates(this);
	}

	@Override
	protected void onResume() {
		super.onResume();
		
		//最後に取得した位置があれば表示する
		Location loc = this.locationMrg.getLastKnownLocation(LocationManager.GPS_PROVIDER);
		if( loc != null ){
			onLocationChanged(loc);
		}
		
        //現在位置が変化時に、メソッドが呼ばれるように登録する
        this.locationMrg.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, this);
        showPoint();
	}

	@Override
	public void onLocationChanged(Location arg0) {
		GeoPoint gp = new GeoPoint((int)(arg0.getLatitude() * 1E6), 
									(int)(arg0.getLongitude() * 1E6));
		this.mapController.animateTo(gp);
		Log.i("onLocation", gp.toString());
	}
	

	@Override
	public void onProviderDisabled(String arg0) {
	}

	@Override
	public void onProviderEnabled(String arg0) {
	}

	@Override
	public void onStatusChanged(String arg0, int arg1, Bundle arg2) {
	}
}