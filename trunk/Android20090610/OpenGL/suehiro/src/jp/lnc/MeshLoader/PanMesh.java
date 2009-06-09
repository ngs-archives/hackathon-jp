package jp.lnc.MeshLoader;

import java.util.ArrayList;
import java.util.List;

public class PanMesh {
	List<PanPrigon> panPrigonList = new ArrayList<PanPrigon>();
	List<PanPrigon> panMaterialList = new ArrayList<PanPrigon>();
	List<float[]> panTopList = new ArrayList<float[]>();
	
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
	
	
	
}
