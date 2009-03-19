package com.android.lifestyleandtravel.net.transit;

import junit.framework.TestCase;

import com.android.lifestyleandtravel.net.http.CustomHttpClient;
import com.android.lifestyleandtravel.net.transit.item.Maps;

public class TransitServiceTest extends TestCase {

    private CustomHttpClient mHttpClient;

    @Override
    protected void setUp() throws Exception {
        mHttpClient = new CustomHttpClient();
    }

    private class TransitResponseHandlerImpl implements TransitResponseHandler {

        private TransitResponse mResponse;

        public final TransitResponse getResponse() {
            return mResponse;
        }

        @Override
        public void post(final TransitResponse response) {
            mResponse = response;
        }
    }

    /**
     * 新宿駅（東京） から 品川駅（東京）の路線検索をする。
     */
    public void testExecute() throws Exception {
        final TransitRequest request = new TransitRequest();
        request.saddr = "新宿駅";
        request.daddr = "品川駅";

        final TransitResponseHandlerImpl handler = new TransitResponseHandlerImpl();
        final TransitService service = new TransitService(mHttpClient);
        service.execute(handler, request);

        final TransitResponse response = handler.getResponse();
        assertNotNull(response);

        final Maps maps = handler.mResponse.maps;
        assertNotNull(maps);
        assertEquals("新宿駅（東京） から 品川駅（東京） - Google マップ", maps.title);
        assertEquals("", maps.vartitle);
        assertFalse(maps.urlViewport);

        // マーカーのオーバーレイ表示。
        assertEquals("新宿駅の緯度", 35.690921000000003d, maps.overlays.markers[0].latlng.lat);
        assertEquals("新宿駅の経度", 139.70025799999999d, maps.overlays.markers[0].latlng.lng);

        assertEquals("品川駅の緯度", 35.630152000000002d, maps.overlays.markers[1].latlng.lat);
        assertEquals("品川駅の経度", 139.74044000000001d, maps.overlays.markers[1].latlng.lng);

        assertFalse(maps.timeformat.ampm);
        assertEquals("ymd", maps.timeformat.dp);
    }
}
