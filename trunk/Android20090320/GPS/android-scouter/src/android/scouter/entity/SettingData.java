package android.scouter.entity;

import java.io.Serializable;

/**
 * 基本設定
 * 
 * @description
 * アプリ全体の基本的な情報を本クラスで設定する
 * 
 * @since 2008/03/22
 * @author Keiji Ariyama <keiji_ariyama@c-lis.co.jp>
 *
 */
public class SettingData implements Serializable {

	/**
	 * シリアル化ID
	 */
	private static final long serialVersionUID = 4120399695475456566L;

	/**
	 * APIのURL
	 */
	public static final String SERVER_API_URL = "http://android-scouter.appspot.com/data/?id=XXXXXX&geo_x=XX.XXXX&geo_y=XX.XXXX&range=1000";
	
	/**
	 * 取得する範囲
	 */
	public static int RANGE = 1000;
}
