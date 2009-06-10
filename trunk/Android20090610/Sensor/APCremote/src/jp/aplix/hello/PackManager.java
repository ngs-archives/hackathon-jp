package jp.aplix.hello;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.ObjectOutputStream;

import org.apache.http.util.ByteArrayBuffer;

import android.util.Log;



public class PackManager {

	public static byte[] serialize(SensorData cl){
		ObjectOutputStream out = null;
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		try {
			out = new ObjectOutputStream(os);
			//out.writeObject(cl);
			out.writeFloat(cl.getX());
			out.writeFloat(cl.getY());
			out.writeFloat(cl.getZ());
			out.flush();
			out.close();
		} catch (FileNotFoundException e) {
			Log.i("PACKMANAGER", ""+e.getMessage());
		} catch (IOException e) {
			Log.i("PACKMANAGER", ""+e.getMessage());
		}
		
		int size = os.size();
		byte[] result = new byte[size+4];
		byte[] obj = os.toByteArray();

	    result[0] =(byte)( size >> 24 );
	    result[1] =(byte)( (size << 8) >> 24 );
	    result[2] =(byte)( (size << 16) >> 24 );
	    result[3] =(byte)( (size << 24) >> 24 );

		for (int i = 0; i < size; i++)
	    {
	    	result[i+4] = obj[i];
	    }
		return result;
	}
}
