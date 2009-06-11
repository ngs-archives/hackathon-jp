package jp.lnc.MeshLoader.DirectxMeshLoder;

import java.util.List;

abstract class TmplateFuctry {

	static final String[] templateKeyWord ={"WORD","DWORD","FLOAT","array"};
		  abstract public void getVlue(String s);
		  abstract public void create();
		  static TmplateFuctry getFactory(String[] tmpArray) {
			
		    if (tmpArray[0].equals(templateKeyWord[0])) {
		      return new WordFactory();
		    } else if (tmpArray[0].equals(templateKeyWord[1])){
		      return new DwordFactory();
		    }else if (tmpArray[0].equals(templateKeyWord[2])){
		      return new FloatFactory();
		    }
		    return null;
		  }
		public static List<TmplateFuctry> getFactory(List<CharSequence> string,List<TmplateFuctry> templateFactryList) {
			for(int i=0 ; i<string.size() ; i++){
				
				String tmp = (String) string.get(i);
				String[] tmpArray = tmp.split("[ ;]");
				TmplateFuctry factory = getFactory(tmpArray);
				if(factory!=null){
					templateFactryList.add(factory);
					factory.getClass();
				}
			}
			return templateFactryList;
		}

}







