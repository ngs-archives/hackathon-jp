package jp.lnc.MeshLoader;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.util.ArrayList;
import java.util.List;

import javax.microedition.khronos.opengles.GL10;

import android.util.Log;

public class PanMesh {
	List<PanPrigon> panPrigonList = new ArrayList<PanPrigon>();
	List<PanPrigon> panMaterialList = new ArrayList<PanPrigon>();
	List<float[]> panTopList = new ArrayList<float[]>();
	List<Float> panMeshArrayTmp = new ArrayList<Float>();
	
	public float[] newTop() {
		float[] newIns = new float[3];
		panTopList.add(newIns);
		return newIns;
	}
	public PanPrigon newPrigon() {
		PanPrigon newIns = new PanPrigon();
		panPrigonList.add(newIns);
		return newIns;
	}
	public PanPrigon newMaterial() {
		PanPrigon newIns = new PanPrigon();
		panPrigonList.add(newIns);
		return newIns;
	}

	public void printMesh() {
		for(int i=0;i<panPrigonList.size();i++){
			panPrigonList.get(i).printPrigon();
		}
		
	}
	public float[][][] getMesh(){
			float ret[][][] = new float[panPrigonList.size()][4][3];
			for(int i=0;i<panPrigonList.size();i++){
	        	ret[i] = panPrigonList.get(i).getPrigon();
	        }
			return ret;

	}
	public float[] getMesh(int i){
		float ret[] = new float[4*3];

		panPrigonList.get(i).getVector(ret,0);
 
		return ret;

	}
	
	public float[] createMesh(){
		float ret[] = new float[panPrigonList.size()*4*3];
	
        for(int i=0;i<panPrigonList.size();i++){
        	/*
    		Log.v("test vec new Debug","i="+i+" ret.length = "+ret.length);
            for(int k=0; k<4; k++){
            	int index =(i*12+k*3);
                Log.v("test vec new Debug","i="+i+ "k="+k+" x="+ ret[index]+ " y="+ ret[index+1]+ " z="+ ret[index+2]);
            }
            */
        	panPrigonList.get(i).getVector(ret,i*12);
        }

		return ret;
	}
	
	FloatBuffer MeshBuff;
	public void createMeshBuff(){
		MeshBuff = makeFloatBuffer(createMesh());
	}
	
	public void onDrow(GL10 gl){
        gl.glVertexPointer(3,GL10.GL_FLOAT,0,MeshBuff);
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        for(int i=0;i<panPrigonList.size();i++){
        	if(i%4 == 0){
        		switch((i/4)%3){
        		case 0:
        			gl.glColor4f(1.0f,0,0,1.0f);
        			break;
        		case 1:
        			gl.glColor4f(0,0,1.0f,1.0f);
        			break;
        		case 2:
        			gl.glColor4f(0,1.0f,0,1.0f);
        			break;
        		}
        	}

    		gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,i*4,4);
        }
	}
    /**
     * Make a direct NIO FloatBuffer from an array of floats
     * @param arr The array
     * @return The newly created FloatBuffer
     */
    protected static FloatBuffer makeFloatBuffer(float[] arr) {
            ByteBuffer bb = ByteBuffer.allocateDirect(arr.length*4);
            bb.order(ByteOrder.nativeOrder());
            FloatBuffer fb = bb.asFloatBuffer();
            fb.put(arr);
            fb.position(0);
            return fb;
    }
	public int getMeshSize(){
//		int ret = panPrigonList.size() * 4 * 3;
		int ret = panPrigonList.size();
		return ret;
	}
	
}
