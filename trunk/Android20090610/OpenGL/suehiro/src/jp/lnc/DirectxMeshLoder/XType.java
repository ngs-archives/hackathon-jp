package jp.lnc.DirectxMeshLoder;

public class XType {

	private String Type = "";
	private String Name = "";
	public int typeNo = 999;
	static protected final String[] sToken = {"Frame","template","FrameTransformMatrix","AnimationKey"};
	
	
	public void setType(String string, int j) {
		Type = string;
		typeNo = (j+1);
	}

	public String getType() {
		return Type;
	}
	
	public String getString() {
		return ("::::Type of " + Type +  " :" +Name);
	}

	public void setName(CharSequence charSequence) {
		Name = (String) charSequence;
		
	}
	/**
	 * 未処理キャラクタからタイプ名へ変換する
	 * @param charSequence 未処理キャラクタ
	 */
	public void setTypeFromString(CharSequence charSequence) {
		String tmpName = (String) charSequence;
		String[] strings = tmpName.split(" ");
		for(int i=0;i< strings.length ;i++){
			for(int j = 0;j<sToken.length;j++){
				if(strings[i].equalsIgnoreCase(sToken[j])){
					setType(sToken[j], j);
					if((i+1)< strings.length)Name =strings[i+1];
					return;
				}
			}
			Name += strings[i];
		}
		return ;
	}

	public String getName() {
		// TODO Auto-generated method stub
		return Name;
	}

}
