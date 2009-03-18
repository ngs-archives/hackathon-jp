package tests.hacathon.android.travel.transit;

import hacathon.android.travel.CustomHttpClient;
import hacathon.android.travel.transit.TransitRequest;
import hacathon.android.travel.transit.TransitResponse;
import hacathon.android.travel.transit.TransitResponseHandler;
import hacathon.android.travel.transit.TransitService;
import android.test.AndroidTestCase;

public class TransitServiceTest extends AndroidTestCase {

    private CustomHttpClient mHttpClient;

    @Override
    protected void setUp() throws Exception {
        mHttpClient = new CustomHttpClient();
    }

    private class TransitResponseHandlerImpl implements TransitResponseHandler<TransitResponse> {

        private TransitResponse mResponse;

        @Override
        public void post(final TransitResponse response) {
            mResponse = response;
        }

        public final TransitResponse getResponse() {
            return mResponse;
        }
    }

    public void testExecute() throws Exception {
        // output=json をセットすると、JSON形式でレスポンスが戻ってくる。
        //        final String baseUri = "http://www.google.co.jp/maps?f=d&dirflg=r&saddr=%E6%96%B0%E5%AE%BF&daddr=%E5%93%81%E5%B7%9D&ttype=dep&date=3%2F17&time=13%3A33&output=json";
        // 品川駅（東京）⇒新宿駅（東京）
        final String baseUri = "http://www.google.co.jp/transit?saddr=%E5%93%81%E5%B7%9D&daddr=%E6%96%B0%E5%AE%BF&time=&ttype=dep&ie=UTF8&output=xhtml&f=d&dirmode=transit&num=10&btnG=%E4%B9%97%E3%82%8A%E6%8F%9B%E3%81%88%E6%A4%9C%E7%B4%A2";
        final TransitRequest request = new TransitRequest(baseUri);

        final TransitResponseHandlerImpl handler = new TransitResponseHandlerImpl();
        final TransitService service = new TransitService(mHttpClient);
        service.execute(handler, request);

        final TransitResponse response = handler.getResponse();
        assertNotNull(response);
    }
}
