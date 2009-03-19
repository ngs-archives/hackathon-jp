package jp.mp3;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;

import android.app.Activity;
import android.media.AsyncPlayer;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.widget.TextView;

public class mp3 extends Activity { 
    /** Called when the activity is first created. */ 
    @Override 
    public void onCreate(Bundle icicle) { 
        super.onCreate(icicle); 
        TextView tv = new TextView(this); 
        String greet = "Hello MP3 from internet."; 
        tv.setText(greet); 
        talktext("%82%B6%82%B6%82%B6%82%A9%82%F1%82%AC%82%EA%82%EA%82%EA%82%EA%82%EA%82%EA%82%EA%82%EA");
    }
    
    public void talktext(String msg) {
        try {
//			String msg = "%82%A0%82%C8'%82%BD%82%CC%3B%82%C8%82%DC%82%A6%82%ED%3B%82%C8'%82%F1%82%C5%82%B7%82%A9%81H%81B";
//			msg = "%82%B6%82%A9%82%F1%82%AC%82%EA%82%EA%82%EA%82%EA%82%EA%82%EA%82%EA%82%EA";
			main("http://yomoyomo.jp/CreateSounds.php?t="+msg);
        } catch (IOException e1) {
			// TODO 自動生成された catch ブロック
			e1.printStackTrace();
		}        
        
        Uri  uri=null;
        String url = null;
//        url = "http://yomoyomo.jp/CreateSounds.php?t=%82%ED%82%A2%82%A8%81%5B%82%A6%82%DE%82%B6%82%A5%81%5B%82%A6%81%5B%82%BE%27%82%D4%82%E8%82%E3%81%5B%82%ED%81A%82%A4%82%A1%27%82%F1;%82%B3%27%82%F1%82%B6%82%E3%81%5B;%82%C9%81A%82%E6%27%81%5B%82%CC,%82%B1%82%F1%82%BB%81%5B%82%E9%82%A0%82%D5%82%E8%82%AF%27%81%5B%82%B5%82%E5%82%F1%82%CC%82%BD%82%DF%81A%82%B1%82%DC%82%F1%82%C7%82%D5%82%EB%27%82%F1%82%D5%82%C6%82%A9%82%E7/%82%BD%82%A2%82%D2%27%82%F1%82%AE%82%B5%82%C4/%82%C2%82%A9%82%ED%82%C8%27%82%AF%82%EA%82%CE;%82%C8%82%E8%82%DC%82%B9%27%82%F1%81B";
//        url = "http://podcast.1242.com/sound/1776.mp3";
//        url = "http://startsl.jp/sample.wav";
        url = "http://android.adinterest.biz/sample.mp3";
        
        uri = Uri.parse(url);

//        mMediaPlayer.start();
        
        MediaPlayer _mp;
//        _mp = MediaPlayer.create(this, R.raw.test_cbr);
//        _mp = MediaPlayer.create(this, R.raw.sample);
        _mp = MediaPlayer.create(this, uri);
//        _mp.pause();
//        _mp.setAudioStreamType(3);
        try {
//          _mp.prepare(); // 準備
          _mp.start(); // 再生
        } catch (Exception e) {
          //例外処理
        }

    } 
	
	private static void main (String mp3Path)
	throws IOException
{
	       String convPath = "http://android.adinterest.biz/wav2mp3.php?k=";
//	        String mp3Path = "http://yomoyomo.jp/CreateSounds.php?t=%82%ED%82%A2%82%A8%81%5B%82%A6%82%DE%82%B6%82%A5%81%5B%82%A6%81%5B%82%BE%27%82%D4%82%E8%82%E3%81%5B%82%ED%81A%82%A4%82%A1%27%82%F1;%82%B3%27%82%F1%82%B6%82%E3%81%5B;%82%C9%81A%82%E6%27%81%5B%82%CC,%82%B1%82%F1%82%BB%81%5B%82%E9%82%A0%82%D5%82%E8%82%AF%27%81%5B%82%B5%82%E5%82%F1%82%CC%82%BD%82%DF%81A%82%B1%82%DC%82%F1%82%C7%82%D5%82%EB%27%82%F1%82%D5%82%C6%82%A9%82%E7/%82%BD%82%A2%82%D2%27%82%F1%82%AE%82%B5%82%C4/%82%C2%82%A9%82%ED%82%C8%27%82%AF%82%EA%82%CE;%82%C8%82%E8%82%DC%82%B9%27%82%F1%81B";
	        String uri = convPath + mp3Path;
    
    URL rssurl = new URL(
//  "http://android.adinterest.biz/a.php");      
           		uri);
    
    InputStream is = rssurl.openStream();
    BufferedReader br = new BufferedReader(new InputStreamReader(is,"UTF-8"));
    String buf = "";        
    while((buf = br.readLine()) != null){
    }
    is.close();
    br.close();
}
} 