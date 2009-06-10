package com.google.hackathon.reviewgetter;

import android.app.Activity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebView;

public class WebActivity extends Activity{

	private final int FP = ViewGroup.LayoutParams.FILL_PARENT;


	  public void onCreate(Bundle icicle) {
		  super.onCreate(icicle);

		    WebView webview = new WebView(this);
		    setContentView(webview, new ViewGroup.LayoutParams(FP, FP));
	  }

}
