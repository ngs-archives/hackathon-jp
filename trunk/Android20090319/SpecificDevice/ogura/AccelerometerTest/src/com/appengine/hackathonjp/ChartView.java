package com.appengine.hackathonjp;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

public class ChartView extends SurfaceView {
	
	int accelIndex;
	float[][] accel;
	int dataSize;
	Paint mPaint;

	public ChartView(Context context) {
		super(context);
		this.getHolder().addCallback(new ChartViewCallback());
		this.setFocusable(true);
		this.requestFocus();
		
		this.mPaint = new Paint();
		this.mPaint.setColor(Color.BLUE);
        this.mPaint.setStyle(Paint.Style.STROKE);
        this.mPaint.setStrokeWidth(6);
	}
	
	public void updateData(int accelIndex, float[][] accel) {
		// should be copied
		this.accelIndex = accelIndex;
		this.accel = accel;
	}
	
	public void setDataSize(int dataSize) {
		this.dataSize = dataSize;
	}
	
	public void repaint() {
        Canvas canvas = null;
        SurfaceHolder surfaceHolder = getHolder();
        try {
                canvas = surfaceHolder.lockCanvas();
                if (canvas == null)
                        return;
                synchronized (surfaceHolder) {
                        draw(canvas);
                }
        } finally {
                if (canvas != null)
                        surfaceHolder.unlockCanvasAndPost(canvas);
        }
		
	}
	
	@Override
	public void draw(Canvas canvas) {
		super.draw(canvas);
		
		Path p = new Path();
/*		p.moveTo(30, 30);
		p.lineTo(50, 50); */
		boolean wrote = false;
		for (int i = 0; i < dataSize; ++i) {
			int targetIndex = (accelIndex + i) % dataSize;
			if (accel[targetIndex] == null)
				continue;
			
			
			if (!wrote) {
				p.moveTo(i * 2, accel[targetIndex][0] * 100 + 300);
				wrote = true;
			} else {
				p.lineTo(i * 2, accel[targetIndex][0] * 100 + 300);
			}
		}
		
        RectF bounds = new RectF();
        p.computeBounds(bounds, false);
        canvas.translate(10 - bounds.left, 10 - bounds.top);
		
		canvas.drawPath(p,this.mPaint);
	}



	private class ChartViewCallback implements SurfaceHolder.Callback {

		@Override
		public void surfaceChanged(SurfaceHolder holder, int format, int width,
				int height) {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void surfaceCreated(SurfaceHolder holder) {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void surfaceDestroyed(SurfaceHolder holder) {
			// TODO Auto-generated method stub
			
		}
		
	}

}
