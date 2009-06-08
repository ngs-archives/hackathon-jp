package jp.lnc.MeshLoader;

import android.util.Log;

public class PanPrigon {
	private static final String TAG = "PanMesh";
	double[][] top = {{0,0,0},{0,0,0},{0,0,0},{0,0,0}};

	public String Name = "";
	public void setParam(int i, int j, String readLine) {

		//Log.d(TAG,"i=" +i +" j=" +j + " :\""+ readLine+"\"");
		top[j][i-1] = Double.valueOf(readLine);
		
	}
	public void printPrigon(){
		//Log.d(TAG,"i=" +i +" j=" +j + " :\""+ readLine+"\"");
	}

}
