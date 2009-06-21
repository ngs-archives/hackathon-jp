package jp.lnc.MeshLoader.DirectxMeshLoder;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import android.util.Log;

import jp.lnc.MeshLoader.PanMesh;
import jp.lnc.MeshLoader.PanPrigon;


public class XfileMeshTree {
	List<CharSequence> string =new ArrayList<CharSequence>();
	List<XfileMeshTree> subTree = new ArrayList<XfileMeshTree>();
	public List<XfileMeshTree> templateList ;
	public List<TmplateFuctry> templateFactryList = new ArrayList<TmplateFuctry>();
	XfileMeshTree mainTree = null;
	Pattern repCRpttern = Pattern.compile("[ \t\n]+");
	public XType xType;
	public XfileMeshTree (){
		mainTree =this;
		xType =new XType();
	}
	
	public XfileMeshTree(XfileMeshTree xfileMeshTree, XType type) {
		mainTree = xfileMeshTree;
		xType = type;
	}

	public void addString(CharSequence subSequence) {
		//System.out.println(subSequence);
		subSequence = repCRpttern.matcher(subSequence).replaceAll(" ");
		String tmp = (String) subSequence;
		tmp= tmp.trim();
		if(tmp.length()!=0)
		string.add(tmp);
	}
	
	public void addSubTree(XfileMeshTree sub){
		subTree.add(sub);
	}

	public XfileMeshTree getUp() {
		return mainTree;
	}
	public void meshCompile(PanMesh panMesh){
		meshCompile(0,panMesh);
	}
	
	public void meshCompile(int tabNum, PanMesh panMesh){

		for(int i=0 ; i<subTree.size() ; i++){
			XfileMeshTree bean = subTree.get(i);
			switch(bean.xType.typeNo ){
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					break;
				case 7:
					bean.createPrigon(panMesh);
					break;
				case 8:
					bean.createMaterialList(panMesh);
					break;					
				case 9:
					bean.createMaterial(panMesh);
					break;
				case 10:
					bean.createTextureCoord(panMesh);
					break;
				default:
					System.out.println(bean.xType.getString());
			}
			bean.meshCompile(tabNum+1,panMesh);
		}
	}
	
	private void createTextureCoord(PanMesh panMesh) {
		int meshNum = Integer.valueOf(((String) string.get(0)).replaceAll(";", ""));
		int index = 0;
//		Log.d("XfileMeshTree",(String) string.get(index));
		float[] newTop= panMesh.newTop();
		for(index++ ; index<(meshNum*3+1) ; index++){
			if(index%3 != 0){
				newTop[index%3-1] = Float.valueOf(((String) string.get(index)).replace(";", ""));
				//Log.d("XfileMeshTree",(String) string.get(index));
				
				//System.out.println(top);

			}else{
				//System.out.println("x="+newTop[0]+"y="+newTop[1]+"z="+newTop[2]);
				newTop=  panMesh.newTextureCoord();
			}
		}
		
	}

	private void createMaterial(PanMesh panMesh) {
		// TODO Auto-generated method stub
		
	}

	private void createMaterialList(PanMesh panMesh) {
		int materialNum = Integer.valueOf(((String) string.get(0)).replaceAll(";", ""));
		int machNum = Integer.valueOf(((String) string.get(1)).replaceAll(";", ""));
		for(int i=0;i<machNum;i++){
			int mach = Integer.valueOf(((String) string.get(i + 2)).replaceAll("[;,]", ""));
		}
	}

	private void createPrigon(PanMesh panMesh) {
		System.out.println(string.get(0));
		List<float[]> tops=new ArrayList<float[]>();
		//System.out.println(xType.getString());
		int meshNum = Integer.valueOf(((String) string.get(0)).replaceAll(";", ""));
		int index = 0;
		float[] newTop= panMesh.newTop();
		for(index++ ; index<(meshNum*4+1) ; index++){
			if(index%4 != 0){
				float top = Float.valueOf(((String) string.get(index)).replace(";", ""));
				//System.out.println(string.get(index));
				//System.out.println(top);
				newTop[(index%4 -1)] = top;
			}else{
				//System.out.println("x="+newTop[0]+"y="+newTop[1]+"z="+newTop[2]);
				tops.add(newTop);
				newTop= panMesh.newTop();
			}
		} 
		int prigonNum = Integer.valueOf(((String) string.get(index++)).replaceAll(";", ""));
		int i;
		int topMax = 0;
		for(i=0; i<prigonNum*3 ; i++){
			String bean = (String) string.get(index+i);
			if(i%3 == 1){
				PanPrigon Prigon = panMesh.newPrigon();
				Prigon.vertexNum = topMax;
				String[] strings = bean.split("[,;]");
				for(int j=0;j<topMax;j++){
					int num = Integer.valueOf(strings[j]);
					newTop=tops.get(num);
					Prigon.setParam(j,newTop,num);
				}
			}else if(i%3 == 0){
				topMax = Integer.valueOf(bean.replace(";", ""));
			}
		}
	}

	public void printTree(){
		printTree(0);
	}
	
	public void printTree(int tabNum){
	      // ArrayList
		System.out.println(xType.getString());
		for(int i=0 ; i<string.size() ; i++){
			String bean = (String) string.get(i);
			System.out.println(bean);
		} 
		for(int i=0 ; i<subTree.size() ; i++){
			XfileMeshTree bean = subTree.get(i);
			if(bean.xType.typeNo != 2)bean.printTree(tabNum+1);
		}
	}
	
	public void printTemplate(){
		printTemplate(0);
	}
	
	public void printTemplate(int tabNum){
	      // ArrayList
		for(int i=0 ; i<templateList.size() ; i++){
			XfileMeshTree bean = templateList.get(i);
			bean.printTree(tabNum+1);
		}
	}

	public XfileMeshTree addNewSubTree(XType type) {
		
		XfileMeshTree sub = new XfileMeshTree(this,type);
		sub.addTmplateList(this.templateList);
		addSubTree(sub);
		if(type.typeNo == 2)templateList.add(sub);
		return sub;
	}

	public void addTmplateList(List<XfileMeshTree> templateList2) {
		this.templateList = templateList2;
		
	}
	
	public void compile() {
		TmplateFuctry.getFactory(string,templateFactryList);
	}

}
