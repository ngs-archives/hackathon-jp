package com.android.lifestyleandtravel.net.transit;

import junit.framework.TestCase;

import com.android.lifestyleandtravel.net.http.CustomHttpClient;
import com.android.lifestyleandtravel.net.transit.item.Maps;

public class TransitServiceTest extends TestCase {

    private CustomHttpClient mHttpClient;


    protected void setUp() throws Exception {
        mHttpClient = new CustomHttpClient();
    }

    private class TransitResponseHandlerImpl implements TransitResponseHandler {

        private TransitResponse mResponse;

        public final TransitResponse getResponse() {
            return mResponse;
        }


        public void post(final TransitResponse response) {
            mResponse = response;
        }
    }

    /**
     * 35.690921000000003,139.70025799999999(新宿) から セルリアンタワーの路線検索をする。
     */
    public void testExecute() throws Exception {
        final TransitRequest request = new TransitRequest();
        //        request.saddr = "新宿";
        request.saddr = "35.690921000000003,139.70025799999999";
        request.daddr = "セルリアンタワー";

        final TransitResponseHandlerImpl handler = new TransitResponseHandlerImpl();
        final TransitService service = new TransitService(mHttpClient);
        service.execute(handler, request);

        final TransitResponse response = handler.getResponse();
        assertNotNull(response);

        final Maps maps = handler.mResponse.maps;
        assertNotNull(maps);
        assertEquals("35.690921, 139.700258 から セルリアンタワー - Google マップ", maps.title);

        assertEquals("35.690921000000003,139.70025799999999", maps.form.d.saddr);
        assertEquals("セルリアンタワー", maps.form.d.daddr);

        assertEquals("from: 35.690921000000003,139.70025799999999 to: セルリアンタワー", maps.form.g.q);

        // マーカーのオーバーレイ表示。
        assertEquals("新宿駅の緯度", 35.630152000000002d, maps.overlays.markers[0].latlng.lat, 14);
        assertEquals("新宿駅の経度", 139.74044000000001d, maps.overlays.markers[0].latlng.lng, 14);

        assertEquals("セルリアンタワーの緯度", 35.656317000000001d, maps.overlays.markers[1].latlng.lat, 14);
        assertEquals("セルリアンタワーの経度", 139.69941499999999d, maps.overlays.markers[1].latlng.lng, 14);

        // 経路？
        //assertEquals(9, maps.points.length);

        assertFalse(maps.timeformat.ampm);
        assertEquals("ymd", maps.timeformat.dp);
    }
}
