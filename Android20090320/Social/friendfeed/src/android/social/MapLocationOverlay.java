package android.social;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.RectF;
import android.graphics.Paint.Style;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import android.social.R;

public class MapLocationOverlay  extends Overlay {
    private Bitmap bubbleIcon, shadowIcon;
    private MapLocationViewer mapLocationViewer;
	private Paint	innerPaint, borderPaint, textPaint;
    
	public MapLocationOverlay(MapLocationViewer mapLocationViewer) {
		
		this.mapLocationViewer = mapLocationViewer;
		
		bubbleIcon = BitmapFactory.decodeResource(mapLocationViewer.getResources(),R.drawable.bubble);
		shadowIcon = BitmapFactory.decodeResource(mapLocationViewer.getResources(),R.drawable.shadow);
	}
	
    public void draw(Canvas canvas, MapView	mapView, boolean shadow) {
    	
   		drawMapLocations(canvas, mapView);
   		drawInfoWindow(canvas, mapView);
    }

    private void drawMapLocations(Canvas canvas, MapView	mapView) {

    	MapLocation location = mapLocationViewer.getLocation();
		Point screenCoords = new Point();
		mapView.getProjection().toPixels(location.getPoint(), screenCoords);

		canvas.drawBitmap(shadowIcon, screenCoords.x, screenCoords.y - shadowIcon.getHeight(),null);
		canvas.drawBitmap(bubbleIcon, screenCoords.x - bubbleIcon.getWidth()/2, screenCoords.y - bubbleIcon.getHeight(),null);
    }

    private void drawInfoWindow(Canvas canvas, MapView	 mapView) {
    	
    	MapLocation location = mapLocationViewer.getLocation();
    	if ( location != null) {
			//  First determine the screen coordinates of the selected MapLocation
			Point selDestinationOffset = new Point();
			mapView.getProjection().toPixels(location.getPoint(), selDestinationOffset);
	    	
	    	//  Setup the info window with the right size & location
			int INFO_WINDOW_WIDTH = 240;
			int INFO_WINDOW_HEIGHT = 25;
			RectF infoWindowRect = new RectF(0,0,INFO_WINDOW_WIDTH,INFO_WINDOW_HEIGHT);				
			int infoWindowOffsetX = selDestinationOffset.x-INFO_WINDOW_WIDTH/2;
			int infoWindowOffsetY = selDestinationOffset.y-INFO_WINDOW_HEIGHT-bubbleIcon.getHeight();
			infoWindowRect.offset(infoWindowOffsetX,infoWindowOffsetY);

			//  Draw inner info window
			canvas.drawRoundRect(infoWindowRect, 5, 5, getInnerPaint());
			
			//  Draw border for info window
			canvas.drawRoundRect(infoWindowRect, 5, 5, getBorderPaint());
				
			//  Draw the MapLocation's name
			int TEXT_OFFSET_X = 10;
			int TEXT_OFFSET_Y = 15;
			canvas.drawText(location.getName(),infoWindowOffsetX+TEXT_OFFSET_X,infoWindowOffsetY+TEXT_OFFSET_Y,getTextPaint());
    	}
    }

	public Paint getInnerPaint() {
		if ( innerPaint == null) {
			innerPaint = new Paint();
			innerPaint.setARGB(225, 75, 75, 75); //gray
			innerPaint.setAntiAlias(true);
		}
		return innerPaint;
	}

	public Paint getBorderPaint() {
		if ( borderPaint == null) {
			borderPaint = new Paint();
			borderPaint.setARGB(255, 255, 255, 255);
			borderPaint.setAntiAlias(true);
			borderPaint.setStyle(Style.STROKE);
			borderPaint.setStrokeWidth(2);
		}
		return borderPaint;
	}

	public Paint getTextPaint() {
		if ( textPaint == null) {
			textPaint = new Paint();
			textPaint.setARGB(255, 255, 255, 255);
			textPaint.setAntiAlias(true);
		}
		return textPaint;
	}
}