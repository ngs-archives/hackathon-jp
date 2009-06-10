import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;

import com.sun.xml.internal.ws.util.ByteArrayBuffer;


public class PackManager {

	public byte[] serialize(TargetClass cl){
		ObjectOutput out2 = null;
		try {
//			out = new ObjectOutputStream(new FileOutputStream("target.obj"));
			ByteArrayBuffer bb = new ByteArrayBuffer();
			out2 = new ObjectOutputStream(bb);
			
			
			out2.writeObject(cl);
			
			
			out2.flush();
			out2.close();
			return bb.getRawData();

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
		
	}
	
	public TargetClass deserialize(byte[] data){
		ObjectInputStream in;
		TargetClass cl = null;
		try {
			ByteArrayInputStream bi = new ByteArrayInputStream(data);
			
			in = new ObjectInputStream(bi);
			cl =(TargetClass)in.readObject();
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
		return cl;
	}
}
