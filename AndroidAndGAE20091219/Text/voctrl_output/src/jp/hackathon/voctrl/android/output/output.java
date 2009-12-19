package jp.hackathon.voctrl.android.output;

import java.io.ByteArrayOutputStream;
import java.io.StringReader;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class output extends Activity implements OnClickListener{
	//Buttonの変数定義
	private Button vStartBtn;		//ScanBarcodeボタン
	private Button vEndBtn;	//HandInput Barcodeボタン

	private Button vShowBtn;	//HandInput Barcodeボタン
	
	//private EditText vMessage;
	private TextView vMessage;
	
    private HttpGet request;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Window window = getWindow();
        
        //画面を明るく保つ
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);    
        //フルスクリーンにする
        window.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
      
        
        setContentView(R.layout.main);
        
        //vStartBtn = (Button)findViewById(R.id.start_button);
        //vStartBtn.setOnClickListener(this);
        //vEndBtn = (Button)findViewById(R.id.end_button);
        //vEndBtn.setOnClickListener(this);
        
        //ボタンの定義
        vShowBtn = (Button)findViewById(R.id.show_button);
        vShowBtn.setOnClickListener(this);
        
        //TextViewの定義
        vMessage = (TextView)findViewById(R.id.Message);
    }


	@Override
	public void onClick(View v) {
		// TODO Auto-generated method stub
		
		//ScanBarcodeを押下したときの処理
		if(v == vStartBtn){
			//サービスを開始
	
		}
		else if(v == vEndBtn){
			
			//サービスを開始
		}
		else if(v == vShowBtn){
			
			//データ取得
			
	    	//DefaultHttpClientを生成
	    	HttpClient httpClient = new DefaultHttpClient();  
	    	HttpResponse response1 = null;
   	
	    	
	    	//データをリクエストする
	    	try {
	    		
	    		//リクエスト先のURL（今回固定）
	    	    String url = "http://voctrl.appspot.com/output";
	    	    
	    	    //URIを生成する
	        	StringBuilder uriBuilder = new StringBuilder(url);			    		
	    		
	        	//HttpGetを生成する
	        	request = new HttpGet(uriBuilder.toString());  
	    	
	    		//生成したURIに対してリクエストを行う
	    		response1 = httpClient.execute(request);		
	    		
	       		//リクエストした結果のステータスを取得する
	       		int status = response1.getStatusLine().getStatusCode();  
	        		  
	       		//リクエスト結果のステータスが成功：200だったら結果を取得する
	        	if (status == HttpStatus.SC_OK) {  
	        	
	        		//レスポンスをOutputStreamに書き出す
	        		ByteArrayOutputStream ostream = new ByteArrayOutputStream();  
	        		response1.getEntity().writeTo(ostream);       			
	        		String message = ostream.toString();
	        		
	        		//取り出したメッセージを画面に表示する。
	        		vMessage.setText(message);
	        		
     
	        	}

	    	}
	    	 catch(Exception ex){

	     		String verror = ex.getMessage();
	     		
	     		AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
	     		// アラートダイアログのタイトルを設定します
	     		alertDialogBuilder.setTitle("タイトル");
	     		// アラートダイアログのメッセージを設定します
	     		alertDialogBuilder.setMessage(verror);
	     		
	     		AlertDialog alertDialog = alertDialogBuilder.create();
	     		// アラートダイアログを表示します
	     		alertDialog.show();
	     		
	    	 }

		
		}	
		
	} 
    
  
    
}