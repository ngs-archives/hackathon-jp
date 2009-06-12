package jp.lnc.MeshLoader;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;
import java.util.ArrayList;
import java.util.List;

import javax.microedition.khronos.opengles.GL10;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;


public class PanMesh {
	protected List<PanPrigon> panPrigonList = new ArrayList<PanPrigon>();
	List<PanPrigon> panMaterialList = new ArrayList<PanPrigon>();
	List<float[]> panTopList = new ArrayList<float[]>();
	List<float[]> panMeshTextureCoordsList = new ArrayList<float[]>();
	List<Float> panMeshArrayTmp = new ArrayList<Float>();
	
	float TextureCoords[];
	private FloatBuffer TextureCoordsBuff;
	protected int[] vertexArray;
	protected FloatBuffer MeshBuff;
	
	public float[] newTop() {
		float[] newIns = new float[3];
		panTopList.add(newIns);
		return newIns;
	}
	public float[] newTextureCoord() {
		float[] newIns = new float[2];
		panMeshTextureCoordsList.add(newIns);
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
	public void createMeshTexBuff(){
		float ret[] = new float[panPrigonList.size()*4*3];
		TextureCoords = new float[panMeshTextureCoordsList.size()*4*2];
		vertexArray = new int[panPrigonList.size()];
	       for(int i=0;i<panPrigonList.size();i++){
	        	/*
	    		Log.v("test vec new Debug","i="+i+" ret.length = "+ret.length);
	    		*/
	            
	        	vertexArray[i] = panPrigonList.get(i).vertexNum;
	        	panPrigonList.get(i).getVector(ret,i*12);
	        	TextureCoords[i*2]= (panMeshTextureCoordsList.get(i))[0];
	        	TextureCoords[i*2+1]= (panMeshTextureCoordsList.get(i))[1];
	        	
	        }
	}

	public float[] createMesh(){
		float ret[] = new float[panPrigonList.size()*4*3];
		TextureCoords = new float[panMeshTextureCoordsList.size()*4*2];
		vertexArray = new int[panPrigonList.size()];
		int def=0;
        for(int i=0;i<panPrigonList.size();i++){
        	/*
    		Log.v("test vec new Debug","i="+i+" ret.length = "+ret.length);
    		*/
            
        	vertexArray[i] = panPrigonList.get(i).vertexNum;
        	panPrigonList.get(i).getVector(ret,i*12);
        	{
        		int j =0;
        		int v= panPrigonList.get(i).index[j];
        		TextureCoords[def*4+ j*2]= (panMeshTextureCoordsList.get(v))[0];
        		TextureCoords[def*4+ j*2+1]= (panMeshTextureCoordsList.get(v))[1];
        		Log.d("XfileMeshTree",(panMeshTextureCoordsList.get(v))[0] +"  "+ (panMeshTextureCoordsList.get(v))[1]);
        		def++;
        	}
        	{
        		int j =1;
        		int v= panPrigonList.get(i).index[j];
        		TextureCoords[def*4+ j*2]= (panMeshTextureCoordsList.get(v))[0];
        		TextureCoords[def*4+ j*2+1]= (panMeshTextureCoordsList.get(v))[1];
        		Log.d("XfileMeshTree",(panMeshTextureCoordsList.get(v))[0] +"  "+ (panMeshTextureCoordsList.get(v))[1]);
        		def++;
        	}
        	if(panPrigonList.get(i).vertexNum==4){
        	
        		int j =3;
        		int v= panPrigonList.get(i).index[2];
        		TextureCoords[def*4+ j*2]= (panMeshTextureCoordsList.get(v))[0];
        		TextureCoords[def*4+ j*2+1]= (panMeshTextureCoordsList.get(v))[1];
        		Log.d("XfileMeshTree",(panMeshTextureCoordsList.get(v))[0] +"  "+ (panMeshTextureCoordsList.get(v))[1]);
        		def++;
        		j =2;
        		v= panPrigonList.get(i).index[3];
        		TextureCoords[def*4+ j*2]= (panMeshTextureCoordsList.get(v))[0];
        		TextureCoords[def*4+ j*2+1]= (panMeshTextureCoordsList.get(v))[1];
        		Log.d("XfileMeshTree",(panMeshTextureCoordsList.get(v))[0] +"  "+ (panMeshTextureCoordsList.get(v))[1]);
        		def++;
        	}else{
        		int j =2;
    		int  v= panPrigonList.get(i).index[3];
    		TextureCoords[def*4+ j*2]= (panMeshTextureCoordsList.get(v))[0];
    		TextureCoords[def*4+ j*2+1]= (panMeshTextureCoordsList.get(v))[1];
    		Log.d("XfileMeshTree",(panMeshTextureCoordsList.get(v))[0] +"  "+ (panMeshTextureCoordsList.get(v))[1]);
    		def++;
    	}

        	/*
        	for(int k=0; k<4; k++){
            	int index =(i*12+k*3);
            	if(ret[index]==0&& ret[index+1]==0 &&ret[index+2]==0){
            		Log.v("test vec new Debug","i="+i+ "k="+k+"VatexNum"+vertexArray[i]+" x="+ ret[index]+ " y="+ ret[index+1]+ " z="+ ret[index+2]);
            	}
        	}
        	*/
            
        }

		return ret;
	}
	

	public void createMeshBuff(){
		TextureCoordsBuff = makeFloatBuffer(TextureCoords);
		MeshBuff = makeFloatBuffer(createMesh());
	}
	
	public void initGL(GL10 gl, Bitmap bmp){


        //テクスチャの有効化
        gl.glEnable(GL10.GL_TEXTURE_2D);
        int tex = loadTexture(gl,bmp);
	}
    protected int loadTexture(GL10 gl, Bitmap bmp) {
        int[] tmp_tex = new int[1];

        gl.glGenTextures(1, tmp_tex, 0);
        int tex = tmp_tex[0];
        loadTexture(tex, GL10.GL_TEXTURE_2D, bmp, gl);
        return tex;
    }

    public void loadTexture(int texture, int type, Bitmap bmp, GL10 gl) {
           loadTexture(texture, type, bmp.getWidth(), bmp.getHeight(), makeByteBuffer(bmp), gl);
   }
    static public void loadTexture(int texture, int type, int width, int height, ByteBuffer bb, GL10 gl) {
        gl.glBindTexture(type, texture);
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
        gl.glVertexPointer(3,GL10.GL_FLOAT,0,MeshBuff);
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);

        //テクスチャ座標用バッファ
        gl.glTexCoordPointer(2,GL10.GL_FLOAT,0,TextureCoordsBuff);
        gl.glEnableClientState(GL10.GL_TEXTURE_COORD_ARRAY);

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

    		gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,i*4,vertexArray[i]);
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
