package android.social;

import java.util.StringTokenizer;
import android.os.Bundle;
import com.google.android.maps.MapActivity;

public class MapViewerActivity extends MapActivity
{
	/** Called when the activity is first created. */
  @Override
  public void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.map);
      
      MapLocationViewer mapViewer = (MapLocationViewer)findViewById(R.id.mapviewer);
      Bundle extras = getIntent().getExtras();
      String position = extras.getString("position");
      position = position.substring("geo:".length());
      StringTokenizer st = new StringTokenizer(position,",");
      String lat = st.nextToken();
      String lon = st.nextToken();
      double latitude  = Double.valueOf(lat).doubleValue();
      double longitude = Double.valueOf(lon).doubleValue();
      mapViewer.setInfo(extras.getString("comment"), latitude, longitude);      
  }

	@Override
	protected boolean isRouteDisplayed()
	{
		// TODO Auto-generated method stub
		return false;
	}
}
