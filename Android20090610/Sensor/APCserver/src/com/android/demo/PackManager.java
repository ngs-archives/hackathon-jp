package com.android.demo;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.ObjectInputStream;

public class PackManager {
	
	public static SensorData deserialize(byte[] data){
		System.out.println("lenght= "+data.length);
		/*
		ObjectInputStream in;
		SensorData cl = null;
		try {
			ByteArrayInputStream bi = new ByteArrayInputStream(data);
			System.out.println(data);
			in = new ObjectInputStream(bi);
			cl = (SensorData) in.readObject();
			in.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return cl;*/
		return null;
	}
}
