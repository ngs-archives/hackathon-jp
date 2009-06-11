package jp.lnc.MeshLoader;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.*;
import javax.microedition.khronos.opengles.*;

import jp.lnc.MeshLoader.PanMesh;
import jp.lnc.MeshLoader.DirectxMeshLoder.DirectXMeshLoder;
import android.content.*;
import android.opengl.*;
import android.util.Log;


public class GLCubeView extends GLTutorialBase {

    FloatBuffer cubeBuff;//頂点座標バッファ
    
    float xrot=0.0f;//X軸回転量
    float yrot=0.0f;//Y軸回転量
    float scale = 1;

	PanMesh mesh;
    //コンストラクタ
    public GLCubeView(Context c) {
        super(c,20);

        //InputStream input = this.getResources().openRawResource(R.raw.cube);
        //PanMesh mesh = DxfLoader.DxfMeshLoader(new InputStreamReader(input));
        
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


