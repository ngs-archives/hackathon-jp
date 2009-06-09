package jp.lnc.DirectxMeshLoder;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import jp.lnc.MeshLoader.PanMesh;


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
		string.add(tmp.trim());
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
	      // ArrayList
		System.out.println(xType.getString());

		for(int i=0 ; i<subTree.size() ; i++){
			XfileMeshTree bean = subTree.get(i);
			switch(bean.xType.typeNo ){
				case 6:
					
					break;
				case 7:
					bean.createPrigon(panMesh);
					break;
				case 8:
					break;
				case 9:
					break;
				default:
			}
			bean.meshCompile(tabNum+1,panMesh);
		}
	}
	
	private void createPrigon(PanMesh panMesh) {
		//System.out.println(string.get(0));
		int meshNum = Integer.valueOf(((String) string.get(0)).replaceAll(";", ""));
		int index = 0;
		float[] newTops= panMesh.newTop();
		for(index++ ; index<(meshNum*4+1) ; index++){
			if(index%4 != 0){
				float top = Float.valueOf(((String) string.get(index)).replace(";", ""));
				//System.out.println(string.get(index));
				//System.out.println(top);
				newTops[(index%4 -1)] = top;
			}else{
				newTops= panMesh.newTop();
			}
		} 
		for(; index<string.size() ; index++){
			String bean = (String) string.get(index);
			System.out.println(bean);
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
