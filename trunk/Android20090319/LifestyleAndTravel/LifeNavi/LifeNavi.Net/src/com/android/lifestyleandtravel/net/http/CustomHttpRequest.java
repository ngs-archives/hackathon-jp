package com.android.lifestyleandtravel.net.http;

import java.io.Serializable;

/**
 * HTTPリクエストを表す。 パラメータの組み立てを行う。
 */
public interface CustomHttpRequest extends Serializable {

    /**
     * HTTPリクエストを発行するURL文字列を返す。
     */
    String toUrl() throws CustomHttpException;
}
