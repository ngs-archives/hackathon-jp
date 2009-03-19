package com.android.lifestyleandtravel.net.transit;

import com.android.lifestyleandtravel.net.http.CustomHttpRequest;

public class TransitRequest implements CustomHttpRequest {

    private static final long serialVersionUID = 1L;

    private final String mBaseUri;

    public TransitRequest(final String baseUri) {
        mBaseUri = baseUri;
    }

    @Override
    public String toUrl() {
        return mBaseUri;
    }
}
