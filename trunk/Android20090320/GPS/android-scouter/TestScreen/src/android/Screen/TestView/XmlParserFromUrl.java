package android.Screen.TestView;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

public class XmlParserFromUrl {
	private XmlPullParser xpp;
	private XmlPullParserFactory factory;
	private int eventType;
	public String dataString = new String();

	// コンストラクタ
	public XmlParserFromUrl() {
		try {
			factory = XmlPullParserFactory.newInstance();
		} catch (XmlPullParserException e) {
			e.printStackTrace();
		}
		factory.setNamespaceAware(true);
	}

	// XMLからパラメータの個人情報を取得
	public ArrayList<PersonInfo> getPersonInfoListFromXML(InputStream is) {
		ArrayList<PersonInfo> list = new ArrayList<PersonInfo>();
		String tag;
		boolean prefFlag = false;

		if (is == null)
			return null;
		try {
			initXmlPullParser(is);

			while (eventType != XmlPullParser.END_DOCUMENT) {// (eventType =
				// xpp.next())
				// !=
				// XmlPullParser.END_DOCUMENT)
				// {
				// eventType != XmlPullParser.END_DOCUMENT) {
				/*
				 * if (eventType == XmlPullParser.TEXT) { dataString =
				 * xpp.getText();
				 * 
				 * }
				 */
				if (eventType == XmlPullParser.START_TAG) {
					tag = xpp.getName();
					// タグResul
					if (tag.compareTo(PersonInfo.TAG_RESULT) == 0) {
						eventType = xpp.next();
						if (eventType == XmlPullParser.TEXT) {

							dataString = xpp.getText();

						}
						/*
						 * dataString = xpp.getText(); dataString =
						 * xpp.getInputEncoding(); dataString =
						 * xpp.getNamespace();// getInputEncoding(); dataString
						 * = xpp.getNamespace(tag);// getInputEncoding();
						 * dataString = xpp.getPositionDescription();//
						 * getInputEncoding(); dataString = xpp.toString();//
						 * getInputEncoding(); // rel = xpp.ggetInputEncoding();
						 * // dataString = xpp.; dataString =
						 * xpp.getInputEncoding(); dataString =
						 * xpp.getInputEncoding();
						 */

						// rel = xpp.
						if (dataString.compareTo(PersonInfo.NG_RESULT) == 0) {
							// NG結果である場合
							return null;
						}
					}
					// XMLタグがDataである場合
					if (tag.compareTo(PersonInfo.TAG_DATA) == 0) {
						while (eventType == XmlPullParser.START_TAG) {
							PersonInfo tempCity = new PersonInfo();
							tempCity.person_result = dataString;
							// タグがID
							if (tag.compareTo(PersonInfo.TAG_ID) == 0) {
								eventType = xpp.next();
								if (eventType == XmlPullParser.TEXT) {
									tempCity.person_id = xpp.getText();

								}

								// = xpp.getText();
							}
							// name
							if (tag.compareTo(PersonInfo.TAG_NAME) == 0) {
								eventType = xpp.next();
								if (eventType == XmlPullParser.TEXT) {

									tempCity.person_name = xpp.getText();
								}
							}
							// geo_x
							if (tag.compareTo(PersonInfo.TAG_GEO_X) == 0) {
								eventType = xpp.next();
								if (eventType == XmlPullParser.TEXT) {

									tempCity.person_geo_x = xpp.getText();
								}
							}
							// geo_y
							if (tag.compareTo(PersonInfo.TAG_GEO_Y) == 0) {
								eventType = xpp.next();
								if (eventType == XmlPullParser.TEXT) {

									tempCity.person_geo_y = xpp.getText();
								}
							}
							// picture URL
							if (tag.compareTo(PersonInfo.TAG_PICTURE) == 0) {
								eventType = xpp.next();
								if (eventType == XmlPullParser.TEXT) {

									tempCity.person_picture = xpp.getText();
								}
							}
							// power
							if (tag.compareTo(PersonInfo.TAG_POWER) == 0) {
								eventType = xpp.next();
								if (eventType == XmlPullParser.TEXT) {

									tempCity.person_power = xpp.getText();
								}
							}
							// profile
							if (tag.compareTo(PersonInfo.TAG_PROFILE) == 0) {
								eventType = xpp.next();
								if (eventType == XmlPullParser.TEXT) {

									tempCity.person_profile = xpp.getText();
								}
							}
							// moified
							if (tag.compareTo(PersonInfo.TAG_MODIFIED) == 0) {
								eventType = xpp.next();
								if (eventType == XmlPullParser.TEXT) {

									tempCity.person_modified = xpp.getText();
								}
							}
							// create
							if (tag.compareTo(PersonInfo.TAG_CREATE) == 0) {
								eventType = xpp.next();
								if (eventType == XmlPullParser.TEXT) {

									tempCity.person_created = xpp.getText();
								}
							}
							list.add(tempCity);
						}
					}
				} else if (eventType == XmlPullParser.END_TAG) {
					// パラメータの読み込み終了を判断
					break;
				}
				eventType = xpp.next();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

	// タグからテキストを読み込むための補助メソッド （未使用）
	private String getText() throws XmlPullParserException, IOException {
		if (eventType != XmlPullParser.START_TAG) {
			eventType = xpp.next();
			return "UnKnown";
		}

		while (eventType != XmlPullParser.TEXT) {
			eventType = xpp.next();
		}

		return xpp.getText();
	}

	// XmlPullParserの共通初期化メソッド
	private void initXmlPullParser(InputStream is) {
		try {
			xpp = factory.newPullParser();
			xpp.setInput(is, "UTF-8");

		} catch (XmlPullParserException e) {
			e.printStackTrace();
		}

		eventType = 0;
	}
}
