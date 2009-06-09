package jp.lnc.MeshLoader;

import java.util.ArrayList;
import java.util.List;

public class PanMesh {
	List<PanPrigon> panPrigonList = new ArrayList<PanPrigon>();

	public PanPrigon newPrigon() {
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
