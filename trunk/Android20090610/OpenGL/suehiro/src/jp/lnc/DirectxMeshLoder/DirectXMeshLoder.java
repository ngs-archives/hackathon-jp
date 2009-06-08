package jp.lnc.DirectxMeshLoder;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jp.lnc.MeshLoader.PanMesh;

public class DirectXMeshLoder {
	static Matcher matcher;
	public static XfileMeshTree topMesh = new XfileMeshTree();
	List<XfileMeshTree> templateList = new ArrayList<XfileMeshTree>();
	protected Pattern spSplit = Pattern.compile(" ");
	protected final Pattern repCRpttern = Pattern.compile("[ \n\r\t]+");
	protected final Pattern keyWord = Pattern.compile("Frame|template|FrameTransformMatrix|AnimationKey|template");
	protected Pattern templatePttern ;
	protected final String[] sToken = {"Frame","template","FrameTransformMatrix","AnimationKey"};
	static XfileMeshTree mesh =topMesh;
	
	protected enum eTypeNo {Frame,template,FrameTransformMatrix,AnimationKey};
	
	public static XType xType = new XType();
	
	public static PanMesh XMeshLoader (File file){
		FileReader fis;
		PanMesh ret = null;
		try {
			fis = new FileReader(file);
			ret = XMeshLoader(fis);
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
	public static BufferedReader XReader;
	
	public static PanMesh XMeshLoader (Reader input){
		XReader = new BufferedReader(input);
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
		while(XReader.ready()){
			tmp = XReader.readLine();
			XLinePaser(tmp);
		}
		
	}
	static public MatchResult object;
	static public String tail = "";
	
	static void XLinePaser(String str){
		int startIndex = 0;
		Pattern pattern = Pattern.compile("[;{}]",1);
		matcher = pattern.matcher(tail + str);
		
		while(matcher.find()){
			object = matcher.toMatchResult();
			
			if(matcher.group().equalsIgnoreCase("}")){
				mesh.addString(str.subSequence(startIndex,matcher.start()));
				mesh = mesh.getUp();
				
			}else if(matcher.group().equalsIgnoreCase("{")){
				xType = new XType();
				xType.setName(str.subSequence(startIndex,matcher.start()));
				mesh = mesh.addNewSubTree(xType);
			}else if(matcher.group().equalsIgnoreCase(";")){
				mesh.addString(str.subSequence(startIndex,matcher.end()));
			}
			startIndex = matcher.end();
		}
		if(startIndex!=matcher.regionEnd())
			mesh.addString(str.subSequence(startIndex,matcher.regionEnd()));
	}
}
