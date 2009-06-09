package jp.lnc.DirectxMeshLoder;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class XfileMeshTree {
	List<CharSequence> string =new ArrayList<CharSequence>();
	List<XfileMeshTree> subTree = new ArrayList<XfileMeshTree>();
	public List<XfileMeshTree> TemplateList ;
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
		string.add(subSequence);
	}
	
	public void addSubTree(XfileMeshTree sub){
		subTree.add(sub);
	}

	public XfileMeshTree getUp() {
		return mainTree;
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
		for(int i=0 ; i<TemplateList.size() ; i++){
			XfileMeshTree bean = TemplateList.get(i);
			bean.printTree(tabNum+1);
		}
	}

	public XfileMeshTree addNewSubTree(XType type) {
		
		XfileMeshTree sub = new XfileMeshTree(this,type);
		sub.addTmplateList(this.TemplateList);
		addSubTree(sub);
		if(type.typeNo == 2)TemplateList.add(sub);
		return sub;
	}

	public void addTmplateList(List<XfileMeshTree> templateList2) {
		this.TemplateList = templateList2;
		
	}
}
