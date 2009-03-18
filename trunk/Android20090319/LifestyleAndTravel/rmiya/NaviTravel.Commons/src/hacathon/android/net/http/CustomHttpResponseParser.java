package hacathon.android.net.http;

import java.io.IOException;
import java.io.Reader;

public interface CustomHttpResponseParser<T extends CustomHttpResponse> {

    /**
     * 非同期用。
     */
    void parse(CustomHttpResponseHandler<T> handler, Reader in) throws IOException,
            CustomHttpParseException;
}
