package android.scouter.util;

import java.util.Properties;

public class Converter {

	/**
	 * 要求文字列を、パラメータ毎に分割する
	 * @param url 要求文字列 - http://xxx.jp/index.html?param1=value1 の形式
	 * @return
	 */
	public static Properties url2parameter(String url) {

		// 返却する結果
		final Properties result = new Properties();

		final StringBuilder sb = new StringBuilder(url);
		
		// 文字 "?" 以前を削除
		sb.delete(0, (sb.indexOf("?") + 1) );
		
		final String parameters = sb.toString();
		
		// パラメータを分割
		final String[] paramArray = parameters.split("&");
		
		final int NAME_INDEX = 0;
		final int VALUE_INDEX = 1;
		
		// パラメータ名と値を格納
		for(String param: paramArray) {
		
			final String[] valueArray = param.split("=");

			final String name = valueArray[NAME_INDEX];
			final String value = valueArray[VALUE_INDEX];
			
			result.put(name, value);
		}

		// 結果の返却
		return result;
		
	}
}
