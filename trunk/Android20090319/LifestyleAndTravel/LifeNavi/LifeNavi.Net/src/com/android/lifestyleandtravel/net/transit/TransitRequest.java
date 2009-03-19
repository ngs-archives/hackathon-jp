package com.android.lifestyleandtravel.net.transit;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import com.android.lifestyleandtravel.net.http.CustomHttpRequest;

public class TransitRequest implements CustomHttpRequest {

    private static final long serialVersionUID = 1L;

    /**
     * 出発地。<br />
     * 例：新宿駅
     */
    public String saddr;

    /**
     * 目的地。<br />
     * 例：品川駅
     */
    public String daddr;

    private final String mBaseUri;

    public TransitRequest() {
        this(
                "http://www.google.co.jp/maps?ie=UTF8&f=d&dirflg=r&ttype=dep&date=3%2F17&time=13%3A33&output=json");
    }

    public TransitRequest(final String baseUri) {
        mBaseUri = baseUri;
    }


    public String toUrl() {
        try {
            final String encodeSaddr = URLEncoder.encode(saddr, "utf-8");
            final String encodeDaddr = URLEncoder.encode(daddr, "utf-8");
            return String.format("%s&saddr=%s&daddr=%s", mBaseUri, encodeSaddr, encodeDaddr);
        } catch (UnsupportedEncodingException e) {
            // Ignore.
            return null;
        }
    }
}
