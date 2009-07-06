package com.fujimic.first_step.openGL;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.*;
import java.util.List;

import javax.microedition.khronos.opengles.*;

import jp.lnc.MeshLoader.R;
import jp.lnc.MeshLoader.DirectxMeshLoder.DirectXMeshLoder;
import jp.lnc.MeshLoader.GenerickMesh.PanMesh;
import android.content.*;
import android.graphics.BitmapFactory;
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
    float zrot=0.0f;//Z軸回転量
    
    float xScall=1.0f;
    float yScall=1.0f;
    float zScall=1.0f;
    PanMesh mesh;
    
    //コンストラクタ
    public GLCubeView(Context c) {
        super(c,20);

        //InputStream input = this.getResources().openRawResource(R.raw.cube);
        //PanMesh mesh = DxfLoader.DxfMeshLoader(new InputStreamReader(input));
        
        InputStream input = this.getResources().openRawResource(R.raw.cubex);
        mesh = DirectXMeshLoder.XMeshLoader(new InputStreamReader(input));
        mesh.printMesh();
  


        	mesh.createMesh();
            //バッファの生成
        	mesh.createMeshBuff();

    }
    
 /*   
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
*/    
    
    
    //初期化
    protected void init(GL10 gl) {
        //光源の指定
        gl.glEnable(GL10.GL_LIGHTING);
        gl.glEnable(GL10.GL_LIGHT0);

        
        //デプスバッファの指定
        gl.glEnable(GL10.GL_DEPTH_TEST);
        gl.glDepthFunc(GL10.GL_LEQUAL);
        
        //テクスチャの有効化
        gl.glEnable(GL10.GL_TEXTURE_2D);
        
        //背景のクリア
        gl.glClearColor(0.0f,0.0f,0.0f,0.0f);
        gl.glClearDepthf(1.0f);
        
        //片面スムーズシェーディングの指定
        gl.glEnable(GL10.GL_CULL_FACE);
        gl.glShadeModel(GL10.GL_SMOOTH);
        
    }
    
    //描画
    protected void drawFrame(GL10 gl) {
        //背面塗り潰し
        gl.glClear(GL10.GL_COLOR_BUFFER_BIT|GL10.GL_DEPTH_BUFFER_BIT);
        
        //モデルビュー行列の指定
        gl.glMatrixMode(GL10.GL_MODELVIEW);
        gl.glLoadIdentity();
        GLU.gluLookAt(gl,
        		/*視点座標　X,Y,Z*/
        		0,0,20,
        		/*向き？　X,Y,Z*/
        		0,0,0,
        		/*不明　X,Y,Z*/
        		0,1,0);
    
//        //頂点配列の指定
//        gl.glVertexPointer(3,GL10.GL_FLOAT,0,cubeBuff);
//        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
    
        //回転の指定
        gl.glRotatef(xrot,1,0,0);
        gl.glRotatef(yrot,0,1,0);
        gl.glRotatef(zrot,0,0,1);
        
        //拡大縮小
        gl.glScalef(xScall, yScall, zScall);        
    
    	mesh.onDrow(gl);
    
        //回転
//        xrot+=1.0f;
//        yrot+=0.5f;
    }
}


