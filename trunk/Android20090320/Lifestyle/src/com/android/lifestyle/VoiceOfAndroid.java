package com.android.lifestyle;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.view.ContextMenu;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ContextMenu.ContextMenuInfo;
import android.view.View.OnCreateContextMenuListener;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

public class VoiceOfAndroid extends Activity {
	public String tmpText = "";


	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        final AlertDialog.Builder ad = new AlertDialog.Builder(this).setMessage("test");
        final EditText text = (EditText)findViewById(R.id.text);
        registerForContextMenu(findViewById(R.id.text));

        // 日本語ボタン取得
        final Button jaBtn =(Button)findViewById(R.id.jsave);
        jaBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
				changeText("ej",text.getText().toString());
			}
        });

        // 英語ボタン取得
        final Button enBtn =(Button)findViewById(R.id.esave);
        enBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
				changeText("je",text.getText().toString());
			}
        });

//        // フランス語ボタン取得
//        final Button frBtn =(Button)findViewById(R.id.fsave);
//        frBtn.setOnClickListener(new Button.OnClickListener(){
//			public void onClick(View v) {
//				changeText("fr",text.getText().toString());
//			}
//        });
    }

    // 翻訳クラス処理に移動
    public void changeText(String code, String text) {
//    	final TextView word = (TextView)findViewById(R.id.text);

    	Translation translation = new Translation();

    	WebView view = new WebView(this);

    	translation.work(view ,text, code);

    	setContentView(view);



//    	word.setText(text);
    }

	@Override
	public void onCreateContextMenu(ContextMenu menu, View v,
			ContextMenuInfo menuInfo) {
		menu.add(0,0,Menu.NONE,"Japanese");
		menu.add(0,1,Menu.NONE,"English");
		menu.add(0,2,Menu.NONE,"Return");
		super.onCreateContextMenu(menu, v, menuInfo);
	}

	@Override
	public boolean onContextItemSelected(MenuItem item) {
		final EditText text = (EditText)findViewById(R.id.text);

		switch(item.getItemId()) {
		case 0:
			changeText("jp",text.getText().toString());
			break;
		case 1:
			changeText("eng",text.getText().toString());
			break;
		}
		return true;
	}


}