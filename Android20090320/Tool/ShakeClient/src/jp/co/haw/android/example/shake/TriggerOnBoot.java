package jp.co.haw.android.example.shake;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class TriggerOnBoot extends BroadcastReceiver {

	@Override
	public void onReceive(Context context, Intent intent) {
		if("android.intent.action.BOOT_COMPLETED".equals(intent.getAction())) {
			Intent newIntent = new Intent(Intent.ACTION_VIEW);
			newIntent = new Intent(context, ShakeDetector.class);
			context.startActivity(newIntent);
		}
		
	}

}
