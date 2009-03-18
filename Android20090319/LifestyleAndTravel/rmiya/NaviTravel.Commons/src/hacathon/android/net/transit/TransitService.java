package hacathon.android.net.transit;

import hacathon.android.net.http.CustomHttpClient;
import hacathon.android.net.http.CustomHttpException;
import hacathon.android.net.http.CustomHttpParseException;
import hacathon.android.net.http.CustomHttpResponseHandler;
import hacathon.android.net.http.CustomHttpService;
import hacathon.android.util.Log;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.protocol.HTTP;

public class TransitService implements CustomHttpService<TransitRequest, TransitResponse> {

    private final TransitResponseJsonParser mParser = new TransitResponseJsonParser();
    private final CustomHttpClient mHttpClient;

    public TransitService(final CustomHttpClient httpClient) {
        mHttpClient = httpClient;
    }

    @Override
    public void execute(final CustomHttpResponseHandler<TransitResponse> handler,
            final TransitRequest request) throws CustomHttpException {
        final String url = request.toUrl();
        Log.d("url = " + url);

        final HttpGet get = new HttpGet(url);

        HttpEntity entity = null;
        try {
            entity = mHttpClient.execute(get);
            final Reader reader = new InputStreamReader(entity.getContent(), HTTP.UTF_8);
            mParser.parse(handler, reader);
        } catch (final CustomHttpParseException ex) {
            throw new CustomHttpException(ex);
        } catch (final IOException ex) {
            throw new CustomHttpException(ex);
        } finally {
            if (entity != null) {
                try {
                    entity.consumeContent();
                } catch (final IOException ex) {
                    // Ignore.
                }
            }
        }
    }
}
