package android.social;

import java.util.StringTokenizer;

import android.os.Bundle;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;

public class MapViewerActivity extends MapActivity
{
	/** Called when the activity is first created. */
  @Override
  public void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.map);
      
      MapView mapView = (MapView)findViewById(R.id.mapview);
      MapController mapCtrl = mapView.getController();

      Bundle extras = getIntent().getExtras();
      String position = extras.getString("position");
      StringTokenizer st = new StringTokenizer(position,",");
      String lat = st.nextToken();
      String lon = st.nextToken();
      int index = lat.indexOf(".");
      if (index != -1)
      {
      	lat = lat.substring(0, index - 1) + lat.substring(index + 1, lat.length()); 
      }
      index = lon.indexOf(".");
      if (index != -1)
      {
      	lon = lon.substring(0, index - 1) + lon.substring(index + 1, lon.length()); 
      }
      int latitude = Integer.valueOf(lat).intValue();
      int longitude = Integer.valueOf(lon).intValue();
      mapCtrl.setCenter(new GeoPoint(latitude, longitude));
  }

	@Override
	protected boolean isRouteDisplayed()
	{
		// TODO Auto-generated method stub
		return false;
	}
}
