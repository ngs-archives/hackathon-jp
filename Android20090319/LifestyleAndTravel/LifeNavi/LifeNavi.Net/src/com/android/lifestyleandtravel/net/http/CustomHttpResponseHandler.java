package com.android.lifestyleandtravel.net.http;

public interface CustomHttpResponseHandler<T> {

    void post(T response);
}
