package jp.lnc.MeshLoader;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.*;
import javax.microedition.khronos.opengles.*;

import jp.lnc.MeshLoader.PanMesh;
import jp.lnc.MeshLoader.DirectxMeshLoder.DirectXMeshLoder;
import android.content.*;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.opengl.*;
import android.util.Log;


public class GLCubeView extends GLTutorialBase {

    FloatBuffer cubeBuff;//頂点座標バッファ
    
    float xrot=0.0f;//X軸回転量
    float yrot=0.0f;//Y軸回転量
    float scale = 1;
    float[] lightAmbient=new float[]{0.2f,0.2f,0.2f,1.0f};//光源アンビエント
    float[] lightDiffuse=new float[]{1f,1f,1f,1.0f};      //光源ディフューズ
    float[] lightPos    =new float[]{0,0,3,1};            //光源位置    

    float[] matAmbient=new float[]{1f,1f,1f,1.0f};//マテリアルアンビエント
    float[] matDiffuse=new float[]{1f,1f,1f,1.0f};//マテリアルディフューズ

	PanMesh mesh;

	private Bitmap bmp;

	private int tex;
    //コンストラクタ
    public GLCubeView(Context c) {
        super(c,20);

        //InputStream input = this.getResources().openRawResource(R.raw.cube);
        //PanMesh mesh = DxfLoader.DxfMeshLoader(new InputStreamReader(input));
        bmp=BitmapFactory.decodeResource(c.getResources(),R.drawable.mekatex);
        InputStream input = this.getResources().openRawResource(R.raw.meka);
        mesh = DirectXMeshLoder.XMeshLoader(new InputStreamReader(input));
        //mesh.printMesh();
  
       Log.v("Debug","size" + mesh.getMeshSize());
        

        	mesh.createMesh();
            //バッファの生成
        	mesh.createMeshBuff();

       
//        this.box = mesh.getMesh();
        
        

    }
    
    
   
    
    //初期化
    protected void init(GL10 gl) {
        //光源の指定
        gl.glEnable(GL10.GL_LIGHTING);
        gl.glEnable(GL10.GL_LIGHT0);
        gl.glMaterialfv(GL10.GL_FRONT_AND_BACK,GL10.GL_AMBIENT,matAmbient,0);
        gl.glMaterialfv(GL10.GL_FRONT_AND_BACK,GL10.GL_DIFFUSE,matDiffuse,0);
        gl.glLightfv(GL10.GL_LIGHT0,GL10.GL_AMBIENT,lightAmbient,0);
        gl.glLightfv(GL10.GL_LIGHT0,GL10.GL_DIFFUSE,lightDiffuse,0);
        gl.glLightfv(GL10.GL_LIGHT0,GL10.GL_POSITION,lightPos,0);
        
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
        
        //テクスチャの読み込み
        tex=mesh.loadTexture(gl, bmp);
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
        {
            //回転の指定
            gl.glRotatef(xrot,1,0,0);
            gl.glRotatef(yrot,0,1,0);
            
        	mesh.onDrow(gl);

    	}
    
        //回転
//        xrot+=1.0f;
//        yrot+=0.5f;
    }
}


