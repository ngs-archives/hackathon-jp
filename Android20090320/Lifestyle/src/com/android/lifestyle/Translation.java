package com.android.lifestyle;

import android.webkit.WebView;

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
	 */
	public void work(WebView wv, String message, String targetStr) {
		if (targetStr.equals("ej") || targetStr.equals("je")) {
			wv.loadUrl("http://pipes.yahoo.com/poolmmjp/" + targetStr + "_translation_api?_render=rss&text=" + message);
		}
	}
}
