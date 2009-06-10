package com.google.code.hackathon.jp.geo;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;

import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.Projection;

public class HeatmapOverlay extends Overlay {

	@Override
	public void draw(Canvas canvas, MapView mapView, boolean shadow) {
		super.draw(canvas, mapView, shadow);
		
		Projection projection = mapView.getProjection();
		Point point = projection.toPixels(mapView.getMapCenter(), null);
		Paint paint = new Paint();
		paint.setColor(Color.RED);
		paint.setAlpha(100);
		canvas.drawRect(new Rect(point.x - 5, point.y - 5, point.x + 5, point.y + 5), paint);
	}
	
}
