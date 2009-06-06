package android.social;

import android.content.Context;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapView;

public class MapLocationViewer extends LinearLayout {
	private MapLocationOverlay overlay;
    private MapLocation location;
    private MapView mapView;
    
	public MapLocationViewer(Context context, AttributeSet attrs) {
		super(context, attrs);
		init();
	}

	public MapLocationViewer(Context context) {
		super(context);
		init();
	}

	public void init() {		
		mapView = new MapView(getContext(),"06xfgZvJ10yyoRUHIUa53fOpREru9suUixCLiDQ"); // for Nao
//		mapView = new MapView(getContext(),"0yxW-iQsfNvmUR8fZff23iyg5BUeIcHpH2qx3Qg"); // for Yoichiro

        mapView.setLayoutParams(new MapView.LayoutParams(MapView.LayoutParams.FILL_PARENT, MapView.LayoutParams.FILL_PARENT, 0, 0, MapView.LayoutParams.BOTTOM));
		mapView.setEnabled(true);
		mapView.setClickable(true);
		addView(mapView);
    	mapView.getController().setZoom(16);

		overlay = new MapLocationOverlay(this);
		mapView.getOverlays().add(overlay);
		LinearLayout zoomControls = (LinearLayout)mapView.getZoomControls();
		zoomControls.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.FILL_PARENT, LinearLayout.LayoutParams.FILL_PARENT));
		zoomControls.setGravity(Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL);
        mapView.addView(zoomControls);
	}

	public void setInfo(String comment, double latitude, double longitude) {
		mapView.getController().setCenter(new GeoPoint((int)(latitude*1e6),(int)(longitude*1e6)));
		location = new MapLocation(comment, latitude, longitude);
	}
	
	public MapLocation getLocation() {
		return location;
	}

	public MapView getMapView() {
		return mapView;
	}
}
