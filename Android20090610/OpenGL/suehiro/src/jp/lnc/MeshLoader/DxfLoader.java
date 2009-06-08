package jp.lnc.MeshLoader;

import java.io.*;
import java.util.regex.Pattern;

import android.util.Log;

public class DxfLoader {
	private static final String TAG = "DxfLoader" ;
	Pattern splitDxfStruct = Pattern.compile("[\r\n]");
	
	static private final String[] keyWoordList = {"SECTION","3DFACE","ENDSEC","EOF"};
	
	public static PanMesh DxfMeshLoader (File file){
		FileReader fis;
		PanMesh ret = null;
		try {
			fis = new FileReader(file);
			ret = DxfMeshLoader(fis);
			fis.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return ret;
		
	}
	public static BufferedReader dxfReader;
	
	public static PanMesh DxfMeshLoader (Reader input){
		dxfReader = new BufferedReader(input);
		PanMesh panMesh = new PanMesh();
		try {
			paeseSection(panMesh);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return panMesh;
		
	}

	private static void paeseSection(PanMesh panMesh) throws IOException {
		String tmp;
		while(dxfReader.ready()){
			tmp = dxfReader.readLine();
			int No;
			try {
				String repTmp = tmp.replaceAll("[\r\n\t ]+", "");
				No = Integer.parseInt(repTmp);
			} catch (Exception e) {
				No = -1;
			}
			
			if(No == 0){
				PanPrigon panPrigon =panMesh.newPrigon();
				tmp = dxfReader.readLine();
				tmp = tmp.replaceAll("[\r\n\t ]+", "");
				for(int i=0; i < keyWoordList.length ;i++){
					if(tmp.equalsIgnoreCase(keyWoordList[i])){
						//Log.d(TAG,"get convert:" +No + " :\""+ tmp +"\"");
						
						switch(i){
						case 0:
							getSection(panPrigon);
							break;
						case 1:
							get3Dfase(panPrigon);
							break;
						default:
								Log.d(TAG,"get convert:" +No + " :\""+ tmp +"\"");
						}
					}
				}
			}else{
				Log.d(TAG,"get \"" + tmp +"\" convert:" +No + " :\""+ dxfReader.readLine()+"\"");
			}
		}
	}

	private static void get3Dfase(PanPrigon panPrigon) throws IOException {
		String tmp;
		while(dxfReader.ready()){
			if(dxfReader.markSupported())
				dxfReader.mark(1024);
			tmp = dxfReader.readLine();
			int No;
			try {
				String repTmp = tmp.replaceAll("[\r\n\t ]+", "");
				No = Integer.parseInt(repTmp);
			} catch (Exception e) {
				No = -1;
			}
			
			if(No == 0){	
				if(dxfReader.markSupported())dxfReader.reset();
				return;
			}
			switch(No){
			case 10:
			case 11:
			case 12:
			case 13:
			case 20:
			case 21:
			case 22:
			case 23:
			case 30:
			case 31:
			case 32:
			case 33:
				panPrigon.setParam((No/10),(No%10),dxfReader.readLine());
				break;
			case 8:
				panPrigon.Name = dxfReader.readLine();
				break;
			case 64:
				panPrigon.setColorCode(dxfReader.readLine());
			default :
				Log.d(TAG,"get3Dfase convert:" +No + " :\""+ dxfReader.readLine()+"\"");
				break;
			}
		}
	}

	private static void getSection(PanPrigon panMesh) throws IOException {
		String tmp;
		while(dxfReader.ready()){
			if(dxfReader.markSupported())
				dxfReader.mark(1024);
			tmp = dxfReader.readLine();
			int No;
			try {
				String repTmp = tmp.replaceAll("[\r\n\t ]+", "");
				No = Integer.parseInt(repTmp);
			} catch (Exception e) {
				No = -1;
			}
			
			if(No == 0){	
				if(dxfReader.markSupported())dxfReader.reset();
				return;
			}
			switch(No){
			case 2:
			case 999:
				Log.d(TAG,"getSection  convert:" +No + " :\""+ dxfReader.readLine()+"\"");
				break;
			default :{
					Log.d(TAG,"getSection \"" + tmp +"\" convert:" +No + " :\""+ dxfReader.readLine()+"\"");
				}
			}
		}
	}
	
}
