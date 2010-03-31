package com.google.hackathon.reviewgetter;

import java.io.IOException;
import java.util.HashMap;

import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

import android.os.AsyncTask;

import com.google.zxing.client.android.CaptureActivity;

public class ZebroidTask extends
        AsyncTask<String, Integer, HashMap<String, String>> {
    private AmazonECSService service;
    private CaptureActivity mActivity;

    public ZebroidTask(CaptureActivity activity, AmazonECSService service) {
        mActivity = activity;
        this.service = service;
    }

    /**
     * バックグラウンドで行われる処理
     */
    @Override
    protected HashMap<String, String> doInBackground(String... params) {
        String isbn = params[0];
        String amazonDoc = null;
        HashMap<String, String> map = new HashMap<String, String>();
        try{
            amazonDoc = service.searchByISBN(isbn);
        }catch(IOException ex){
            map.put("error", "ネットワークに接続できません。");
            return map;
        }catch(SAXException ex){
            map.put("error", "パースに失敗しました。");
            return map;
        }catch(ParserConfigurationException ex){
            map.put("error", "パースに失敗しました。");
            return map;
        }

        int salesRank;
        int totalReview;
        boolean isReviewHasDot = false;
        String bookDetailURL = null;
        if ((salesRank = amazonDoc.indexOf("<SalesRank>")) != -1) {
            String salesRankStr = amazonDoc
                    .substring(amazonDoc.indexOf("<SalesRank>")
                            + "<SalesRank>".length(), amazonDoc
                            .indexOf("</SalesRank>"));
            salesRank = Integer.valueOf(salesRankStr);
        }
        if ((totalReview = amazonDoc.indexOf("<TotalReviews>")) != -1) {
            String reviewStr = amazonDoc.substring(amazonDoc
                    .indexOf("<TotalReviews>")
                    + "<TotalReviews>".length(), amazonDoc
                    .indexOf("</TotalReviews>"));
            if (reviewStr.length() > 1) {
                isReviewHasDot = true;
            }
            totalReview = Integer.valueOf(amazonDoc.substring(amazonDoc
                    .indexOf("<TotalReviews>")
                    + "<TotalReviews>".length(), amazonDoc
                    .indexOf("</TotalReviews>")));
        }
        if (amazonDoc.indexOf("<DetailPageURL>") != -1) {
            bookDetailURL = amazonDoc.substring(amazonDoc
                    .indexOf("<DetailPageURL>")
                    + "<DetailPageURL>".length(), amazonDoc
                    .indexOf("</DetailPageURL>"));

        }

        map.put("rank", String.valueOf(salesRank));
        map.put("reviews", String.valueOf(totalReview));
        map.put("url", bookDetailURL);
        map.put("isDot", String.valueOf(isReviewHasDot));

        return map;
    }

    /**
     * AmazonECSからの情報取得終了時に呼び出されるメソッド
     */
    @Override
    protected void onPostExecute(HashMap<String, String> map) {
        mActivity.stopActivityIndicator();
        //画像を描画して、タイマーを停止する
        mActivity.setSalesRank(Integer.valueOf(map.get("rank")));
        mActivity.setTotalReview(Integer.valueOf(map.get("reviews")));
        mActivity.setBookDetailURL(String.valueOf(map.get("url")));
        mActivity.setReviewHasDot(Boolean.valueOf(map.get("isDot")));
        mActivity.showAmazonInfo();
    }
}