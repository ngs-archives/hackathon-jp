package com.android.lifestyleandtravel.ui;

import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.ZoomControls;

import com.android.lifestyleandtravel.R;
import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;

public class lifestyleandtravel2 extends MapActivity {
    /** Called when the activity is first created. */

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.map);

        //       TextView tv = new TextView(this);
        //       tv.setText("! LifeStyle and Travel !");
        //       setContentView(tv);        

        //MapView m = (MapView)findViewById(1);
        MapView m = (MapView) findViewById(R.id.mapview);
        MapController c = m.getController();
        c.setZoom(15);
        c.setCenter(new GeoPoint(35455281, 139629711));

        ZoomControls zc = (ZoomControls) m.getZoomControls();
        zc.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.FILL_PARENT,
                ViewGroup.LayoutParams.FILL_PARENT));
        zc.setGravity(Gravity.BOTTOM + Gravity.CENTER_HORIZONTAL);
        m.addView(zc);
    }

    @Override
    protected boolean isRouteDisplayed() {
        return false;
    }
}