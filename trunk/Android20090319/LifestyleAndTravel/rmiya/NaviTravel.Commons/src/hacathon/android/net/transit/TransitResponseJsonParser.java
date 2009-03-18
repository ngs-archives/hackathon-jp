package hacathon.android.net.transit;

import hacathon.android.net.http.CustomHttpParseException;
import hacathon.android.net.http.CustomHttpResponseHandler;
import hacathon.android.net.http.CustomHttpResponseParser;
import hacathon.android.net.transit.item.D;
import hacathon.android.net.transit.item.Form;
import hacathon.android.net.transit.item.G;
import hacathon.android.net.transit.item.L;
import hacathon.android.net.transit.item.Maps;
import hacathon.android.util.Log;

import java.io.IOException;
import java.io.Reader;
import java.text.ParseException;

import org.apache.http.util.CharArrayBuffer;
import org.json.JSONException;
import org.json.JSONObject;

public class TransitResponseJsonParser implements CustomHttpResponseParser<TransitResponse> {

    private Maps mMaps;

    @Override
    public void parse(final CustomHttpResponseHandler<TransitResponse> handler, final Reader in)
            throws IOException, CustomHttpParseException {
        mMaps = new Maps();

        try {
            String entityString = toString(in);

            // ごみを取り除く。
            entityString = entityString.replace("while(1);", "");
            Log.d("entity = " + entityString);
            Log.d("length = " + entityString.length());

            final JSONObject root = new JSONObject(entityString);

            if (root != null) {
                parseMaps(root);
                parseForm(root.optJSONObject("form"));
            }

            final TransitResponse response = new TransitResponse();
            response.maps = mMaps;
            handler.post(response);
        } catch (final ParseException ex) {
            throw new CustomHttpParseException(ex);
        } catch (final JSONException ex) {
            throw new CustomHttpParseException(ex);
        }
    }

    private void parseMaps(final JSONObject json) {
        if (json == null) {
            return;
        }

        final Maps o = mMaps;
        o.title = json.optString("title");
        o.vartitle = json.optString("vartitle");
        o.url = json.optString("url");
        o.urlViewport = json.optBoolean("urlViewport");
        o.ei = json.optString("ei");
    }

    private void parseForm(final JSONObject json) {
        if (json == null) {
            return;
        }

        final Form o = mMaps.form;
        o.selected = json.optString("selected");
        parseFormL(json.optJSONObject("l"));
        parseFormD(json.optJSONObject("d"));
        o.geocode = json.optString("geocode");
        parseFormG(json.optJSONObject("g"));
    }

    private void parseFormL(final JSONObject json) {
        if (json == null) {
            return;
        }

        final L o = mMaps.form.l;
        o.q = json.optString("q");
        o.near = json.optString("near");
    }

    private void parseFormD(final JSONObject json) {
        if (json == null) {
            return;
        }

        final D o = mMaps.form.d;
        o.saddr = json.optString("saddr");
        o.daddr = json.optString("daddr");
    }

    private void parseFormG(final JSONObject json) {
        if (json == null) {
            return;
        }

        final G o = mMaps.form.g;
        o.q = json.optString("q");
    }

    private static String toString(final Reader reader) throws IOException, ParseException {
        final CharArrayBuffer buffer = new CharArrayBuffer(4096);
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
