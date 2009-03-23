package com.android.lifestyle;

import com.google.api.translate.Language;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

public class VoiceOfAndroid extends Activity {

	/** Called when the activity is first created. */
    @Override
    /***
     * This is OnCreate Override method
     */
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        final EditText text = (EditText)findViewById(R.id.text);
        registerForContextMenu(findViewById(R.id.text));
        //Create From Spinner
        Spinner fromSpinner = (Spinner) findViewById(R.id.fromSpinner);
        ArrayAdapter<String> adapterFrom = new ArrayAdapter<String>(this,
                android.R.layout.simple_spinner_item, SpinnerStrings);
        adapterFrom.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        fromSpinner.setAdapter(adapterFrom);

        //Create To Spinner
        Spinner toSpinner = (Spinner) findViewById(R.id.toSpinner);
        ArrayAdapter<String> adapterTo = new ArrayAdapter<String>(this,
                android.R.layout.simple_spinner_item, SpinnerStrings);
        adapterTo.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        toSpinner.setAdapter(adapterTo);
        
        //Translation Button Event
        final Button jaBtn =(Button)findViewById(R.id.transBtn);
        jaBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
				try {
					Spinner fromSpinner = (Spinner) findViewById(R.id.fromSpinner);
					String fromKey = SpinnerKeyStrings[fromSpinner.getSelectedItemPosition()];
					Spinner toSpinner = (Spinner) findViewById(R.id.toSpinner);
					String toKey = SpinnerKeyStrings[toSpinner.getSelectedItemPosition()];
					String transResult = Translation.translate
										(text.getText().toString(), fromKey, toKey);
					TextView res = (TextView)findViewById(R.id.res);
					res.setText(transResult);
				} catch (Exception e){
					Log.d("OnClick", e.getStackTrace().toString());
				}
			}
        });
    }
    /**
     * Spinner Key array
     */
    private static final String[] SpinnerKeyStrings = (String[])Language.validLanguages.toArray();
    /**
     * Spinner Value array
     */
    private static final String[] SpinnerStrings = {
        "", "ARABIC", "BULGARIAN", "CATALAN",
        "CHINESE", "CHINESE_SIMPLIFIED", "CHINESE_TRADITIONAL",
        "CROATIAN", "CZECH", "DANISH", "DUTCH",
        "ENGLISH", "FILIPINO", "FINNISH", "FRENCH", "GALACIAN",
        "GERMAN", "GREEK", "HEBREW", "HINDI", "HUNGARIAN",
        "INDONESIAN", "ITALIAN", "JAPANESE", "KOREAN", "LATVIAN",
        "LITHUANIAN", "MALTESE", "NORWEGIAN", "POLISH", "PORTUGESE",
        "ROMANIAN", "RUSSIAN", "SERBIAN", "SLOVAK", "SLOVENIAN",
        "SPANISH", "SWEDISH", "THAI", "TURKISH", "UKRANIAN",
        "VIETNAMESE"
        };
}