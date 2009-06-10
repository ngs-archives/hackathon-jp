package jp.aplix.hello;

import java.io.Serializable;
import java.nio.ByteBuffer;

public class SensorData {
	private float rx;
	private float ry;
	private float rz;
	private byte[] asByte;

	public SensorData()
	{
		asByte = new byte[12];
	}

	public SensorData(float rx, float ry, float rz)
	{
		setData(rx, ry, rz);
	}
	
	public SensorData(byte[] b)
	{  
		setData(b);
	}  

	public void setData(float rx, float ry, float rz)
	{
		synchronized (this) {
			this.rx = rx;
			this.ry = ry;
			this.rz = rz;
		}
	}
	
	public void setData(byte[] b)
	{
		synchronized (this) {
			
			ByteBuffer buf = ByteBuffer.wrap(b, 0, 4);  
			rx = buf.getFloat();
			
			buf = ByteBuffer.wrap(b, 4, 4);  
			ry = buf.getFloat();
			
			buf = ByteBuffer.wrap(b, 8, 4);  
			rz = buf.getFloat();
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
	
	
	private void FloatToBytes(Float f, byte[] ba, int start)
	{
		//fixme
		
	}
	
	public byte[] getBytes()
	{
		synchronized (this) {
			 FloatToBytes(rx, asByte, 0);
			 FloatToBytes(ry, asByte, 4);
			 FloatToBytes(rz, asByte, 8);
			 return asByte;
		}
	}


}
