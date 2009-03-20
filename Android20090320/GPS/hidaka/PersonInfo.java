package android.Screen.TestView;

import java.util.List;
import android.widget.Toast;

//人情報格納用
public class PersonInfo extends BaseInfo {
	// ServerのURL
	private static final String SERVER_URL = "http://android-scouter.appspot.com/data/";
	public static final String TAG_DATA = "data";
	public static final String TAG_ID = "id";
	public static final String TAG_NAME = "name";
	public static final String TAG_GEO_X = "geo_x";
	public static final String TAG_GEO_Y = "geo_y";
	public static final String TAG_PICTURE = "picure";
	public static final String TAG_POWER = "power";
	public static final String TAG_PROFILE = "profile";
	public static final String TAG_MODIFIED = "modified";
	public static final String TAG_CREATE = "created";
	public String person_id;
	public String person_name;
	public String person_geo_x;
	public String person_geo_y;
	public String person_picture;
	public String person_power;
	public String person_profile;
	public String person_modified;
	public String person_created;

	private List<PersonInfo> personInfoList;
	private int latitude;
	private int longitude;

	private String range;

	private double user_lat;
	private double user_lon;
	private int user_rng;
	private double user_dID;

	// デフォルトコンストラクタ
	public PersonInfo() {
	}

	// GPS情報を保持する
	public PersonInfo(double latitude, double longitude, int range,double devID) {
		this.user_lat = latitude;
		this.user_lon = longitude;
		this.user_rng = range;
		this.user_dID = devID;
		/*
		// TODO 自動生成されたコンストラクター・スタブ
		this.latitude = latitude;
		this.longitude = longitude;
		this.range = range;
		*/
	}

	public void setPersonInfoList() {

		/*
		String lat;
		String lng;
		lat = divideE6(latitude + "");
		lng = divideE6(longitude + "");
		*/
		String url = SERVER_URL;// + lat + "," + lng + ADDRESS_URL_SUFFIX +
		url = SERVER_URL +"?id="+user_dID+"&geo_x="+user_lat+"&geo_y="+user_lon+"&range="+user_rng;
		// apiKey;
		//http://android-scouter.appspot.com/data/?id=XXXXXX&geo_x=XX.XXXX&geo_y=XX.XXXX&range=1000



		is = Web.accessURL(url);
		XmlParserFromUrl xmlParserFromUrl = new XmlParserFromUrl();
		personInfoList = xmlParserFromUrl.getPersonInfoListFromXML(is);

		close();
		/*
		*/
	}

	private String divideE6(String numStr) {
		// TODO 自動生成されたメソッド・スタブ
		StringBuffer bf = new StringBuffer();

		bf.append(numStr);
		bf.insert(numStr.length() - 6, ".");

		return bf.toString();
	}

	// 人情報を提供
	public List<PersonInfo> getCityInfoList() {
		return personInfoList;
	}
}
