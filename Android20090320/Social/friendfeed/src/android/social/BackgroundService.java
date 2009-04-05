package android.social;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.opensocial.client.OpenSocialClient;
import org.opensocial.client.OpenSocialRequestException;
import org.opensocial.data.OpenSocialActivity;
import org.opensocial.data.OpenSocialPerson;

import android.app.Service;
import android.content.Intent;
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
				//
				mHandler.post(new UIUpdater(BackgroundService.this, activitiesMap));
			}
			BackgroundService.this.stopSelf();
		}

		private Map<OpenSocialPerson, List<OpenSocialActivity>> fetchActivities() {
			Map<OpenSocialPerson, List<OpenSocialActivity>> resultMap = new HashMap<OpenSocialPerson, List<OpenSocialActivity>>();
			for (OpenSocialPerson friend : friends) {
				try {
					List<OpenSocialActivity> activities = client
							.fetchActivitiesForPerson(friend.getId());
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