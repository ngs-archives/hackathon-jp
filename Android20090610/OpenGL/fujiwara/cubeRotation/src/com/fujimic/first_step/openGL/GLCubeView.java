package com.fujimic.first_step.openGL;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.*;
import java.util.List;

import javax.microedition.khronos.opengles.*;

import jp.lnc.DirectxMeshLoder.DirectXMeshLoder;
import jp.lnc.MeshLoader.DxfLoader;
import jp.lnc.MeshLoader.PanMesh;
import jp.lnc.MeshLoader.PanPrigon;
import android.content.*;
import android.opengl.*;
import android.util.Log;
import edu.union.GLTutorialBase;


public class GLCubeView extends GLTutorialBase {
	

    float box[]=new float[] {
            //前面
            -0.5f, -0.5f,  0.5f,
             0.5f, -0.5f,  0.5f,
            -0.5f,  0.5f,  0.5f,
             0.5f,  0.5f,  0.5f,
             //背面
            -0.5f, -0.5f, -0.5f,
            -0.5f,  0.5f, -0.5f,
             0.5f, -0.5f, -0.5f,
             0.5f,  0.5f, -0.5f,
            //左面
            -0.5f, -0.5f,  0.5f,
            -0.5f,  0.5f,  0.5f,
            -0.5f, -0.5f, -0.5f,
            -0.5f,  0.5f, -0.5f,
            //右面
             0.5f, -0.5f, -0.5f,
             0.5f,  0.5f, -0.5f,
             0.5f, -0.5f,  0.5f,
             0.5f,  0.5f,  0.5f,
            //上面
            -0.5f,  0.5f,  0.5f,
             0.5f,  0.5f,  0.5f,
             -0.5f,  0.5f, -0.5f,
             0.5f,  0.5f, -0.5f,
            //下面
            -0.5f, -0.5f,  0.5f,
            -0.5f, -0.5f, -0.5f,
             0.5f, -0.5f,  0.5f,
             0.5f, -0.5f, -0.5f,
 
        };

    FloatBuffer cubeBuff;//頂点座標バッファ
    
    float xrot=0.0f;//X軸回転量
    float yrot=0.0f;//Y軸回転量
    float scale = 1;
    //コンストラクタ
    public GLCubeView(Context c) {
        super(c,20);

        //InputStream input = this.getResources().openRawResource(R.raw.cube);
        //PanMesh mesh = DxfLoader.DxfMeshLoader(new InputStreamReader(input));
        
        InputStream input = this.getResources().openRawResource(R.raw.cubex);
        PanMesh mesh = DirectXMeshLoder.XMeshLoader(new InputStreamReader(input));
        mesh.printMesh();
  
       Log.v("Debug","size" + mesh.getMeshSize());
        
//        float box2[] = new float[mesh.getMeshSize()];
//        box2 = mesh.getMesh();
        
        float[][][] box_temp = mesh.getMesh();
        
        int idx = 0;
        
        int[] men = new int[] {0,1,2,3,4,5};
        int[] dim = new int[] {0,1,3,2};
        
        for(int i=0; i<6; i++){
	        for(int k=0; k<4; k++){
	            for(int l=0; l<3; l++){
	            	box[idx] = box_temp[men[i]][dim[k]][l] ;
	            	Log.v("Debug","i=" + idx + " val="+ box[idx]);
	            	idx ++;
	            }
	        }
        }
        setBoxSize(0.5f);
        
//        this.box = mesh.getMesh();
        
        
        //バッファの生成
        cubeBuff=makeFloatBuffer(box);
    }
    
    
    public void setBoxSize(float setScale){
    	scale = setScale;
        int idx = 0;
        for(int i=0; i<6; i++){
	        for(int k=0; k<4; k++){
	            for(int l=0; l<3; l++){
	            	box[idx] = box[idx] * setScale;
	            	idx ++;
	            }
	        }
        }
    	
    	
    	
    }
    
    
    
    //初期化
    protected void init(GL10 gl) {
        //背面塗り潰し色の指定
        gl.glClearColor(0.0f,0.0f,0.0f,1.0f);
        
        //デプスバッファ
        gl.glEnable(GL10.GL_DEPTH_TEST);
        gl.glEnable(GL10.GL_CULL_FACE);
        gl.glDepthFunc(GL10.GL_LEQUAL);
        gl.glClearDepthf(1.0f);
        
        //シェーディング
        gl.glShadeModel(GL10.GL_SMOOTH);
    }
    
    //描画
    protected void drawFrame(GL10 gl) {
        //背面塗り潰し
        gl.glClear(GL10.GL_COLOR_BUFFER_BIT|GL10.GL_DEPTH_BUFFER_BIT);
        
        //モデルビュー行列の指定
        gl.glMatrixMode(GL10.GL_MODELVIEW);
        gl.glLoadIdentity();
        GLU.gluLookAt(gl,0,0,3,0,0,0,0,1,0);
    
        //頂点配列の指定
        gl.glVertexPointer(3,GL10.GL_FLOAT,0,cubeBuff);
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
    
        //回転の指定
        gl.glRotatef(xrot,1,0,0);
        gl.glRotatef(yrot,0,1,0);
    
        //前面と背面のプリミティブの描画
        gl.glColor4f(1.0f,0,0,1.0f);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,0,4);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,4,4);
    
        //左面と右面のプリミティブの描画
        gl.glColor4f(0,1.0f,0,1.0f);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,8,4);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,12,4);
        
        //上面と下面のプリミティブの描画
        gl.glColor4f(0,0,1.0f,1.0f);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,16,4);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,20,4);
    
        //回転
//        xrot+=1.0f;
//        yrot+=0.5f;
    }
}


