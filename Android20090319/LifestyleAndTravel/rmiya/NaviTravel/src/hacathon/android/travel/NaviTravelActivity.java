package hacathon.android.travel;

import android.os.Bundle;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;

public class NaviTravelActivity extends MapActivity {

    //マップ初期値
    private static final int DEFAULT_LONGITUDE = 139729136;
    private static final int DEFAULT_LATITUDE = 35660519;
    private static final int ZOOM_LEVEL_DEFAULT = 7;

    private MapView mMap;
    private MapController mMapController;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        mMap = (MapView) findViewById(R.id.map);
        mMapController = mMap.getController();

        //中心座標の指定
        GeoPoint pt = new GeoPoint(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        mMapController.setCenter(pt);
        //ズームサイズの設定
        mMapController.setZoom(ZOOM_LEVEL_DEFAULT);
    }

    @Override
    protected boolean isRouteDisplayed() {
        return false;
    }
}