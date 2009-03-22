package android.scouter;

import java.util.LinkedList;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.scouter.control.ServerInterface;
import android.scouter.entity.PersonInfo;
import android.scouter.entity.SettingData;
import android.telephony.TelephonyManager;

/**
 * サーバーへ情報を送信
 * 
 * @description
 * サーバーに認証情報・現在位置情報を送信するサービスです。
 * AlarmManagerにより定期的に起動されます。
 * 
 * AlarmService_Serviceを元に作成しました。
 * 
 * @since 2008/03/20
 *
 */
public class IntervalPingService extends Service {

    /**
     *  固有ID
     */
    private double _mSerialNumber = 0;

    /**
     * 電話機能管理クラス
     */
	private TelephonyManager _mTelephonyManager = null;

	/**
	 * 送信用データ
	 */
    private final PersonInfo _mPersonInfo = new PersonInfo();

	/*
	 * (non-Javadoc)
	 * @see android.app.Service#onCreate()
	 */
	@Override
	public void onCreate() {
		
    	// 電話機能管理クラスの取得
        _mTelephonyManager = (TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE);

        // 固有IDの取得
        _mSerialNumber = Double.parseDouble(_mTelephonyManager.getSimSerialNumber());

        // ※ 送信用ダミーデータの構築
        _mPersonInfo.setID( String.valueOf(_mSerialNumber) );
        _mPersonInfo.setName("フリーザ");
        
        Thread thread = new Thread() {

        	/*
        	 * (non-Javadoc)
        	 * @see java.lang.Thread#run()
        	 */
        	@Override
        	public void run() {

                // サーバーと情報を送受信
                LinkedList<PersonInfo> personList =
                	new LinkedList<PersonInfo>( ServerInterface.ping(_mPersonInfo, SettingData.RANGE) );

                // 
                // 受信結果に基づいた処理は未実装
                // 
                
        		// サービスの終了
        		stopSelf();

        	}
        };
        thread.start();
	}
	
	@Override
	public IBinder onBind(Intent arg0) {
		// TODO Auto-generated method stub
		return null;
	}

}
