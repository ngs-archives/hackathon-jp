package android.social;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import org.opensocial.data.OpenSocialActivity;
import org.opensocial.data.OpenSocialField;
import org.opensocial.data.OpenSocialPerson;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

class UIUpdater extends Thread {
	
	private BackgroundService service;
	private List<ActivityHolder> holders;
	private NotificationGenerator notificationGenerator;

	UIUpdater(BackgroundService service, List<ActivityHolder> holders) {
		super();
		this.service = service;
		this.holders = holders;
		notificationGenerator = new NotificationGenerator(service);
	}

	synchronized public void run() {
		// Toast.makeText(BackgroundService.this, i + ": Size = " +
		// activitiesMap.size(), Toast.LENGTH_SHORT).show();
		showToast();
	}

	protected void showToast() {
		for (ActivityHolder holder : holders) {
			Bitmap bitmap = null;
			//
			OpenSocialPerson person = holder.getPerson();
			OpenSocialActivity activity = holder.getActivity();
			//
			OpenSocialField thumbnailUrlField = person.getField("thumbnailUrl");
			String thumbnailUrl = thumbnailUrlField.getStringValue();
			String displayName = person.getDisplayName();
			//
			try {
				HttpURLConnection connection = ((HttpURLConnection) (new URL(thumbnailUrl)).openConnection());
				connection.setDoInput(true);
				connection.connect();
				InputStream stream = connection.getInputStream();
				bitmap = BitmapFactory.decodeStream(stream);
			} catch(IOException e) {
				// nop
			}
			// create the view
			LayoutInflater vi = (LayoutInflater) this.service.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			View view = vi.inflate(R.layout.toast, null);
			// set the text in the view
			TextView tvName = (TextView) view.findViewById(R.id.name);
			tvName.setText(displayName);
			TextView tvActivity = (TextView) view.findViewById(R.id.activity);
			// tvActivity.setText("Supercalifragilisticexpialidocoius floccinaucinihilipification");
			//
			tvActivity.setText(activity.getTitle());
			ImageView iv = (ImageView) view.findViewById(R.id.image);
			if (bitmap != null) {
				iv.setImageBitmap(bitmap);
			}
			// show the toast
			Toast toast = new Toast(this.service);
			toast.setView(view);
			toast.setDuration(Toast.LENGTH_LONG);
			toast.show();
			// show the notification
			notificationGenerator.add(activity);
		}
	}

}