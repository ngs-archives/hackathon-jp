package com.android_hackathon01.lifestyle;

import android.webkit.WebView;
import com.google.api.translate.Translate;

/**
 * This is Wrapper Class of com.google.api.translate.Translate
 * @author iizuka
 *
 */
public class Translation {
	public Translation() {}
	/**
	 * WebView wv = new WebView(this);
	 * setContentView(wv);
	 * Translation t = new Translation();
	 * t.work(mv, "This is a pen", "je");
	 * @param wv
	 * @param message
	 * @param targetStr
	 * @Deprecated Due to test code of HackThon
	 */
	public void work(WebView wv, String message, String targetStr) {
		if (targetStr.equals("ej") || targetStr.equals("je")) {
			wv.loadUrl("http://pipes.yahoo.com/poolmmjp/" + targetStr + "_translation_api?_render=rss&text=" + message);
		}
	}
	/**
	 * This is Simple translate method second and third args are detemined with Language Class.
	 * @param text
	 * @param fromLang
	 * @param toLang
	 * @return string translated text
	 * @throws Exception
	 */
	public static String translate(String text, String fromLang, String toLang) throws Exception {
		String transText = Translate.translate(text, fromLang, toLang);
		return transText;
	}
}
