package org.toss.janken;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

public class SettingsActivity extends Activity {
	private EditText edit;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.setting);
		Settings setting = new Settings(SettingsActivity.this);
		edit = (EditText)findViewById(R.id.hostip);
		edit.setText(setting.get("server"));
		Button saveButton = (Button)findViewById(R.id.saveSetting);
		saveButton.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
				Settings setting = new Settings(SettingsActivity.this);
				setting.set("server", edit.getText().toString());
				finish();
			}
		});
	}
}
