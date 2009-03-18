package hacathon.android.travel.maps;

import org.apache.http.client.HttpClient;

public class MapService {

    private final HttpClient mHttpClient;

    public MapService(final HttpClient httpClient) {
        mHttpClient = httpClient;
    }
}
