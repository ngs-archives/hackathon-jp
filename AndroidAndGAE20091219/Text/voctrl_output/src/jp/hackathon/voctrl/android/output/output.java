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
	//Button�̕ϐ���`
	private Button vStartBtn;		//ScanBarcode�{�^��
	private Button vEndBtn;	//HandInput Barcode�{�^��

	private Button vShowBtn;	//HandInput Barcode�{�^��
	
	//private EditText vMessage;
	private TextView vMessage;
	
    private HttpGet request;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Window window = getWindow();
        
        //��ʂ𖾂邭�ۂ�
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);    
        //�t���X�N���[���ɂ���
        window.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
      
        
        setContentView(R.layout.main);
        
        //vStartBtn = (Button)findViewById(R.id.start_button);
        //vStartBtn.setOnClickListener(this);
        //vEndBtn = (Button)findViewById(R.id.end_button);
        //vEndBtn.setOnClickListener(this);
        
        //�{�^���̒�`
        vShowBtn = (Button)findViewById(R.id.show_button);
        vShowBtn.setOnClickListener(this);
        
        //TextView�̒�`
        vMessage = (TextView)findViewById(R.id.Message);
    }


	@Override
	public void onClick(View v) {
		// TODO Auto-generated method stub
		
		//ScanBarcode�����������Ƃ��̏���
		if(v == vStartBtn){
			//�T�[�r�X���J�n
	
		}
		else if(v == vEndBtn){
			
			//�T�[�r�X���J�n
		}
		else if(v == vShowBtn){
			
			//�f�[�^�擾
			
	    	//DefaultHttpClient�𐶐�
	    	HttpClient httpClient = new DefaultHttpClient();  
	    	HttpResponse response1 = null;
   	
	    	
	    	//�f�[�^�����N�G�X�g����
	    	try {
	    		
	    		//���N�G�X�g���URL�i����Œ�j
	    	    String url = "http://voctrl.appspot.com/output";
	    	    
	    	    //URI�𐶐�����
	        	StringBuilder uriBuilder = new StringBuilder(url);			    		
	    		
	        	//HttpGet�𐶐�����
	        	request = new HttpGet(uriBuilder.toString());  
	    	
	    		//��������URI�ɑ΂��ă��N�G�X�g���s��
	    		response1 = httpClient.execute(request);		
	    		
	       		//���N�G�X�g�������ʂ̃X�e�[�^�X���擾����
	       		int status = response1.getStatusLine().getStatusCode();  
	        		  
	       		//���N�G�X�g���ʂ̃X�e�[�^�X�������F200�������猋�ʂ��擾����
	        	if (status == HttpStatus.SC_OK) {  
	        	
	        		//���X�|���X��OutputStream�ɏ����o��
	        		ByteArrayOutputStream ostream = new ByteArrayOutputStream();  
	        		response1.getEntity().writeTo(ostream);       			
	        		String message = ostream.toString();
	        		
	        		//���o�������b�Z�[�W����ʂɕ\������B
	        		vMessage.setText(message);
	        		
     
	        	}

	    	}
	    	 catch(Exception ex){

	     		String verror = ex.getMessage();
	     		
	     		AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
	     		// �A���[�g�_�C�A���O�̃^�C�g����ݒ肵�܂�
	     		alertDialogBuilder.setTitle("�^�C�g��");
	     		// �A���[�g�_�C�A���O�̃��b�Z�[�W��ݒ肵�܂�
	     		alertDialogBuilder.setMessage(verror);
	     		
	     		AlertDialog alertDialog = alertDialogBuilder.create();
	     		// �A���[�g�_�C�A���O��\�����܂�
	     		alertDialog.show();
	     		
	    	 }

		
		}	
		
	} 
    
  
    
}