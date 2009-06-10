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
			result = httpClient.Get("http://janken-srv.appspot.com/janeknsvr", map);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		Log.e("janken", "login result="+result);
		return result;
	}
	static public String getMemberlist(String userid) {
		HashMap<String,String> map = new HashMap<String,String>();
		String result = null;
		map.put("command","memberlist");
		try {
			result = httpClient.Get("http://janken-srv.appspot.com/janeknsvr", map);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		Log.e("janken", "getMemberlist result="+result);
		return result;
	}
	
	static public boolean attack(String userid, String janken) {
		HashMap<String,String> map = new HashMap<String,String>();
		String result = null;
		map.put("command","janken");
		map.put("userid",userid);
		map.put("janken",janken);
		try {
			result = httpClient.Get("http://janken-srv.appspot.com/janeknsvr", map);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		Log.e("janken", "attack result="+result);
		//TODO:結果が入っていれば成功したとみなしているがちゃんとチェック処理を入れないとあかん
		return result==null?false:true;
	}

	static public String getResult(String userid) {
		HashMap<String,String> map = new HashMap<String,String>();
		String result = null;
		map.put("command","result");
		map.put("userid",userid);
		try {
			result = httpClient.Get("http://janken-srv.appspot.com/janeknsvr", map);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		Log.e("janken", "getResult result="+result);
		return result;
	}

	static public String cancel(String userid) {
		HashMap<String,String> map = new HashMap<String,String>();
		String result = null;
		map.put("command","cancel");
		map.put("userid",userid);
		try {
			result = httpClient.Get("http://janken-srv.appspot.com/janeknsvr", map);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		Log.e("janken", "cancel result="+result);
		return result;
	}
}
