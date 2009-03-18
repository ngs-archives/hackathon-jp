package hacathon.android.travel.transit;

import java.io.IOException;
import java.io.Reader;
import java.text.ParseException;

import org.apache.http.util.CharArrayBuffer;
import org.json.JSONException;

import android.util.Log;

public class TransitResponseHtmlParser {

    private static final String LOG_TAG = TransitResponseHtmlParser.class.getName();

    public TransitResponse parse(final Reader in) throws IOException, ParseException, JSONException {

        //        final JSONObject jsonObject = new JSONObject(toString(in));
        final String str = toString(in);
        Log.d(LOG_TAG, "entity = " + str);
        Log.d(LOG_TAG, "length = " + str.length());

        return null;
    }

    private static String toString(final Reader reader) throws IOException, ParseException {
        CharArrayBuffer buffer = new CharArrayBuffer(4096);
        try {
            char[] tmp = new char[1024];
            int l;
            while ((l = reader.read(tmp)) != -1) {
                buffer.append(tmp, 0, l);
            }
        } finally {
            reader.close();
        }
        return buffer.toString();
    }
}
