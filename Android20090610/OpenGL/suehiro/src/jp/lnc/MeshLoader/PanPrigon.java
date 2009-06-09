package jp.lnc.MeshLoader;

import android.util.Log;

public class PanPrigon {
	private static final String TAG = "PanMesh";
	float[][] top = {{0,0,0},{0,0,0},{0,0,0},{0,0,0}};
	int colorCode ;
	public String Name = "";
	public void setParam(int i, int j, String readLine) {

		//Log.d(TAG,"i=" +i +" j=" +j + " :\""+ readLine+"\"");
		
		String repTmp = readLine.replaceAll("[\r\n\t ]+", "");
		try {
			top[j][i-1] = Float.valueOf(repTmp);
		} catch (Exception e) {
			top[j][i-1] = -1.0f;
		}
		
	}
	public void setParam(int i,float[] p1){
		top[i] = p1;
	}
	public void setColorCode(String readLine){
		String repTmp = readLine.replaceAll("[\r\n\t ]+", "");
		try {
			colorCode = Integer.parseInt(repTmp);
		} catch (Exception e) {
			colorCode = -1;
		}
	}
	public void printPrigon(){
		for(int i=0;i<4;i++){
			//Log.d(TAG,"i=" +i + " :x=\""+ top[i][0]+"\"" + " :y=\""+ top[i][1]+"\""+" :z=\""+ top[i][2]+"\"");
			System.out.println("i=" +i + " :x=\""+ top[i][0]+"\"" + " :y=\""+ top[i][1]+"\""+" :z=\""+ top[i][2]+"\"");
		}
		
	}

}
