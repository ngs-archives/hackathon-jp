package org.hackathon.ashiato;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class Ashiato extends Activity implements OnClickListener {
	Button getButton;
	Button postButton;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.main);
		
		getButton = (Button)findViewById(R.id.get_button);
		getButton.setOnClickListener(this);
		
		getButton = (Button)findViewById(R.id.post_button);
		getButton.setOnClickListener(this);		
	}

	@Override
	public void onClick(View v) {
		// TODO Auto-generated method stub
		switch (v.getId()) {
		case R.id.get_button:
			break;

		case R.id.post_button:
			Intent intent = new Intent(this, PostActivity.class);
			startActivity(intent);
			break;
		default:
			break;
		}		
	}
	
	
}
