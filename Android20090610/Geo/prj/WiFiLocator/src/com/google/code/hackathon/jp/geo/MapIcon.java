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

	       // �`�悷��A�C�R��
	       Bitmap mIcon;
	       int mOffsetX;
	       int mOffsetY;

	       // �A�C�R����\������ʒu
	       GeoPoint mPoint;

	       MapIcon(Bitmap icon, GeoPoint initial) {
	           // �A�C�R���ƁA�A�C�R���̒��S�̃I�t�Z�b�g
	           mIcon = icon;
	           mOffsetX = 0 - icon.getWidth() / 2;
	           mOffsetY = 0 - icon.getHeight() / 2;
	           mPoint = initial;
	       }

	       public boolean movepin(GeoPoint point, MapView mapView) {
	           // �^�b�v���ꂽ�ʒu���L�^����
	           mPoint = point;
	           Log.i("icontest", "Point = " + point.getLatitudeE6() + " , " + point.getLongitudeE6());
	           return super.onTap(point, mapView);
	       }

	       // �n�}�̕`�掞�ɁAshadow=true, shadow=false��2��Ăяo�����
	       @Override
	       public void draw(Canvas canvas, MapView mapView,
	                        boolean shadow) {
	           super.draw(canvas, mapView, shadow);
	           if (!shadow) {
	               // �n�}��̏ꏊ�ƁA�`��p��Canvas�̍��W�̕ϊ�
	               Projection projection = mapView.getProjection();
	               Point point = new Point();
	               projection.toPixels(mPoint, point);
	               point.offset(mOffsetX, mOffsetY);
	               // �A�C�R����`��
	               canvas.drawBitmap(mIcon, point.x, point.y, null);
	           }
	       }
	   };
