package com.google.code.hackathon.jp.geo;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class WakeupBroadcastReceiver extends BroadcastReceiver {

	@Override
	public void onReceive(Context arg0, Intent arg1) {
		if (Intent.ACTION_BOOT_COMPLETED.equals(arg1.getAction())) {
			Intent intent = new Intent(arg0, WiFiLocatorService.class);
			arg0.startService(intent);
		}
	}

}
