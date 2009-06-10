package com.google.code.hackathon.jp.geo;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Point;
import android.util.Log;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.Projection;

	public class MapIcon extends Overlay {

	       // 描画するアイコン
	       Bitmap mIcon;
	       int mOffsetX;
	       int mOffsetY;

	       // アイコンを表示する位置
	       GeoPoint mPoint;

	       mapIcon(Bitmap icon, GeoPoint initial) {
	           // アイコンと、アイコンの中心のオフセット
	           mIcon = icon;
	           mOffsetX = 0 - icon.getWidth() / 2;
	           mOffsetY = 0 - icon.getHeight() / 2;
	           mPoint = initial;
	       }

	       public boolean movepin(GeoPoint point, MapView mapView) {
	           // タップされた位置を記録する
	           mPoint = point;
	           Log.i("icontest", "Point = " + point.getLatitudeE6() + " , " + point.getLongitudeE6());
	           return super.onTap(point, mapView);
	       }

	       // 地図の描画時に、shadow=true, shadow=falseと2回呼び出される
	       @Override
	       public void draw(Canvas canvas, MapView mapView,
	                        boolean shadow) {
	           super.draw(canvas, mapView, shadow);
	           if (!shadow) {
	               // 地図上の場所と、描画用のCanvasの座標の変換
	               Projection projection = mapView.getProjection();
	               Point point = new Point();
	               projection.toPixels(mPoint, point);
	               point.offset(mOffsetX, mOffsetY);
	               // アイコンを描画
	               canvas.drawBitmap(mIcon, point.x, point.y, null);
	           }
	       }
	   };
