package jp.lnc.MeshLoader.GenerickMesh;

import java.util.List;

import android.util.Log;

public class PanPrigon {
	private static final String TAG = "PanMesh";
	float[][] top = {{0,0,0},{0,0,0},{0,0,0},{0,0,0}};
	public int[] index = {0,0,0,0};
	int colorCode ;
	public String Name = "";
	public int vertexNum =4;
	private float[][] panMeshTextureCoordsList={{0,0},{0,0},{0,0},{0,0}};
	
	public void setAllData(int i,  float[] vertex,float[] textureCoord) {

		//Log.d(TAG,"i=" +i +" j=" +j + " :\""+ readLine+"\"");
		for(int j=0;j<vertex.length;j++){
			top[i] = vertex;
		}
		for(int j=0;j<textureCoord.length;j++){
			top[i] = vertex;
		}
	}
	public void setParam(int i, int j, String readLine) {

		//Log.d(TAG,"i=" +i +" j=" +j + " :\""+ readLine+"\"");
		
		String repTmp = readLine.replaceAll("[\r\n\t ]+", "");
		try {
			top[j][i-1] = Float.valueOf(repTmp);
		} catch (Exception e) {
			top[j][i-1] = -1.0f;
		}
		
	}
	public void setParam(int i,float[] p1,int Num ){
		index[i] = Num;
		setParam(i, p1);
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
		for(int i=0;i<vertexNum;i++){
			Log.d(TAG,"i=" +i + " :x=\""+ top[i][0]+"\"" + " :y=\""+ top[i][1]+"\""+" :z=\""+ top[i][2]+"\"");

			Log.d(TAG,"i=" +i + " :x=\""+ panMeshTextureCoordsList[i][0]+"\"" + " :y=\""+ panMeshTextureCoordsList[i][1]+"\"");
			//System.out.println("i=" +i + " :x=\""+ top[i][0]+"\"" + " :y=\""+ top[i][1]+"\""+" :z=\""+ top[i][2]+"\"");
		}
		
	}
	
	public float[][] getPrigon(){
		return top;
	}
	
	public void getVector(float[] ret, int i)
	{
		{
			int v = 0,j=0;
	    	ret[i+0+(v*3)] = (top[j][0]);
	    	ret[i+1+(v*3)] = (top[j][1]);
	    	ret[i+2+(v*3)] = (top[j][2]);
		}
		
		{
			int v = 1,j=1;
	    	ret[i+0+(v*3)] = (top[j][0]);
	    	ret[i+1+(v*3)] = (top[j][1]);
	    	ret[i+2+(v*3)] = (top[j][2]);
		}
		if(vertexNum==4){
			int v = 3,j=2;
	    	ret[i+0+(v*3)] = (top[j][0]);
	    	ret[i+1+(v*3)] = (top[j][1]);
	    	ret[i+2+(v*3)] = (top[j][2]);
			v = 2;j=3;
	    	ret[i+0+(v*3)] = (top[j][0]);
	    	ret[i+1+(v*3)] = (top[j][1]);
	    	ret[i+2+(v*3)] = (top[j][2]);
		}else{
			int v = 2,j=2;
	    	ret[i+0+(v*3)] = (top[j][0]);
	    	ret[i+1+(v*3)] = (top[j][1]);
	    	ret[i+2+(v*3)] = (top[j][2]);
		}

	}
	public void getTextureCoords(float[] ret, int i){
	
		int j =0;
		ret[i+ j*2]= panMeshTextureCoordsList[j][0];
		ret[i+ j*2+1]= panMeshTextureCoordsList[j][1];
		
		j =1;
		ret[i+ j*2]= panMeshTextureCoordsList[j][0];
		ret[i+ j*2+1]= panMeshTextureCoordsList[j][1];
		
    	
    	if(vertexNum==4){
    	
    		j =3;
    		int k =2;
    		ret[i+ k*2]= panMeshTextureCoordsList[j][0];
    		ret[i+ k*2+1]= panMeshTextureCoordsList[j][1];
     		j =2;
    		k =3;
    		ret[i+ k*2]= panMeshTextureCoordsList[j][0];
    		ret[i+ k*2+1]= panMeshTextureCoordsList[j][1];
      	}else{
    		 j =2;
    		ret[i+ j*2]= panMeshTextureCoordsList[j][0];
    		ret[i+ j*2+1]= panMeshTextureCoordsList[j][1];
     	}

	}
}
		
