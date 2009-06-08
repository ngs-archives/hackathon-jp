package jp.lnc.DirectxMeshLoder;

public class XType {

	private String Type = "";
	private String Name = "";
	public int typeNo = 0;
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
		String[] strings = Name.split(" ");
		
	}

	public String getName() {
		// TODO Auto-generated method stub
		return Name;
	}

}
