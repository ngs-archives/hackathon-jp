package hacathon.android.travel.transit;

public class TransitRequest {

    private final String mBaseUri;

    public TransitRequest(final String baseUri) {
        mBaseUri = baseUri;
    }

    public String toUrl() {
        return mBaseUri;
    }
}
