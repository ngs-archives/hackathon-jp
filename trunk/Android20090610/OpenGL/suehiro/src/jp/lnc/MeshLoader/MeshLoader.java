package jp.lnc.MeshLoader;

import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;

import android.app.Activity;
import android.os.Bundle;

public class MeshLoader extends Activity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        InputStream input = this.getResources().openRawResource(R.raw.cube);
        
        PanMesh mesh = DxfLoader.DxfMeshLoader(new InputStreamReader(input));
        mesh.printMesh();
        //mesh.printMesh();
          
    }
}