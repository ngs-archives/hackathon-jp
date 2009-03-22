package android.scouter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.LinkedList;
import java.util.Properties;

import org.apache.http.HttpException;
import org.apache.http.ProtocolVersion;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.DefaultHttpServerConnection;
import org.apache.http.message.BasicHttpResponse;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.scouter.control.ServerInterface;
import android.scouter.entity.PersonInfo;
import android.scouter.entity.SettingData;
import android.scouter.util.Converter;
import android.telephony.TelephonyManager;
import android.util.Log;

/**
 * UPスカウターインターフェース用サービス
 * 
 * @description
 * HTTPサーバーとして動作するサービスです。
 * UPからの接続及びサーバーとの接続を仲介します。
 * 
 * エミュレータの場合は、アクセスの前に、
 * 
 * adb forward tcp:8888 tcp:<接続待ちポート番号>
 * 
 * とした後、
 * 
 * ブラウザからlocalhost:8888にアクセスして下さい。
 *
 */
public class ScouterInterfaceService extends Service {

	// デバッグ用情報
	private static final String TAG_NAME = "ScouterInterfaceService";
	private static final boolean DEBUG_FLG = true;

	/**
	 *  接続待ちポート番号 - デフォルト 12700
	 */
	private int _acceptPort = 12700;

    /**
     *  固有ID
     */
    private double serialNumber = 0;

    /**
     * 電話機能管理クラス
     */
	private TelephonyManager _mTelephonyManager = null;

	/**
	 * 接続待ちポート番号の設定
	 * 
	 * @param acceptPort the acceptPort to set
	 */
	public void setAcceptPort(int acceptPort) {
		this._acceptPort = acceptPort;
	}

	/*
	 * (non-Javadoc)
	 * @see android.app.Service#onCreate()
	 */
	@Override
    public void onCreate() {
        super.onCreate();

    	// 電話機能管理クラスの取得
        _mTelephonyManager = (TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE);

        // 固有IDの取得
        serialNumber = Double.parseDouble(_mTelephonyManager.getSimSerialNumber());

        /**
         *  接続待機スレッドの生成
         */
        Thread waitingThread = new Thread() {

        	/*
        	 * (non-Javadoc)
        	 * @see java.lang.Thread#run()
        	 */
        	@Override
        	public void run() {

        		// サーバーソケットのインスタンス化
        		ServerSocket serverSocket = null;
        		try {
        			serverSocket = new ServerSocket( _acceptPort );
        		} catch (IOException e) {
    				if(DEBUG_FLG) {
    					Log.d(TAG_NAME, e.getMessage());
    				}
        		}

    			if(serverSocket != null) {

    				try {
        				if(DEBUG_FLG) {
        					Log.d(TAG_NAME, "waiting...");
        				}

    					while(true) {

    						// 接続待ち
        					Socket socket = serverSocket.accept();

            				if(DEBUG_FLG) {
            					Log.d(TAG_NAME, "accept connection from " + socket.getLocalAddress().toString() );
            				}

        					SessionThread sessionThread = new SessionThread(socket);
        					sessionThread.start();

    					}
    					
    				} catch (IOException e) {
    					if(DEBUG_FLG) {
    						Log.d(TAG_NAME, e.getMessage());
    					}
    				}

    			}

        	}
        	
        };
        waitingThread.start();
        	
	}
	
	/**
	 * 接続処理用スレッド
	 * 
	 * @description
	 * 個々の接続に対して処理・応答するスレッドです。
	 * 接続に応じて接続待機スレッドから生成され、実行されます。
	 * 
	 *	※	リクエストパラメータに応じた処理は未実装です。
	 *		サーバーへはダミーデータが送信されます。
	 */
    private class SessionThread extends Thread {

    	// ソケット
    	private final Socket _mSocket;

    	// HTTPパラメータ
		private final HttpParams _mHTTPParams = new BasicHttpParams();

    	/**
    	 * コンストラクタ
    	 * @param socket クライアントと接続済みのソケット
    	 */
    	public SessionThread(Socket socket) {
    		this._mSocket = socket;
    	}
    	
    	/*
    	 * (non-Javadoc)
    	 * @see java.lang.Runnable#run()
    	 */
		@Override
		public void run() {
			
			// HTTP接続処理
			DefaultHttpServerConnection serverConnection = new DefaultHttpServerConnection();

			// ソケットをバインド
			try {
				serverConnection.bind(_mSocket, _mHTTPParams );
			} catch (IOException e) {
				if(DEBUG_FLG) {
					Log.d(TAG_NAME, e.getMessage());
				}
			}

			// リクエストパラメータを取得
			Properties params = getRequestParams(serverConnection);


			//
			// パラメータに応じた処理 - 未実装
			//
			
	        // ※ 送信用ダミーデータの構築
	        PersonInfo dummyPersonInfo = new PersonInfo();
	        dummyPersonInfo.setID( String.valueOf(serialNumber) );
	        dummyPersonInfo.setName("フリーザ");
	        
	        // サーバーと情報を送受信
	        LinkedList<PersonInfo> personList =
	        	new LinkedList<PersonInfo>( ServerInterface.ping(dummyPersonInfo, SettingData.RANGE) );

			// 応答文字列を生成
			String responseStr = generateResponseStr(personList);
			
			// 応答を送信
			sendResponse(serverConnection, responseStr);
						
			// コネクションを閉じる
			try {
				serverConnection.close();
			} catch (IOException e) {
				if(DEBUG_FLG) {
					Log.d(TAG_NAME, e.getMessage());
				}
			}

		}
    	
		/**
		 * リクエストパラメータを取得
		 * 
		 * @param serverConnection
		 * @return
		 */
		private Properties getRequestParams(DefaultHttpServerConnection serverConnection) {

			// 要求文字列
			String requestString = null;
			
			try {
			
				// 要求文字列の取得 - "index.html?param1=value1" の形式
				requestString = serverConnection.receiveRequestHeader().getRequestLine().getUri();

			} catch (HttpException e) {
				if(DEBUG_FLG) {
					Log.d(TAG_NAME, e.getMessage());
				}
			} catch (IOException e) {
				if(DEBUG_FLG) {
					Log.d(TAG_NAME, e.getMessage());
				}
			}

			// 要求文字列からパラメータの取得
			return Converter.url2parameter( requestString );

		}
				
		/**
		 * 応答文字列の生成
		 * 
		 * @description
		 * XMLはStringBuilderで直接構築しています。
		 * 大規模なXML構築や操作にはDOMを使うなど、規模に応じて変更して下さい。
		 * 
		 * @return 生成された応答文字列
		 */
		private String generateResponseStr(LinkedList<PersonInfo> personList) {
			
			// 返却する結果
			StringBuilder result = new StringBuilder();
			
			// 直接XMLを生成
			result.append("<xml>");
			
			for(PersonInfo data : personList) {
				
				result.append("<person>");
				result.append("<id>" + data.getID() + "</id>");
				result.append("<name>" + data.getName() + "</name>");
				result.append("</person>");
			}
			
			result.append("</xml>");
			
			// 結果の返却
			return result.toString();
		}

		/**
		 * 応答を送信
		 * 
		 * @description
		 * 現在は正常系(200 - Ok)のみに対応しています。
		 * 例外系実装の場合は、本メソッドは変更せずにオーバーロードで実装してください。
		 * 
		 * @param serverConnection
		 * @param responseStr
		 * @return
		 */
		private boolean sendResponse(DefaultHttpServerConnection serverConnection, String responseStr) {
			
			// 返却する結果
			boolean result = true;

			// プロトコルバージョン
			ProtocolVersion version = new ProtocolVersion("HTTP", 1, 1);

			// 結果
			BasicHttpResponse basicHttpResponse = new BasicHttpResponse(version, 200, "Ok");
			basicHttpResponse.addHeader("Content-type", "application/xml");
			// 
			StringEntity entity = null;
			try {

				entity = new StringEntity(responseStr, "UTF-8");
			
			} catch (UnsupportedEncodingException e) {
				if(DEBUG_FLG) {
					Log.d(TAG_NAME, e.getMessage());
				}
			}
			
			basicHttpResponse.setEntity(entity);
			
			try {
				
				// 結果を送信
				serverConnection.sendResponseEntity(basicHttpResponse);
				
			} catch (HttpException e) {
				if(DEBUG_FLG) {
					Log.d(TAG_NAME, e.getMessage());
				}
			} catch (IOException e) {
				if(DEBUG_FLG) {
					Log.d(TAG_NAME, e.getMessage());
				}
			}

			// 結果の返却
			return result;
		}

    }

	/*
	 * (non-Javadoc)
	 * @see android.app.Service#onBind(android.content.Intent)
	 */
	@Override
	public IBinder onBind(Intent arg0) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
