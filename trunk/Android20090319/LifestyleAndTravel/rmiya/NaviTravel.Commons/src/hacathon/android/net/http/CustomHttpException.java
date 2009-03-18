package hacathon.android.net.http;

public class CustomHttpException extends Exception {

    private static final long serialVersionUID = 1L;

    public CustomHttpException(final Throwable cause) {
        super(cause);
    }
}
