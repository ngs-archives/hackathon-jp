package jp.lnc.MeshLoader;

import java.io.File;

import android.app.Activity;
import android.os.Bundle;

public class MeshLoader extends Activity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        PanMesh mesh = DxfLoader.DxfMeshLoader(new File("/sdcard/test2.dxf"));
        mesh.printMesh();
          
    }
}