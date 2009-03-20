package com.android.lifestyle;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class VoiceOfAndroid extends Activity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        final EditText text = (EditText)findViewById(R.id.text);

        // 日本語ボタン取得
        final Button jaBtn =(Button)findViewById(R.id.jsave);
        jaBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
				changeText("jp",text.getText().toString());
			}
        });
       
        // 英語ボタン取得
        final Button enBtn =(Button)findViewById(R.id.esave);
        enBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
				changeText("eng",text.getText().toString());
			}
        });
        
        // フランス語ボタン取得
        final Button frBtn =(Button)findViewById(R.id.fsave);
        frBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
				changeText("fr",text.getText().toString());
			}
        });
    }
    
    public void changeText(String code, String text) {
    	
    }
}