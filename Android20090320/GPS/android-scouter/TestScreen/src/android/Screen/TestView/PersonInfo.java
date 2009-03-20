package android.Screen.TestView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

//人情報格納用
public class PersonInfo extends BaseInfo {
	// ServerのURL
	private static final String SERVER_URL = "http://android-scouter.appspot.com/data/?id=XXXXXX&geo_x=XX.XXXX&geo_y=XX.XXXX&range=1000";
	public static final String TAG_RESULT = "result";
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
	public static final String NG_RESULT = "NG";
	public static final String OK_RESULT = "OK";
	public static final String TAG_RESULT2 = "<result>";
	public static final String TAG_DATA2 = "<data>";
	public static final String TAG_I2 = "<id>";
	public static final String TAG_NAME2 = "<name>";
	public static final String TAG_GEO_X2 = "<geo_x>";
	public static final String TAG_GEO_Y2 = "<geo_y>";
	public static final String TAG_PICTURE2 = "<picure>";
	public static final String TAG_POWER2 = "<power>";
	public static final String TAG_PROFILE2 = "<profile>";
	public static final String TAG_MODIFIED2 = "<modified>";
	public static final String TAG_CREATE2 = "<created>";

	public String person_result = "NG";
	public String person_id;
	public String person_name;
	public String person_geo_x;
	public String person_geo_y;
	public String person_picture;
	public String person_power;
	public String person_profile;
	public String person_modified;
	public String person_created;
	String st = "";
	private List<PersonInfo> personInfoList;
	private int latitude;
	private int longitude;

	private int szIndex = 0;
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
		 * String lat; String lng; lat = divideE6(latitude + ""); lng =
		 * divideE6(longitude + "");
		 */
		String url = SERVER_URL;// + lat + "," + lng + ADDRESS_URL_SUFFIX +
		url = SERVER_URL +"?id="+user_dID+"&geo_x="+user_lat+"&geo_y="+user_lon+"&range="+user_rng;

		String parm = "";
		/*
		 * try { st = httpGet(SERVER_URL, parm); } catch (IOException e) { //
		 * TODO 自動生成された catch ブロック e.printStackTrace(); }
		 *
		 * if (st.compareTo(PersonInfo.TAG_RESULT2) == 0) { szIndex =
		 * st.indexOf(PersonInfo.TAG_RESULT2); }
		 */// 値を格納する処理
		// apiKey;

		is = Web.accessURL(url);

		XmlParserFromUrl xmlParserFromUrl = new XmlParserFromUrl();
		personInfoList = xmlParserFromUrl.getPersonInfoListFromXML(is);

		close();
	}

	public static String httpGet(String url, String getParam)
			throws IOException {

		// GET_URLの生成
		String getURL = url;
		if (getParam != null) {
			getURL += getParam;
		}

		// 返却する結果
		String result = null;

		DefaultHttpClient con = new DefaultHttpClient();
		HttpEntity res = con.execute(new HttpGet(getURL)).getEntity();

		InputStream input = res.getContent();
		InputStreamReader in = new InputStreamReader(input);

		BufferedReader reader = new BufferedReader(in);

		// 受信用バッファ
		StringBuffer sb = new StringBuffer();
		String str = null;

		// 結果の受信
		while ((str = reader.readLine()) != null) {
			sb.append(str);
		}

		// 文字列の取得
		result = sb.toString();

		// ストリームを閉じる
		reader.close();
		input.close();

		// 結果の返却
		return result;
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
