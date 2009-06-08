package jp.lnc.MeshLoader;

import android.util.Log;

public class PanPrigon {
	private static final String TAG = "PanMesh";
	double[][] top = {{0,0,0},{0,0,0},{0,0,0},{0,0,0}};
	int colorCode ;
	public String Name = "";
	public void setParam(int i, int j, String readLine) {

		//Log.d(TAG,"i=" +i +" j=" +j + " :\""+ readLine+"\"");
		top[j][i-1] = Double.valueOf(readLine);
		
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
		//Log.d(TAG,"i=" +i +" j=" +j + " :\""+ readLine+"\"");
	}

}
