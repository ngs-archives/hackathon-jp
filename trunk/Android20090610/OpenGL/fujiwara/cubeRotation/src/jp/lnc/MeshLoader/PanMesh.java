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
	public float[][][] getMesh(){
		float ret[][][] = new float[panPrigonList.size()][4][3];
		int idx = 0;
		
        for(int i=0;i<panPrigonList.size();i++){
        	float temp[][] = panPrigonList.get(i).getPrigon();

        	for(int k=0;k<4;k++){
                for(int l=0;l<3;l++){
                    ret[i][k][l]=temp[k][l];
                   	idx ++;
                }
            }

        }		
		return ret;
	}
	public int getMeshSize(){
//		int ret = panPrigonList.size() * 4 * 3;
		int ret = panPrigonList.size();
					return ret;
	}
	
}
