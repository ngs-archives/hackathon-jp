package com.android.lifestyleandtravel.ui;


import android.app.Activity;
import android.graphics.Canvas;
import android.os.Bundle;

import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.ZoomControls;
 
import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;

import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
    
import android.content.Context;
//import android.content.Resources;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Paint.FontMetrics;
import android.util.AttributeSet;
import android.view.View;





public class lifestyleandtravel2 extends MapActivity {
    /** Called when the activity is first created. */
	    
    @Override    
    
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);


 //       TextView tv = new TextView(this);
 //       tv.setText("! LifeStyle and Travel !");
 //       setContentView(tv);        

        
         //MapView m = (MapView)findViewById(1);
         MapView m = (MapView)findViewById(R.id.mapview);         
         MapController c = m.getController();
         c.setZoom(15);
         c.setCenter(new GeoPoint(35455281,139629711));

         ZoomControls zc = (ZoomControls) m.getZoomControls();
         zc.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.FILL_PARENT, ViewGroup.LayoutParams.FILL_PARENT));
         zc.setGravity(Gravity.BOTTOM + Gravity.CENTER_HORIZONTAL);
         m.addView(zc);
     }
 
    protected boolean isRouteDisplayed() {
         return false;
     }
 }