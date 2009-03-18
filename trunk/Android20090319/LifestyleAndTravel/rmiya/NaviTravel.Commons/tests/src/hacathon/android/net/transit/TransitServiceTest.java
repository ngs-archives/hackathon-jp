package hacathon.android.net.transit;

import hacathon.android.net.http.CustomHttpClient;
import hacathon.android.net.transit.item.Maps;
import junit.framework.TestCase;

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

    public void testExecute() throws Exception {
        // 新宿駅（東京） から 品川駅（東京）
        final String baseUri = "http://www.google.co.jp/maps?ie=UTF8&f=d&dirflg=r&saddr=%E6%96%B0%E5%AE%BF&daddr=%E5%93%81%E5%B7%9D&ttype=dep&date=3%2F17&time=13%3A33&output=json";
        final TransitRequest request = new TransitRequest(baseUri);

        final TransitResponseHandlerImpl handler = new TransitResponseHandlerImpl();
        final TransitService service = new TransitService(mHttpClient);
        service.execute(handler, request);

        final TransitResponse response = handler.getResponse();
        assertNotNull(response);

        final Maps maps = handler.mResponse.maps;
        assertNotNull(maps);
        assertEquals("新宿駅（東京） から 品川駅（東京） - Google マップ", maps.title);
        assertEquals("", maps.vartitle);
        assertEquals(
                "/maps?ie=UTF8&f=d&dirflg=r&saddr=%E6%96%B0%E5%AE%BF&daddr=%E5%93%81%E5%B7%9D&ttype=dep&date=3/17&time=13:33",
                maps.url);
        assertFalse(maps.urlViewport);
    }
}
