package android.social;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.opensocial.client.OpenSocialBatch;
import org.opensocial.client.OpenSocialClient;
import org.opensocial.client.OpenSocialProvider;
import org.opensocial.client.OpenSocialRequest;
import org.opensocial.client.OpenSocialRequestException;
import org.opensocial.client.Token;
import org.opensocial.data.OpenSocialField;
import org.opensocial.data.OpenSocialPerson;
import org.opensocial.data.OpenSocialActivity;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

public class BackgroundService extends Service
{
	private Integer waitSec;
	private List<OpenSocialPerson> friends;
	private OpenSocialClient client;

	@Override
	public IBinder onBind(Intent intent)
	{
		return null;
	}
	
	public void onStart(Intent intent, int startID)
	{
		waitSec = intent.getExtras().getInt("waitSec");
		client = (OpenSocialClient)intent.getExtras().getSerializable("client");
		friends = ((FriendsHolder)intent.getExtras().getSerializable("friends")).getFriends();
		
		//
		Thread t = new WorkingThread();
		t.start();
	}
	
  class UIUpdater extends Thread
  {
	private Map<OpenSocialPerson, List<OpenSocialActivity>> activitiesMap;
	private int i;
	
	UIUpdater(Map<OpenSocialPerson, List<OpenSocialActivity>> activitiesMap, int i) {
		super();
		this.activitiesMap = activitiesMap;
		this.i = i;
	}
	
    synchronized public void run()
    {
//	    Toast.makeText(BackgroundService.this, i + ": Size = " + activitiesMap.size(), Toast.LENGTH_SHORT).show();
    	showToast();
    }
    
    protected void showToast() {
        Bitmap bitmap;
        HttpURLConnection connection;
        
        Set<Entry<OpenSocialPerson, List<OpenSocialActivity>>> entrySet = activitiesMap.entrySet();
        Iterator<Entry<OpenSocialPerson, List<OpenSocialActivity>>> iterator = entrySet.iterator();
        Entry<OpenSocialPerson, List<OpenSocialActivity>> first = iterator.next();
        OpenSocialPerson person = first.getKey();
        Log.d("aaa", person.toString());
        List<OpenSocialActivity> activities = first.getValue();
        
        OpenSocialField thumbnailUrlField = person.getField("thumbnailUrl");
        String thumbnailUrl = thumbnailUrlField.getStringValue();
        String displayName = person.getDisplayName();
        
        try
        {
            Log.d("thumbnailUrl","-");
            connection = ((HttpURLConnection)(new URL(thumbnailUrl)).openConnection());
            connection.setDoInput(true);
            connection.connect();
            InputStream stream = connection.getInputStream();
            bitmap = BitmapFactory.decodeStream(stream);

            // create the view
            LayoutInflater vi = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View view = vi.inflate(R.layout.toast, null);

            // set the text in the view
            TextView tvName = (TextView)view.findViewById(R.id.name);
            tvName.setText(displayName);
            TextView tvActivity = (TextView)view.findViewById(R.id.activity);
//            tvActivity.setText("Supercalifragilisticexpialidocoius floccinaucinihilipification");
            int a = i;
            if (a >= (activities.size() - 1)) {
            	a = activities.size() - 1;
            }
            OpenSocialActivity activity = activities.get(a);
            tvActivity.setText(activity.getTitle());
            ImageView iv = (ImageView)view.findViewById(R.id.image);
            iv.setImageBitmap(bitmap);

            // show the toast
            Toast toast = new Toast(BackgroundService.this);
            toast.setView(view);
            toast.setDuration(Toast.LENGTH_LONG);
            toast.show();
        }
        catch (MalformedURLException e)
        {
            e.printStackTrace();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
      }
    
  }

  class WorkingThread extends Thread
	{
		private final Handler mHandler;
		public WorkingThread()
		{
			mHandler = new Handler();
		}
		
		@Override
		public void run()
		{
			for (int i = 0; i < 5; i++) {
				try
				{
					WorkingThread.sleep(waitSec.intValue());
				}
				catch (InterruptedException e)
				{
					e.printStackTrace();
					Log.d("Error", "-");
				}
				//
				Map<OpenSocialPerson, List<OpenSocialActivity>> activitiesMap = fetchActivities();
				//
				mHandler.post(new UIUpdater(activitiesMap, i));
			}
			BackgroundService.this.stopSelf();
		}

		private Map<OpenSocialPerson, List<OpenSocialActivity>> fetchActivities() {
			Map<OpenSocialPerson, List<OpenSocialActivity>> resultMap = new HashMap<OpenSocialPerson, List<OpenSocialActivity>>();
			for (OpenSocialPerson friend : friends) {
				try {
					List<OpenSocialActivity> activities = client.fetchActivitiesForPerson(friend.getId());
					resultMap.put(friend, activities);
				} catch (OpenSocialRequestException e) {
					throw new IllegalStateException(e);
				} catch (IOException e) {
					throw new IllegalStateException(e);
				}
			}
			return resultMap;
		}
		
	};
	
}