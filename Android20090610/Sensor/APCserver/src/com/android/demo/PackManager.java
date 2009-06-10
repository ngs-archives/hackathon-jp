package com.android.demo;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.ObjectInputStream;

public class PackManager {
	
	private static int byteArrayToInt(byte[] b, int offset) {
        int value = 0;
        for (int i = 0; i < 4; i++) {
            int shift = (4 - 1 - i) * 8;
            value += (b[i + offset] & 0x000000FF) << shift;
        }
        return value;
    }

	
	public static void deserialize(SensorData sd, byte[] data){
		
		int size = byteArrayToInt(data, 0);
		
		//System.out.println("lenght= "+size);
		
		ObjectInputStream in;
		SensorData cl = null;
		try {
			ByteArrayInputStream bi = new ByteArrayInputStream(data, 4 , size);
			//System.out.println(data);
			in = new ObjectInputStream(bi);
			sd.setData(in.readFloat(), in.readFloat(), in.readFloat() );
			in.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		/*}catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();*/
		}
		//return cl;
	}
}
