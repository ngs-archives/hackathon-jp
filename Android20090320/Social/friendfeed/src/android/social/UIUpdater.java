package android.social;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.opensocial.data.OpenSocialActivity;
import org.opensocial.data.OpenSocialField;
import org.opensocial.data.OpenSocialPerson;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

class UIUpdater extends Thread {
	
	private BackgroundService service;
	private Map<OpenSocialPerson, List<OpenSocialActivity>> activitiesMap;

	UIUpdater(BackgroundService service, Map<OpenSocialPerson, List<OpenSocialActivity>> activitiesMap) {
		super();
		this.service = service;
		this.activitiesMap = activitiesMap;
	}

	synchronized public void run() {
		// Toast.makeText(BackgroundService.this, i + ": Size = " +
		// activitiesMap.size(), Toast.LENGTH_SHORT).show();
		showToast();
	}

	protected void showToast() {
		Bitmap bitmap = null;
		HttpURLConnection connection;

		Set<Entry<OpenSocialPerson, List<OpenSocialActivity>>> entrySet = activitiesMap
				.entrySet();
		Iterator<Entry<OpenSocialPerson, List<OpenSocialActivity>>> iterator = entrySet
				.iterator();
		Entry<OpenSocialPerson, List<OpenSocialActivity>> first = iterator
				.next();
		OpenSocialPerson person = first.getKey();
		List<OpenSocialActivity> activities = first.getValue();

		OpenSocialField thumbnailUrlField = person.getField("thumbnailUrl");
		String thumbnailUrl = thumbnailUrlField.getStringValue();
		String displayName = person.getDisplayName();

		Log.d("thumbnailUrl", "-");
		try {
			connection = ((HttpURLConnection) (new URL(thumbnailUrl)).openConnection());
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
		OpenSocialActivity activity = activities.get(0);
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
	}

}