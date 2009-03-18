package hacathon.android.net.http;

public interface CustomHttpService<T extends CustomHttpRequest, R extends CustomHttpResponse> {

    void execute(CustomHttpResponseHandler<R> handler, T request) throws CustomHttpException;
}
