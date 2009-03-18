package hacathon.android.travel.transit;

import hacathon.android.travel.CustomHttpClient;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.text.ParseException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.protocol.HTTP;
import org.json.JSONException;

import android.util.Log;

public class TransitService {

    private static final String LOG_TAG = TransitService.class.getName();

    private final TransitResponseHtmlParser mParser = new TransitResponseHtmlParser();
    private final CustomHttpClient mHttpClient;

    public TransitService(final CustomHttpClient httpClient) {
        mHttpClient = httpClient;
    }

    public void execute(final TransitResponseHandler<TransitResponse> handler,
            final TransitRequest request) throws IOException, ParseException, JSONException {

        final String url = request.toUrl();
        Log.d(LOG_TAG, "url = " + url);

        final HttpGet get = new HttpGet(url);

        HttpEntity entity = null;
        try {
            entity = mHttpClient.execute(get);
            final Reader reader = new InputStreamReader(entity.getContent(), HTTP.UTF_8);
            final TransitResponse parsed = mParser.parse(reader);
            handler.post(parsed);
        } finally {
            if (entity != null) {
                entity.consumeContent();
            }
        }
    }
}
