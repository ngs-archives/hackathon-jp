package com.example.androidwar;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

public class AndroidWarsClient extends Activity {

	private EditText editName;
	private Button btSet;
	private String name;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		// 外枠
		LinearLayout outLinearLayout = new LinearLayout(this);
		outLinearLayout.setOrientation(LinearLayout.VERTICAL);
		setContentView(outLinearLayout);

		// UI枠
		LinearLayout uiLayout = new LinearLayout(this);

		// 描画クラス
		final TouchPanel touchPanel = new TouchPanel(this);

		this.editName = new EditText(this);
		this.editName.setWidth(200);
		this.btSet = new Button(this);
		this.btSet.setWidth(100);
		this.btSet.setText("設定");
		this.btSet.setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View v) {
				name = editName.getText().toString();
				touchPanel.setName(name);
			}

		});

		uiLayout.addView(this.editName);
		uiLayout.addView(this.btSet);

		outLinearLayout.addView(uiLayout);
		outLinearLayout.addView(touchPanel);
		setContentView(outLinearLayout);
	}
}