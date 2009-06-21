package jp.lnc.MeshLoader.DirectxMeshLoder;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import android.util.Log;

import jp.lnc.MeshLoader.GenerickMesh.PanMesh;



public class XfileMeshTree {
	List<CharSequence> string =new ArrayList<CharSequence>();
	List<XfileMeshTree> subTree = new ArrayList<XfileMeshTree>();
	public List<XfileMeshTree> templateList ;
	public List<TmplateFuctry> templateFactryList = new ArrayList<TmplateFuctry>();
	XfileMeshTree mainTree = null;
	Pattern repCRpttern = Pattern.compile("[ \t\n]+");
	public XType xType;
	VertexAndTextur tmp;
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



	public void printTree(){
		printTree(0);
	}
	/**
	 * デバッグ用ツリー出力
	 * @param tabNum
	 */
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
		//TmplateFuctry.getFactory(string,templateFactryList);
	}

}
