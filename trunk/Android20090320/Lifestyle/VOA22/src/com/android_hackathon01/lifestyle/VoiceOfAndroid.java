package com.android_hackathon01.lifestyle;
import com.google.tts.TTS;

import java.util.ArrayList;
import java.util.Locale;

import com.google.api.translate.Language;

import android.app.Activity;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Spinner;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;

public class VoiceOfAndroid extends Activity {
    /**
     * Spinner Key array
     */
    private static String[] spinnerKeyStrings = (String[])Language.validLanguages.toArray();
    /**
     * Spinner Value array
     */
    private static String[] spinnerStrings = {
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
    private String transTo = "en";
    private int englishPos = 11;
	private static final String PREFERENCES_FILE_NAME = "preferencesFile";
    /**
     * Text to Speach Obj
     */
	private TTS myTts;
    private static final int VOICE_RECOGNITION_REQUEST_CODE = 1234;
	private static final int MENU_ID_MENU1 = 0;
    private View voiceInputView;

	/** Called when the activity is first created. */
    @Override
    /***
     * This is OnCreate Override method
     */
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        registerForContextMenu(findViewById(R.id.text));
        //change to local language
        String [] localSpinnerStrings = this.changeLocalLanguage();

        //Get preference
        SharedPreferences savedData = getSharedPreferences(PREFERENCES_FILE_NAME, 0);
        int fromPos = savedData.getInt("FROM_POS", englishPos);
        int toPos = savedData.getInt("TO_POS", englishPos);
        boolean chk = savedData.getBoolean("CHK", false);

        //Create From Spinner
        Spinner fromSpinner = (Spinner) findViewById(R.id.fromSpinner);
        ArrayAdapter<String> adapterFrom = new ArrayAdapter<String>(this,
                android.R.layout.simple_spinner_item, localSpinnerStrings);
        adapterFrom.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        fromSpinner.setAdapter(adapterFrom);
        fromSpinner.setSelection(fromPos);

        //Create To Spinner
        Spinner toSpinner = (Spinner) findViewById(R.id.toSpinner);
        ArrayAdapter<String> adapterTo = new ArrayAdapter<String>(this,
                android.R.layout.simple_spinner_item, localSpinnerStrings);
        adapterTo.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        toSpinner.setAdapter(adapterTo);
        toSpinner.setSelection(toPos);

        //auto check box
        CheckBox autoChk = (CheckBox)findViewById(R.id.autoChk);
        autoChk.setChecked(chk);

        //Voice Input Button Event
        final Button voiceInputBtn = (Button) findViewById(R.id.voiceInputBtn);
        voiceInputBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
				voiceInputView = v;
				voiceInputAction();
			}
        });

        //Translation Button Event
        final Button transBtn =(Button)findViewById(R.id.transBtn);
        transBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
				translationAction();
			}
        });
        //Speak Button Event
        final Button speakBtn = (Button)findViewById(R.id.speakBtn);
        //speakBtn.setEnabled(false);
        speakBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
		    	myTts = new TTS(v.getContext(), ttsInitListener, true);
			}
        });
        //Swap Button Event
        final Button swapBtn = (Button)findViewById(R.id.swapBtn);
        swapBtn.setOnClickListener(new Button.OnClickListener(){
			public void onClick(View v) {
				Spinner fromSpinner = (Spinner) findViewById(R.id.fromSpinner);
				Spinner toSpinner = (Spinner) findViewById(R.id.toSpinner);
		        int fromPos = fromSpinner.getSelectedItemPosition();
		        int toPos = toSpinner.getSelectedItemPosition();
		        //Swap pos
		        fromSpinner.setSelection(toPos);
		        toSpinner.setSelection(fromPos);
		        EditText text = (EditText)findViewById(R.id.text);
		        EditText res = (EditText)findViewById(R.id.res);
		        String textStr = text.getText().toString();
		        String resStr = res.getText().toString();
		        text.setText(resStr);
		        res.setText(textStr);
			}
        });
    }
    //To Translation
    public void translationAction() {
		try {
	        EditText text = (EditText)findViewById(R.id.text);
			Spinner fromSpinner = (Spinner) findViewById(R.id.fromSpinner);
			String fromKey = spinnerKeyStrings[fromSpinner.getSelectedItemPosition()];
			Spinner toSpinner = (Spinner) findViewById(R.id.toSpinner);
			String toKey = spinnerKeyStrings[toSpinner.getSelectedItemPosition()];
			transTo = toKey;//set to lang
	        Button speakBtn = (Button)findViewById(R.id.speakBtn);
			setEnabledSpeakBtn(speakBtn, toKey);
			String transResult = translate(text.getText().toString(), fromKey, toKey);
			EditText res = (EditText)findViewById(R.id.res);
			res.setText(transResult);
		} catch (Exception e){
		    AlertDialog.Builder ad = new AlertDialog.Builder(VoiceOfAndroid.this);
		    ad.setTitle("Exception Occurred");
		    ad.setMessage("probability can't connected Internet");
		    ad.setPositiveButton("OK",new DialogInterface.OnClickListener() {
		        public void onClick(DialogInterface dialog,int whichButton) {
		            setResult(RESULT_OK);
		        }
		    });
		    ad.create();
		    ad.show();
			Log.d("VoiceOfAndroid", e.getStackTrace().toString());
		}
    }
    //Create Menu
    @Override
	public boolean onCreateOptionsMenu(Menu menu) {
    	//add menu item
    	MenuItem item0 = menu.add(Menu.NONE, MENU_ID_MENU1, Menu.NONE, "Share");
    	item0.setIcon(android.R.drawable.ic_menu_share);
		return super.onCreateOptionsMenu(menu);
	}
    //Menu Selected Action
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		boolean ret = true;
		switch (item.getItemId()) {
        default:
            ret = super.onOptionsItemSelected(item);
            break;
        case MENU_ID_MENU1:
            ret = true;
            EditText text = (EditText)findViewById(R.id.text);
            EditText res = (EditText)findViewById(R.id.res);
            String sendData = text.getText().toString() + ":" + res.getText().toString();
            //intent action
            Intent intent = new Intent();
            intent.setAction(intent.ACTION_SEND);
            intent.setType("text/plain");
            intent.putExtra(Intent.EXTRA_TEXT, sendData);
            startActivity(intent);
            break;
        }
		return ret;
	}
	//Voice Input Intent
    public void voiceInputAction() {
		try {
	        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
			Spinner fromSpinner = (Spinner) findViewById(R.id.fromSpinner);
			String fromKey = spinnerKeyStrings[fromSpinner.getSelectedItemPosition()];

			intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, fromKey);
	        startActivityForResult(intent, VOICE_RECOGNITION_REQUEST_CODE);
		} catch (Exception e){
		    AlertDialog.Builder ad = new AlertDialog.Builder(VoiceOfAndroid.this);
		    ad.setTitle("Exception Occurred");
		    ad.setMessage("probability can't connected Internet");
		    ad.setPositiveButton("OK",new DialogInterface.OnClickListener() {
		        public void onClick(DialogInterface dialog,int whichButton) {
		            setResult(RESULT_OK);
		        }
		    });
		    ad.create();
		    ad.show();
			Log.d("VoiceOfAndroid", e.getStackTrace().toString());
		}
    }
    /**
     * Text to Seach Listener
     */
	private TTS.InitListener ttsInitListener = new TTS.InitListener() {
        public void onInit(int version) {
			Spinner toSpinner = (Spinner) findViewById(R.id.toSpinner);
			String toKey = spinnerKeyStrings[toSpinner.getSelectedItemPosition()];
			if (toKey == null || toKey == "") toKey = "en";
        	myTts.setLanguage(toKey);
	   		EditText res = (EditText)findViewById(R.id.res);
	   		String speakText = res.getText().toString();
	   		if (transTo.equals("ja")) {
	        	myTts.setLanguage("en");//to speak english mode
	   			try {
					Log.d("--VoiceOfAndroid(Before)--", speakText);
		   			speakText = YahooFuriganaParser.getRoman(speakText);
					Log.d("--VoiceOfAndroid(After)--", speakText);
	   			} catch (Exception e) {
				    AlertDialog.Builder ad = new AlertDialog.Builder(VoiceOfAndroid.this);
				    ad.setTitle("Exception Occurred");
				    ad.setMessage("Exception of Yahoo Furigana API");
				    ad.setPositiveButton("OK",new DialogInterface.OnClickListener() {
				        public void onClick(DialogInterface dialog,int whichButton) {
				            setResult(RESULT_OK);
				        }
				    });
				    ad.create();
				    ad.show();
					Log.d("VoiceOfAndroid", e.getStackTrace().toString());
	   			}
	   		}
	   		myTts.speak(speakText, 0, null);
        }
      };

    /**
     * Set Enabled SpeakBtn
     */
    private void setEnabledSpeakBtn(Button speakBtn, String toKey) {
		Log.d("--VoiceOfAndroid--", toKey);
    	if (toKey.equals("en") || toKey.equals("ja")) {
    		speakBtn.setEnabled(true);
    	} else {
    		//speakBtn.setEnabled(false);
    		speakBtn.setEnabled(true);
    	}
    }
    /**
     * Change Local Lang of button and spinner
     */
    private String[] changeLocalLanguage() {
        //Change button and Spinner Locale
		try {
	        ArrayList<String> spinnerList = new ArrayList<String>();
	        String keyName = this.exchangeLocaleToKeyName();
	        Button voiceInputBtn = (Button) findViewById(R.id.voiceInputBtn);
	        Button transBtn = (Button)findViewById(R.id.transBtn);
	        Button speakBtn = (Button)findViewById(R.id.speakBtn);
	        CheckBox autoChk = (CheckBox)findViewById(R.id.autoChk);
	        Button swapBtn = (Button)findViewById(R.id.swapBtn);
	        StringBuffer transSb = new StringBuffer();
	        transSb.append(transBtn.getText().toString() + "/");
	        transSb.append(speakBtn.getText().toString() + "/");
	        transSb.append(voiceInputBtn.getText().toString() + "/");
	        transSb.append(autoChk.getText().toString() + "/");
	        transSb.append(swapBtn.getText().toString() + "/");
	        for (int i = 0; i < spinnerStrings.length; i++) {
	        	if (spinnerStrings[i] == null || spinnerStrings[i].equals("")) {
	        		transSb.append("" + "/");
	        	} else {
	        		transSb.append(spinnerStrings[i] + "/");
	        	}
	        }
	        String transString = transSb.toString();
	        transString = transString.substring(0, transString.lastIndexOf("/"));;
	        String transCSV = translate(transString, "en", keyName);
			String [] transStrings = transCSV.split("/", -1);
	        transBtn.setText(transStrings[0]);
	        speakBtn.setText(transStrings[1]);
	        voiceInputBtn.setText(transStrings[2]);
	        autoChk.setText(transStrings[3]);
	        swapBtn.setText(transStrings[4]);
	        for (int i = 5; i < transStrings.length; i++) {
	        	if (transStrings[i] == null || transStrings[i].equals("")) {
	        		spinnerList.add("");
	        	} else {
	        		spinnerList.add(transStrings[i]);
	        	}
	        }
	        String [] localSpinnerStrings = (String[])spinnerList.toArray(new String[spinnerList.size()]);
	        if (localSpinnerStrings.length == spinnerStrings.length) {
	        	return localSpinnerStrings;
	        } else {
				return spinnerStrings;
	        }
		} catch (Exception e){
			return spinnerStrings;
		}
    }
    /**
     * Handle the results from the recognition activity.
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == VOICE_RECOGNITION_REQUEST_CODE && resultCode == RESULT_OK) {
            // Fill the list view with the strings the recognizer thought it could have heard
            ArrayList<String> matches = data.getStringArrayListExtra(
                    RecognizerIntent.EXTRA_RESULTS);
            EditText inText = (EditText)findViewById(R.id.text);
            String matchesStr = matches.toString();
            matchesStr = matchesStr.substring(1, matchesStr.length() -1);
            inText.setText(matchesStr);
	        CheckBox autoChk = (CheckBox)findViewById(R.id.autoChk);
	        if (autoChk.isChecked()) {
	        	translationAction();
		    	myTts = new TTS(voiceInputView.getContext(), ttsInitListener, true);
	        }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }
    /**
     * Translation text
     */
    public static String translate(String text, String fromKey, String toKey)throws Exception {
    	if (fromKey == null || fromKey.equals("")) fromKey = "en";
    	if (toKey == null || toKey.equals("")) toKey = "en";
		String transResult = Translation.translate(text.toString(), fromKey, toKey);
		return transResult;
    }
    /**
     * Get Locale Of this Android
     */
    private String exchangeLocaleToKeyName() {
    	String locale = getResources().getConfiguration().locale.getLanguage();
    	Log.d("--VoiceOfAndroid--", locale);
    	//return locale;
    	return locale;
    }
    /**
     * save preference
     */
    @Override
    protected void onPause() {
        super.onPause();
        SharedPreferences savedData = getSharedPreferences(PREFERENCES_FILE_NAME, 0);
        SharedPreferences.Editor editor = savedData.edit();
        Spinner fromSpinner = (Spinner) findViewById(R.id.fromSpinner);
        Spinner toSpinner = (Spinner) findViewById(R.id.toSpinner);
        CheckBox autoChk = (CheckBox)findViewById(R.id.autoChk);
        int fromPos = fromSpinner.getSelectedItemPosition();
        int toPos = toSpinner.getSelectedItemPosition();
        boolean chk = autoChk.isChecked();
        editor.putBoolean("CHK", chk);
        editor.putInt("FROM_POS", fromPos);
        editor.putInt("TO_POS", toPos);
		if (editor.commit()) {
			Log.d("--ACL--", "Editor Commit OK");
		} else {
			Log.e("--ACL--", "Editor Commit Error");
		}
    }

}