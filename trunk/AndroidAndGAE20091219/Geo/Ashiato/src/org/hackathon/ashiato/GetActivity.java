package org.hackathon.ashiato;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.Proxy;
import java.net.URL;
import java.net.URLEncoder;

import javax.net.ssl.HttpsURLConnection;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;


public class GetActivity extends Activity {
	private Proxy ConProxy;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//プロクシの設定
		ConProxy = Proxy.NO_PROXY;
		
		HttpURLConnection con;
		try {
			//HTTPコネクションインスタンスの生成
			con = (HttpsURLConnection) (new URL(
					"http://hackathon-ashiato.appspot.com/ashi/get"))
					.openConnection(ConProxy);
		} catch (MalformedURLException e) {
			e.printStackTrace();
			finish();
			return;
		} catch (IOException e) {
			e.printStackTrace();
			finish();
			return;
		}
		//出力の許可等の設定
		con.setDoOutput(true);
		HttpURLConnection.setFollowRedirects(false);
		con.setInstanceFollowRedirects(false);
		try {
			//メソッドタイプの指定
			con.setRequestMethod("POST");
		} catch (ProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//POSTデータの作成
		StringBuffer sb = new StringBuffer(4096);
		sb.append("email=");
		sb.append("user@lnc.jp");
		OutputStream os;
		//POSTの送信
		try {
			os = con.getOutputStream();
			os.write(sb.substring(0).getBytes());
			os.flush();
			os.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			//レスポンスの読み込み
			BufferedReader br;
			br = new BufferedReader(new InputStreamReader(con
					.getInputStream(), "UTF-8"));

			//レスポンスの取得
			String ret;
			int index = -1;
			while ((ret = br.readLine()) != null && index < 0) {
				Log.d(getPackageName(), ret);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
