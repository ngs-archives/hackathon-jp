package android.social;

import java.util.Map;

import org.opensocial.android.OpenSocialChooserActivity;
import org.opensocial.client.OpenSocialClient;
import org.opensocial.client.OpenSocialProvider;
import org.opensocial.client.Token;

import android.app.Activity;
import android.app.Service;
import android.content.SharedPreferences;
import android.util.Log;

public class OpenSocialClientFactory {
	
	private static final String ACCESS_TOKEN_PREF = "accessToken";
	private static final String ACCESS_TOKEN_SECRET_PREF = "accessTokenSecret";
	
	public static OpenSocialClient getClient(Service service, Map<OpenSocialProvider, Token> supportedProviders) {
		SharedPreferences prefs = service.getSharedPreferences("default", Activity.MODE_PRIVATE);
		Token accessToken = loadAccessToken(prefs);
		String providerString = prefs.getString(
				OpenSocialChooserActivity.CURRENT_PROVIDER_PREF, null);
		if (accessToken.token == null && providerString == null) {
			Log.d("ClientFactory", "accessToken.token and providerString are null.");
			return null;
		}
		OpenSocialProvider provider = OpenSocialProvider.valueOf(providerString.toUpperCase());
		OpenSocialClient client = getClient(provider, supportedProviders);
		// TODO retrieve the access token from Intent
		client.setProperty(OpenSocialClient.Properties.ACCESS_TOKEN, accessToken.token);
		client.setProperty(OpenSocialClient.Properties.ACCESS_TOKEN_SECRET, accessToken.secret);
		client.setProperty(OpenSocialClient.Properties.REST_BASE_URI, provider.restEndpoint);
		client.setProperty(OpenSocialClient.Properties.RPC_ENDPOINT, provider.rpcEndpoint);
		return client;
	}
	
	private static OpenSocialClient getClient(OpenSocialProvider provider, Map<OpenSocialProvider, Token> supportedProviders) {
		OpenSocialClient client = new OpenSocialClient();
		Token consumerToken = supportedProviders.get(provider);
		if (consumerToken != null) {
			client.setProperty(OpenSocialClient.Properties.CONSUMER_KEY, consumerToken.token);
			client.setProperty(OpenSocialClient.Properties.CONSUMER_SECRET, consumerToken.secret);
		}
		return client;
	}

	private static Token loadAccessToken(SharedPreferences prefs) {
		return new Token(
				prefs.getString(ACCESS_TOKEN_PREF, null),
				prefs.getString(ACCESS_TOKEN_SECRET_PREF, null)
		);
	}

}
