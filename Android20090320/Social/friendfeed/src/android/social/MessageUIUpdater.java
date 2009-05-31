package android.social;

import android.widget.Toast;

class MessageUIUpdater extends Thread {
	
	private BackgroundService service;
	private String message;

	MessageUIUpdater(BackgroundService service, String message) {
		super();
		this.service = service;
		this.message = message;
	}

	synchronized public void run() {
		Toast toast = Toast.makeText(service, message, Toast.LENGTH_LONG);
		toast.show();
	}

}