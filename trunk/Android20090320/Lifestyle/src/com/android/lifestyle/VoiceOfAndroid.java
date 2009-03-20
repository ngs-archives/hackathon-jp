package com.android.lifestyle;

import android.app.Activity;
import android.os.Bundle;
import android.widget.Button;

public class VoiceOfAndroid extends Activity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        // 日本語ボタン取得
        Button jaBtn =(Button)findViewById(R.id.jsave);
        // 英語ボタン取得
        Button enBtn =(Button)findViewById(R.id.esave);
        // フランス語ボタン取得
        Button frBtn =(Button)findViewById(R.id.fsave);

    }
}