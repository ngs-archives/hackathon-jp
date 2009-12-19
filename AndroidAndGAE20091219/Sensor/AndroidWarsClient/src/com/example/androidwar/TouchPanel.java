package com.example.androidwar;

import java.util.HashMap;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Point;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import com.example.androidwar.common.Constant.ActionType;
import com.example.androidwar.util.Util;

public class TouchPanel extends View {

	private static int ACTION = ActionType.ACTION_MOVE;
	private Point downPoint;
	private Point upPoint;
	private String name;
	private OnSendListener listner;
	
	public void setListner(OnSendListener listner) {
		this.listner = listner;
	}

	public TouchPanel(Context context) {
		super(context);
		setBackgroundColor(Color.GRAY);
		setFocusable(true);
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public boolean onTouchEvent(MotionEvent event) {
		
		switch(event.getAction()){
			case MotionEvent.ACTION_DOWN:
				this.downPoint = new Point();
				downPoint.x = (int) event.getX();
				downPoint.y = (int) event.getY();
//				Log.v("Down", "x:" + downPoint.x + " y:" + downPoint.y);
				
				return true;
				
			case MotionEvent.ACTION_UP:
				this.upPoint = new Point();
				upPoint.x = (int) event.getX();
				upPoint.y = (int) event.getY();
//				Log.v("UP", "x:" + upPoint.x + " y:" + upPoint.y);
				sendData();
				return true;
		}
		
		return false;
	}
	

	private void sendData(){
		int difX = this.upPoint.x - this.downPoint.x;
		int difY = this.upPoint.y - this.downPoint.y;
		HashMap<String, Object> data = Util.generateMoveData(ACTION, name, difX, difY);
		this.listner.onSend(data);
		send(data);
	}
	
	private void send(HashMap<String, Object> data ){
		Log.v("",Util.showMoveData(data));
	}
}
