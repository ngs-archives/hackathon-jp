package hacathon.android.net.http;

public interface CustomHttpResponseHandler<T> {

    void post(T response);
}
