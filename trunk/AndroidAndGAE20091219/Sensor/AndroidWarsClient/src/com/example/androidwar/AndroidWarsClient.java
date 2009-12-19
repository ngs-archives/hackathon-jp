package com.example.androidwar;

import java.util.HashMap;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import com.example.androidwar.common.Constant;
import com.example.androidwar.util.Util;

public class AndroidWarsClient extends Activity implements Shaker.Callback , OnSendListener {

	private EditText editName;
	private Button btSet;
	private String name;
	private Shaker shaker = null;
	private DataPostTask task = null;
	private TouchPanel touchPanel;
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
		this.touchPanel = new TouchPanel(this);
		this.touchPanel.setOnSendsListner(this);
		
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
		
	    shaker = new Shaker(this, 1.25d, 500, this);
	}


	@Override
	public void onDestroy() {
	   super.onDestroy();
	   shaker.close();
	}
  
    /**
     * TouchPanelからコールバックされる
     */
    @Override
    public void onSend(HashMap<String, Object> data) {
      Log.v("AndroidWarsClient",Util.showMoveData(data));
        send(data);
    }
    
	@Override
    public void shakingStarted(int power) {
        HashMap<String,Object> data = Util.generateAtackData(Constant.ActionType.ACTION_ATACK, name, power);
        Log.d("Shaker",Util.showAttackData(data));
        send(data);
    }

    @Override
    public void shakingStopped() {
        //no use
    }
    
    public void send(HashMap<String ,Object> data){
      task = new DataPostTask();
      task.execute(data);
    }
}