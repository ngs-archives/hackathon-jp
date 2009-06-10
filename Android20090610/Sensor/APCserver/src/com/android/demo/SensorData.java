package com.android.demo;

import java.io.Serializable;

public class SensorData implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private float  rx;
	private float  ry;
	private float  rz;
	public  String message;

	public  int  eventType;
	
	public SensorData()
	{
		this.eventType = EventType.MESSAGE;
	}
	
	public SensorData(String message)
	{
		this.eventType = EventType.MESSAGE;
		setMessage(message);
	}

//	public SensorData(float rx, float ry, float rz)
//	{
//		this.eventType = TYPE_SENSORCOORDS;
//		setData(rx, ry, rz);
//	}

	public void setData(int event_type, float rx, float ry, float rz)
	{
		synchronized (this) {
			this.eventType = event_type;
			this.rx = rx;
			this.ry = ry;
			this.rz = rz;
		}
	}
	
	public void setMessage(String message)
	{
		synchronized (message) {
			this.message = message;
		}
	}
	
	public float getX()
	{
		synchronized (this) {
			return rx;
		}
	}
	
	public float getY()
	{
		synchronized (this) {
			return ry;
		}
	}
	
	public float getZ()
	{
		synchronized (this) {
			return rz;
		}
	}
	
	public String getMessage()
	{
		return message;
	}

	@Override
	public String toString()
	{
		return "type="+eventType+" x="+rx+" y="+ry+" z="+rz+" msg="+message;
	}

}
