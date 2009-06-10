import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;


public class SerializeClient {
	public static void main(String args[]){
		TargetClass cl = new TargetClass();
		PackManager pm = new PackManager();
		byte[] sendData = null;
		
		cl.setX(11.1f);
		cl.setY(22.2f);
		cl.setZ(33.3f);
		
		sendData = pm.serialize(cl);
		
		TargetClass des_cl = (TargetClass)pm.deserialize(sendData);
		System.out.println(des_cl.toString());
		
		
		
//		ObjectOutput out = null;
//		try {
//			out = new ObjectOutputStream(new FileOutputStream("target.obj"));
//			out.writeObject(cl);
//			
//			out.flush();
//			out.close();
//			
//		} catch (FileNotFoundException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
	}
	
}
