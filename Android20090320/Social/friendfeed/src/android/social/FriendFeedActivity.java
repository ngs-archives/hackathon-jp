package android.social;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.opensocial.client.OpenSocialBatch;
import org.opensocial.client.OpenSocialClient;
import org.opensocial.client.OpenSocialProvider;
import org.opensocial.client.OpenSocialRequest;
import org.opensocial.client.Token;
import org.opensocial.data.OpenSocialPerson;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

public class FriendFeedActivity extends Activity {

	private static String ANDROID_SCHEME = "x-opensocial-friendfeed-app";

	public static Map<OpenSocialProvider, Token> SUPPORTED_PROVIDERS = new HashMap<OpenSocialProvider, Token>();

	public org.opensocial.android.OpenSocialActivity util;

	static {
		SUPPORTED_PROVIDERS.put(OpenSocialProvider.EISBAHN, new Token(
				"d4fac4e5-c7ff-c3c1-b7e5-cee1d5c1c5f6",
				"567e816290f754646b36e11787bbf7d2"));
//				"decde8c2-c3f4-c8e9-8ac6-ccd0cdd5c3f6 ",
//				"b501779da71e40a3f8a8cde35534b993"));
		// SUPPORTED_PROVIDERS.put(OpenSocialProvider.PLAXO, new
		// Token("anonymous", ""));
		// SUPPORTED_PROVIDERS.put(OpenSocialProvider.MYSPACE, new
		// Token("bd0a323675834026938887b72ced9c6b",
		// "28ec8ca3d0fc44dcad2540a5840d27d8"));
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// setupClient();
		createUI();
	}

	private void createUI() {
		// setContentView(R.layout.main);
		LinearLayout linearLayout = new LinearLayout(this);
		linearLayout.setLayoutParams(new LinearLayout.LayoutParams(
				LinearLayout.LayoutParams.FILL_PARENT,
				LinearLayout.LayoutParams.FILL_PARENT));
		linearLayout.setOrientation(LinearLayout.VERTICAL);

		final FriendFeedActivity activity = this;

		Button startButton = new Button(this);
		startButton.setText("Start");
		startButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View view) {
				setupClient();
			}
		});

		Button clearAuthButton = new Button(this);
		clearAuthButton.setText("Clear Auth");
		clearAuthButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View view) {
				util.clearSavedAuthentication();
			}
		});

		Button fetchFriendsButton = new Button(this);
		fetchFriendsButton.setText("Fetch Friends");
		fetchFriendsButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View view) {
				activity.setupClient();
			}
		});

		linearLayout.addView(startButton);
		linearLayout.addView(fetchFriendsButton);
		linearLayout.addView(clearAuthButton);

		setContentView(linearLayout);
	}

	private void startBackgroundService(List<OpenSocialPerson> friends,
			OpenSocialClient client) {
		Intent intent = new Intent(FriendFeedActivity.this, BackgroundService.class);
		intent.putExtra("waitSec", 5000);
		// intent2.putExtra("client", client);
		intent.putExtra("friends", new FriendsHolder(friends));
		startService(intent);
	}

	private void setupClient() {
		util = new org.opensocial.android.OpenSocialActivity(this,
				SUPPORTED_PROVIDERS, ANDROID_SCHEME);
		OpenSocialClient client = util.getOpenSocialClient();

		// If the client is null the OpenSocialChooserActivity will be started
		if (client != null) {
			client.setProperty(OpenSocialClient.Properties.DEBUG, "true");
			// showContacts(client, util.getProvider());
			//
			Log.d("FriendFeed", "Authorization succeed.");
			List<OpenSocialPerson> friends = fetchFriends(client, util
					.getProvider());
			if (friends != null) {
				Log.d("FriendFeed", "friends.size() = " + friends.size());
				startBackgroundService(friends, client);
			} else {
				Log.d("FriendFeed", "friends is null.");
			}
		}
	}

	private List<OpenSocialPerson> fetchFriends(OpenSocialClient client,
			OpenSocialProvider provider) {
		List<OpenSocialPerson> friends = null;
		try {
			if (provider.isOpenSocial) {
				friends = client.fetchFriends();
			} else {
				OpenSocialBatch batch = new OpenSocialBatch();
				batch.addRequest(new OpenSocialRequest("@me/@all", ""),
						"friends");
				friends = batch.send(client).getItemAsPersonCollection(
						"friends");
			}
		} catch (Exception e) {
			Log.i("DisplayFriendActivity",
					"Couldn't fetch friends from the container: "
							+ e.getMessage());
		}
		return friends;
	}

}