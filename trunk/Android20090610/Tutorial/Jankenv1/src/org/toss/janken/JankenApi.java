package org.toss.janken;

import java.io.IOException;
import java.util.HashMap;

import org.apache.http.client.ClientProtocolException;

import android.util.Log;

public class JankenApi {
	static final String JANKEN_GU = "G"; 
	static final String JANKEN_CHOKI = "C"; 
	static final String JANKEN_PAR = "P"; 
	static public String login(String nickname) {
		String result = null;
		HashMap<String,String> map = new HashMap<String,String>();
		map.put("command","login");
		map.put("nickname",nickname);
		try {
			result = httpClient.Get("http://janken-srv.appspot.com/", map);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}
	static public String getMemberlist(String userid) {
		HashMap<String,String> map = new HashMap<String,String>();
		String result = null;
		map.put("command","memberlist");
		try {
			result = httpClient.Get("http://janken-srv.appspot.com/", map);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	static public boolean attack(String userid, String janken) {
		HashMap<String,String> map = new HashMap<String,String>();
		String result = null;
		map.put("command","janken");
		map.put("userid",userid);
		map.put("janken",janken);
		try {
			result = httpClient.Get("http://janken-srv.appspot.com/", map);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		//TODO:結果が入っていれば成功したとみなしているがちゃんとチェック処理を入れないとあかん
		return result==null?false:true;
	}
}
