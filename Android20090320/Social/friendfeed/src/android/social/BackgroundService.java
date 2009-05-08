package android.social;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.opensocial.android.OpenSocialChooserActivity;
import org.opensocial.client.OpenSocialClient;
import org.opensocial.client.OpenSocialRequestException;
import org.opensocial.data.OpenSocialActivity;
import org.opensocial.data.OpenSocialField;
import org.opensocial.data.OpenSocialPerson;

import android.app.Activity;
import android.app.Service;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

public class BackgroundService extends Service {
	private Integer waitSec;
	private List<OpenSocialPerson> friends;
	private OpenSocialClient client;

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	public void onStart(Intent intent, int startID) {
		waitSec = intent.getExtras().getInt("waitSec");
		client = OpenSocialClientFactory.getClient(this, FriendFeedActivity.SUPPORTED_PROVIDERS);
		friends = ((FriendsHolder) intent.getExtras().getSerializable("friends")).getFriends();
		//
		Thread t = new WorkingThread();
		t.start();
	}

	class WorkingThread extends Thread {
		
		private static final String LAST_FETCHED_TIME = "lastFetchedTime";
		
		private final Handler mHandler;

		public WorkingThread() {
			mHandler = new Handler();
		}

		@Override
		public void run() {
			for (int i = 0; i < 5; i++) {
				try {
					WorkingThread.sleep(waitSec.intValue());
				} catch (InterruptedException e) {
					e.printStackTrace();
					Log.d("Error", "-");
				}
				//
				Map<OpenSocialPerson, List<OpenSocialActivity>> activitiesMap = fetchActivities();
				Set<OpenSocialPerson> keySet = activitiesMap.keySet();
				List<ActivityHolder> holder = new ArrayList<ActivityHolder>();
				SharedPreferences prefs = getSharedPreferences("default", Activity.MODE_PRIVATE);
				long lastFetchedTime = prefs.getLong(LAST_FETCHED_TIME, Long.MIN_VALUE); // TODO
				for (OpenSocialPerson person : keySet) {
					List<OpenSocialActivity> activities = activitiesMap.get(person);
					for (OpenSocialActivity activity : activities) {
						OpenSocialField postedTimeObj = activity.getField("postedTime");
						String postedTimeStr = postedTimeObj.getStringValue();
						long postedTime = Long.parseLong(postedTimeStr) * 1000l;
						if (lastFetchedTime < postedTime) {
							holder.add(new ActivityHolder(person, activity));
						}
					}
				}
				SharedPreferences.Editor editor = prefs.edit();
				editor.putLong(LAST_FETCHED_TIME, System.currentTimeMillis());
				editor.commit();
				//
				mHandler.post(new UIUpdater(BackgroundService.this, holder));
			}
			//
			clearSavedAuthentication();
			//
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
	
	public void clearSavedAuthentication() {
		SharedPreferences prefs = getSharedPreferences("default", Activity.MODE_PRIVATE);
		SharedPreferences.Editor editor = prefs.edit();
		
		editor.remove(OpenSocialChooserActivity.CURRENT_PROVIDER_PREF);
		editor.remove(OpenSocialChooserActivity.REQUEST_TOKEN_PREF);
		editor.remove(OpenSocialChooserActivity.REQUEST_TOKEN_SECRET_PREF);
		
		editor.remove(org.opensocial.android.OpenSocialActivity.ACCESS_TOKEN_PREF);
		editor.remove(org.opensocial.android.OpenSocialActivity.ACCESS_TOKEN_SECRET_PREF);
		editor.remove(OpenSocialChooserActivity.CURRENT_PROVIDER_PREF);

		editor.commit();
	}

}