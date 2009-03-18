package hacathon.android.travel.transit;

public interface TransitResponseHandler<T> {

    void post(T response);
}
