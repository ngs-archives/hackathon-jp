package android.scouter.control;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import android.scouter.entity.PersonInfo;
import android.scouter.entity.SettingData;
import android.util.Log;

/**
 * サーバーとの接続とデータ交換を管理するインターフェース
 * 
 * @since 2008/03/20
 * 
 */
public class ServerInterface {

	private static final String TAG_NAME = "ServerInterface";
	private static final boolean DEBUG_FLG = true;

	public static List<PersonInfo> ping(PersonInfo personInfo, int range) {

		// パラメータの構築
		final String param = "?id=" + personInfo.getID() +
						"&geo_x=" + personInfo.getGeoLatitude() +
						"&geo_y=" + personInfo.getGeoLongitude()+
						"&range=" + range;

		InputStream inputStream = null;
		
		try {
			
			inputStream = httpGet(SettingData.SERVER_API_URL, param);
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return getPersonInfoListFromXML(inputStream);
	}
	
	/**
	 * 個人情報のリストを取得
	 * @param inputStream
	 * @return PersonInfoが格納されたリスト
	 */
	private static List<PersonInfo> getPersonInfoListFromXML(InputStream inputStream) {

		// NULLチェック
		if (inputStream == null) {
			return null;
		}

		// 返却する結果
		final ArrayList<PersonInfo> resultList = new ArrayList<PersonInfo>();

		XmlPullParser xmlPullParser = null;
		XmlPullParserFactory xmlPullParserFactory = null;
		int eventType = -1;
		
		try {
			xmlPullParserFactory = XmlPullParserFactory.newInstance();
			xmlPullParser = xmlPullParserFactory.newPullParser();
			xmlPullParser.setInput(inputStream, "UTF-8");
		} catch (XmlPullParserException e) {
			e.printStackTrace();
		}
		xmlPullParserFactory.setNamespaceAware(true);

		try {
			
			boolean dataTagStarted = false;
			boolean dataIDTagStarted = false;
			boolean dataNameTagStarted = false;
			boolean dataGeoXTagStarted = false;
			boolean dataGeoYTagStarted = false;
			boolean dataPictureTagStarted = false;
			boolean dataPowerTagStarted = false;
			boolean dataProfileTagStarted = false;
			boolean dataModifiedTagStarted = false;

			// 一時データ
			PersonInfo tmpData = null;
			
			// ドキュメント終了までループを継続する
			while( ( eventType = xmlPullParser.next() ) != XmlPullParser.END_DOCUMENT ) {
				
				// 開始タグ
				if( eventType == XmlPullParser.START_TAG ) {

					// タグ名
					String tagName = xmlPullParser.getName();

					if(DEBUG_FLG) {
						Log.d(TAG_NAME, tagName );
					}

					if(tagName.equals("data")) {
						dataTagStarted = true;
						
						// 人物情報のインスタンス化
						tmpData = new PersonInfo();
						
					} else if(dataTagStarted && tagName.equals("id")) {
						dataIDTagStarted = true;

					} else if(dataTagStarted && tagName.equals("name")) {
						dataNameTagStarted = true;
						
					} else if(dataTagStarted && tagName.equals("geo_x")) {
						dataGeoXTagStarted = true;

					} else if(dataTagStarted && tagName.equals("geo_y")) {
						dataGeoYTagStarted = true;

					} else if(dataTagStarted && tagName.equals("picture")) {
						dataPictureTagStarted = true;

					} else if(dataTagStarted && tagName.equals("power")) {
						dataPowerTagStarted = true;

					} else if(dataTagStarted && tagName.equals("profile")) {
						dataProfileTagStarted = true;
					
					} else if(dataTagStarted && tagName.equals("modified")) {
						dataModifiedTagStarted = true;
					}

				// 文字
				} else if( eventType == XmlPullParser.TEXT ) {

					String text = xmlPullParser.getText();
					if( dataIDTagStarted ) {
						tmpData.setID(text);
					
					} else if( dataNameTagStarted ) {
						tmpData.setName(text);
					
					} else if( dataGeoXTagStarted ) {
						tmpData.setGeoLongitude(text);

					} else if( dataGeoYTagStarted ) {
						tmpData.setGeoLatitude(text);
					
					} else if( dataPictureTagStarted ) {
						tmpData.setPicture(text);
					
					} else if( dataPowerTagStarted ) {
						tmpData.setPower(text);

					} else if( dataProfileTagStarted ) {
						tmpData.setProfile(text);

					} else if( dataModifiedTagStarted ) {
						tmpData.setModified(text);

					}

				// 終了タグ
				} else if( eventType == XmlPullParser.END_TAG ) {

					// タグ名
					String tagName = xmlPullParser.getName();

					if(tagName.equals("data")) {
						dataTagStarted = false;
						
						// 人物情報をリストに追加
						resultList.add(tmpData);

					} else if(dataTagStarted && tagName.equals("id")) {
						dataIDTagStarted = false;

					} else if(dataTagStarted && tagName.equals("name")) {
						dataNameTagStarted = false;
						
					} else if(dataTagStarted && tagName.equals("geo_x")) {
						dataGeoXTagStarted = false;

					} else if(dataTagStarted && tagName.equals("geo_y")) {
						dataGeoYTagStarted = false;

					} else if(dataTagStarted && tagName.equals("picture")) {
						dataPictureTagStarted = false;

					} else if(dataTagStarted && tagName.equals("power")) {
						dataPowerTagStarted = false;

					} else if(dataTagStarted && tagName.equals("profile")) {
						dataProfileTagStarted = false;
					
					} else if(dataTagStarted && tagName.equals("modified")) {
						dataModifiedTagStarted = false;
					}

				}
				
			}

		} catch (XmlPullParserException e) {
			if(DEBUG_FLG) {
				Log.d(TAG_NAME, e.getMessage());
			}
		} catch (IOException e) {
			if(DEBUG_FLG) {
				Log.d(TAG_NAME, e.getMessage());
			}
		}


		return resultList;
	}
	
	/**
	 * HTTP GETでコンテンツを取得する
	 * 
	 * @param url
	 * @param getParam
	 * @return
	 * @throws IOException
	 */
	private static InputStream httpGet(String url, String getParam)
										throws IOException {

		// GET_URLの生成
		String getURL = url;
		if (getParam != null) {
			getURL += getParam;
		}
		
		DefaultHttpClient con = new DefaultHttpClient();

		// 接続
		HttpEntity res = con.execute(new HttpGet(getURL)).getEntity();

		// 結果の返却
		return res.getContent();
		
	}
}
