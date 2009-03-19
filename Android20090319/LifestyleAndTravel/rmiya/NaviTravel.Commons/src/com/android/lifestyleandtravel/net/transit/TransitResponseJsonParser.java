package com.android.lifestyleandtravel.net.transit;

import java.io.IOException;
import java.io.Reader;
import java.text.ParseException;

import org.apache.http.util.CharArrayBuffer;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.android.lifestyleandtravel.net.http.CustomHttpParseException;
import com.android.lifestyleandtravel.net.http.CustomHttpResponseHandler;
import com.android.lifestyleandtravel.net.http.CustomHttpResponseParser;
import com.android.lifestyleandtravel.net.transit.item.D;
import com.android.lifestyleandtravel.net.transit.item.Form;
import com.android.lifestyleandtravel.net.transit.item.G;
import com.android.lifestyleandtravel.net.transit.item.GLatLng;
import com.android.lifestyleandtravel.net.transit.item.L;
import com.android.lifestyleandtravel.net.transit.item.Maps;
import com.android.lifestyleandtravel.net.transit.item.Marker;
import com.android.lifestyleandtravel.net.transit.item.Overlays;
import com.android.lifestyleandtravel.net.transit.item.Query;
import com.android.lifestyleandtravel.net.transit.item.TimeFormat;
import com.android.lifestyleandtravel.net.transit.item.ViewPort;
import com.android.lifestyleandtravel.util.Log;

public class TransitResponseJsonParser implements CustomHttpResponseParser<TransitResponse> {

    @Override
    public void parse(final CustomHttpResponseHandler<TransitResponse> handler, final Reader in)
            throws IOException, CustomHttpParseException {
        try {
            String entityString = toString(in);

            // ごみを取り除く。
            entityString = entityString.replace("while(1);", "");
            Log.d("entity = " + entityString);
            Log.d("length = " + entityString.length());

            final JSONObject root = new JSONObject(entityString);

            if (root != null) {
                final Maps maps = parseMaps(root);
                maps.form = parseForm(root.optJSONObject("form"));
                maps.query = parseQuery(root.optJSONObject("query"));
                maps.viewport = parseViewPort(root.optJSONObject("viewport"));
                maps.overlays = parseOverlays(root.optJSONObject("overlays"));
                maps.timeformat = parseTimeFormat(root.optJSONObject("timeformat"));

                final TransitResponse response = new TransitResponse();
                response.maps = maps;
                handler.post(response);
            }
        } catch (final ParseException ex) {
            throw new CustomHttpParseException(ex);
        } catch (final JSONException ex) {
            throw new CustomHttpParseException(ex);
        }
    }

    private static Maps parseMaps(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final Maps o = new Maps();
        o.title = json.optString("title");
        o.vartitle = json.optString("vartitle");
        o.url = json.optString("url");
        o.urlViewport = json.optBoolean("urlViewport");
        o.ei = json.optString("ei");
        return o;
    }

    private static Form parseForm(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final Form o = new Form();
        o.selected = json.optString("selected");
        o.l = parseFormL(json.optJSONObject("l"));
        o.d = parseFormD(json.optJSONObject("d"));
        o.geocode = json.optString("geocode");
        o.g = parseFormG(json.optJSONObject("g"));
        return o;
    }

    private static L parseFormL(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final L o = new L();
        o.q = json.optString("q");
        o.near = json.optString("near");
        return o;
    }

    private static D parseFormD(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final D o = new D();
        o.saddr = json.optString("saddr");
        o.daddr = json.optString("daddr");
        return o;
    }

    private static G parseFormG(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final G o = new G();
        o.q = json.optString("q");
        return o;
    }

    private static Query parseQuery(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final Query o = new Query();
        o.d = json.optString("d");
        return o;
    }

    private static ViewPort parseViewPort(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final ViewPort o = new ViewPort();
        o.center = parseGLatLng(json.optJSONObject("center"));
        o.span = parseGLatLng(json.optJSONObject("span"));
        o.maptype = json.optString("maptype");
        return o;
    }

    private static GLatLng parseGLatLng(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final GLatLng o = new GLatLng();
        o.lat = json.optDouble("lat");
        o.lng = json.optDouble("lng");
        return o;
    }

    private static Overlays parseOverlays(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final Overlays o = new Overlays();
        o.sxcar = json.optBoolean("sxcar");

        final JSONArray jsonMarkers = json.optJSONArray("markers");
        if (jsonMarkers != null) {
            final int length = jsonMarkers.length();
            o.markers = new Marker[length];
            for (int i = 0; i < length; i++) {
                o.markers[i] = parseMarker(jsonMarkers.optJSONObject(i));
            }
        }

        return o;
    }

    private static Marker parseMarker(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final Marker o = new Marker();
        o.id = json.optString("id");
        o.image = json.optString("image");
        o.drg = json.optBoolean("drg");
        o.geocode = json.optString("geocode");
        o.latlng = parseGLatLng(json.optJSONObject("latlng"));
        return o;
    }

    private static TimeFormat parseTimeFormat(final JSONObject json) {
        if (json == null) {
            return null;
        }

        final TimeFormat o = new TimeFormat();
        o.ampm = json.optBoolean("ampm");
        o.dp = json.optString("dp");
        return o;
    }

    private static String toString(final Reader reader) throws IOException, ParseException {
        // Google Mapの受信サイズが結構大きい。
        final CharArrayBuffer buffer = new CharArrayBuffer(16384);
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
