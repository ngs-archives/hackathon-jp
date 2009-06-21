package jp.lnc.MeshLoader.GenerickMesh;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;
import java.util.ArrayList;
import java.util.List;

import javax.microedition.khronos.opengles.GL10;

import android.graphics.Bitmap;
import android.util.Log;

public class PanMesh {
	protected List<PanPrigon> panPrigonList = new ArrayList<PanPrigon>();
	List<PanPrigon> panMaterialList = new ArrayList<PanPrigon>();

	byte[] tmpVartexIndex = new byte[4];
	
	float TextureCoords[];
	protected FloatBuffer TextureCoordsBuff;
	protected int[] vertexArrayNum;
	protected FloatBuffer VertexBuff;
	

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
		TextureCoords = new float[panPrigonList.size()*4*2];
		vertexArrayNum = new int[panPrigonList.size()];
		int def=0;
        for(int i=0;i<panPrigonList.size();i++){
        	/*
    		Log.v("test vec new Debug","i="+i+" ret.length = "+ret.length);
    		*/
            def=i;
        	vertexArrayNum[i] = panPrigonList.get(i).vertexNum;
        	panPrigonList.get(i).getVector(ret,i*4*3);
        	panPrigonList.get(i).getTextureCoords(TextureCoords,i*4*2);

        }

		return ret;
	}
	

	public void createMeshBuff(){
		
		VertexBuff = makeFloatBuffer(createMesh());
		TextureCoordsBuff = makeFloatBuffer(TextureCoords);
	}
	
	int tex;
	public void initGL(GL10 gl, Bitmap bmp){
        //テクスチャの有効化
        gl.glEnable(GL10.GL_TEXTURE_2D);
        tex = loadTexture(gl,bmp);
	}
	
    public int loadTexture(GL10 gl, Bitmap bmp) {
        int[] tmp_tex = new int[1];

        gl.glGenTextures(1, tmp_tex, 0);
        
        loadTexture(tmp_tex[0], GL10.GL_TEXTURE_2D, bmp.getWidth(), bmp.getHeight(), makeByteBuffer(bmp), gl);
        tex = tmp_tex[0];
        return tmp_tex[0];
    }

    static public void loadTexture(int texture, int type, int width, int height, ByteBuffer bb, GL10 gl) {
        gl.glBindTexture(type, texture);
        Log.d("XfileMeshTree","width:"+width +"height:"+ height);
		 
        gl.glTexImage2D(type, 0, GL10.GL_RGBA, width, height, 0, GL10.GL_RGBA, GL10.GL_UNSIGNED_BYTE, bb);
        gl.glTexParameterf(type, GL10.GL_TEXTURE_MIN_FILTER, GL10.GL_LINEAR);
        gl.glTexParameterf(type, GL10.GL_TEXTURE_MAG_FILTER, GL10.GL_LINEAR);
    }
    
    protected static ByteBuffer makeByteBuffer(Bitmap bmp) {
        ByteBuffer bb = ByteBuffer.allocateDirect(bmp.getHeight()*bmp.getWidth()*4);
        bb.order(ByteOrder.BIG_ENDIAN);
        IntBuffer ib = bb.asIntBuffer();

        for (int y = 0; y < bmp.getHeight(); y++)
                for (int x=0;x<bmp.getWidth();x++) {
                        int pix = bmp.getPixel(x, bmp.getHeight()-y-1);
                        // Convert ARGB -> RGBA
                        byte alpha = (byte)((pix >> 24)&0xFF);
                        byte red = (byte)((pix >> 16)&0xFF);
                        byte green = (byte)((pix >> 8)&0xFF);
                        byte blue = (byte)((pix)&0xFF);
                                                        
                        // It seems like alpha is currently broken in Android...
                        ib.put(((red&0xFF) << 24) | 
                                   ((green&0xFF) << 16) |
                                   ((blue&0xFF) << 8) |
                                   ((alpha&0xFF))); //255-alpha);
                }
        ib.position(0);
        bb.position(0);
        return bb;
}

	public void onDrow(GL10 gl){
        //gl.glEnableClientState(GL10.GL_TEXTURE_COORD_ARRAY);
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
        gl.glVertexPointer(3,GL10.GL_FLOAT,0,VertexBuff);

        
        //テクスチャ座標用バッファ
        //gl.glBindTexture(GL10.GL_TEXTURE_2D, tex);
        //gl.glTexCoordPointer(2,GL10.GL_FLOAT,0,TextureCoordsBuff);

        
//        Log.d("XfileMeshTree",panPrigonList.size() +"  ");
		 
        for(byte i=0;i<panPrigonList.size();i++){
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
        	if((vertexArrayNum[i]==4)|(vertexArrayNum[i]==3)){
    		gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,i*4,vertexArrayNum[i]);
        	}else{
        		int aaaaa = 0;
        		aaaaa+=10;
        	}
    		//mIndexBuffer.put(tmpVartexIndex,0,4);
            //mIndexBuffer.position(0);
            //gl.glDrawElements(GL10.GL_TRIANGLE_STRIP, vertexArray[i], GL10.GL_UNSIGNED_BYTE, mIndexBuffer);
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
