package org.toss.janken;

import java.util.HashMap;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.widget.SlidingDrawer;

public class ResultRequest implements Runnable {
	private Handler mHandler = null;
	private Settings setting;
	public ResultRequest(Context context, Handler handler) {
		setting = new Settings(context);
		mHandler = handler;
	}
	
	public void run() {
		String result = null;
		int retry = 10;
		
		while (retry>0) {
			result = JankenApi.getResult(setting.get("userid"));
			if (result!=null && !result.startsWith("N")) {
				//"N"ˆÈŠO‚Ìê‡
				break;
			}
			retry--;
		}
		if (result==null) {
			//Ÿ‚Á‚½‚±‚Æ‚É‚µ‚Æ‚­
			result = "W";
		}
		Message msg = new Message();
		msg.obj = result;
		mHandler.sendMessage(msg);
	}
}


