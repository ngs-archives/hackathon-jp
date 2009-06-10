package jp.aplix.hello;

import java.util.List;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.SlidingDrawer;
import android.widget.TextView;

public class Main extends Activity 
	implements android.content.DialogInterface.OnClickListener, 
				android.view.View.OnClickListener,
				SensorEventListener{
	UDPClient connection;
	String hostname = null;
	int port = -1;
	String login = null;
	String password = null;
	boolean autoConnect = false;
	Button sendButton;
	
	boolean connected = false;
	
	private final int MENU_SETTINGS = 42;
	private final int MENU_CONNECT = MENU_SETTINGS +1;
	private final int MENU_DISCONNECT = MENU_SETTINGS +2;
	
	private SensorManager sensorManager;
	private SensorData sensorData;
	private boolean registeredSensor;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.sensorData = new SensorData();
        this.sensorManager = (SensorManager)getSystemService(SENSOR_SERVICE);
        this.registeredSensor = false;
    }

    @Override
	protected void onPause() {
		if( this.registeredSensor){
			this.sensorManager.unregisterListener(this);
			this.registeredSensor = false;
		}
		super.onPause();
	}

	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
        List<Sensor> sensors = this.sensorManager.getSensorList(Sensor.TYPE_ORIENTATION);
        
        if (sensors.size() > 0) {
            Sensor sensor = sensors.get(0);
            this.registeredSensor = this.sensorManager.registerListener(this,
                sensor,
                SensorManager.SENSOR_DELAY_FASTEST);
        }
	}

	@Override
	protected void onStart() {
    	super.onStart();
    	
    	sendButton = (Button)findViewById(R.id.sendButton);
        sendButton.setOnClickListener(this);
        
    	if (!getPrefs())
    	{
    		return;
    	}
    	
    	if ((autoConnect) && (!connected))
    	{
    		connect();
    	}
	}

	@Override
	protected void onStop() {
		disconnect();
		super.onStop();
	}
	
    
    @Override
    public boolean onCreatePanelMenu(int featureId, Menu menu)
    {  
    	menu.add(Menu.NONE, MENU_SETTINGS, Menu.NONE, R.string.settings);
    	menu.add(Menu.NONE, MENU_CONNECT, Menu.NONE, R.string.connect);
    	menu.add(Menu.NONE, MENU_DISCONNECT, Menu.NONE, R.string.disconnect);
		return true;
	}
    
	@Override
    public boolean onMenuItemSelected(int featureId, MenuItem item)
    {
    	int selected = item.getItemId();
    	
    	switch (selected)
    	{
    		case MENU_SETTINGS:
    			showDialog(MENU_SETTINGS);
    		break;
    		case MENU_DISCONNECT:
    			disconnect();
    		break;
    		case MENU_CONNECT:
    			disconnect();
    			connect();
    		break;	
    	}
		return super.onMenuItemSelected(featureId, item);
	}

	//when clicked on send button	
	public void onClick(View v) {
		if (getPrefs())
		{
			if (!connected)
			{
				connect();
			}
			EditText editText = (EditText) findViewById(R.id.input);
			if (editText != null)
			{
				String text = ""+editText.getText();
				if (text != null)
				{
					send(text);
				}
			}
		}
		else
		{
			showDialog(MENU_SETTINGS);
		}
	}



	View settingsView;
	//when  clicked on ok in the settings dialog
	public void onClick(DialogInterface dialog, int which) {
	
		if (settingsView == null)
		{
			return;
		}
		
        //save the url to the application preferences
        SharedPreferences.Editor prefsEditor = getPreferences(0).edit();
        
        EditText tv = (EditText)settingsView.findViewById(R.id.hostnameInput);
        if (tv != null)
        {                    
        	hostname = ""+tv.getText();
        	prefsEditor.putString("hostname", hostname);
        	
        }
        
        tv = (EditText)settingsView.findViewById(R.id.portInput);
        if (tv != null)
        {   
        	port = (int)Integer.parseInt(""+tv.getText());
        	prefsEditor.putInt("port", port);
        }
        
        tv = (EditText)settingsView.findViewById(R.id.loginInput);
        if (tv != null)
        {
        	login = ""+tv.getText();
        	prefsEditor.putString("login", login);
        }
        
        tv = (EditText)settingsView.findViewById(R.id.passwordInput);
        if (tv != null)
        {                    
        	password = ""+tv.getText();
        	prefsEditor.putString("password", password);
        }
        
        CheckBox cb = (CheckBox)settingsView.findViewById(R.id.autoConnectCheckbox);
        if (cb != null)
        {   
        	autoConnect = cb.isChecked();
        	prefsEditor.putBoolean("autoConnect", autoConnect);
        }
        
        prefsEditor.commit();
        Log("pref saved");
	}
    
	
	//Create the Settings dialog
	@Override
    protected Dialog onCreateDialog(int id) {
		if (id == MENU_SETTINGS) {
    		LayoutInflater factory = LayoutInflater.from(this);
    		final View inflateView = factory.inflate(R.layout.settings, null);          
    		settingsView = inflateView;
    		
            return new AlertDialog.Builder(Main.this)
            .setTitle(R.string.settings)
            .setView(settingsView)
            .setPositiveButton(R.string.ok, this)
            .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int whichButton) {

                }
            })
            .create();
        }
		return super.onCreateDialog(id);
	}
		
	@Override
	protected void onPrepareDialog(int id, Dialog dialog) {
		//load saved parameters if present
        SharedPreferences prefs = getPreferences(0);
        if (prefs != null)
        {  
        	if (prefs.contains("hostname"))
        	{
        		EditText tv = (EditText)dialog.findViewById(R.id.hostnameInput);
        		tv.setText(prefs.getString("hostname", ""));
        	}
        	
        	if (prefs.contains("port"))
        	{
        		EditText tv = (EditText)dialog.findViewById(R.id.portInput);
        		tv.setText(""+prefs.getInt("port", 4242));
        	}
        	
        	if (prefs.contains("login"))
        	{
        		EditText tv = (EditText)dialog.findViewById(R.id.loginInput);
        		tv.setText(prefs.getString("login", ""));
        	}
        	
        	if (prefs.contains("password"))
        	{
        		EditText tv = (EditText)dialog.findViewById(R.id.passwordInput);
        		tv.setText(prefs.getString("password", ""));
        	}
        	
        	if (prefs.contains("autoConnect"))
        	{
        		CheckBox cb = (CheckBox)dialog.findViewById(R.id.autoConnectCheckbox);
        		cb.setChecked(prefs.getBoolean("autoConnect", false));
        	}
        }
	}

	private boolean getPrefs()
	{
		SharedPreferences prefs = getPreferences(0);
		
        if (prefs != null)
        {  
        	if (prefs.contains("hostname"))
        	{
        		hostname = prefs.getString("hostname", null);
        	}
        	else
        	{
        		return false;
        	}
        	
        	if (prefs.contains("port"))
        	{
        		port = prefs.getInt("port", -1);
        	}
        	else
        	{
        		return false;
        	}
        	
        	if (prefs.contains("login"))
        	{
        		login = prefs.getString("login", null);
        	}
        	else
        	{
        		return false;
        	}
        	
        	if (prefs.contains("password"))
        	{
        		password = prefs.getString("password", null);
        	}
        	else
        	{
        		return false;
        	}
        	
        	if (prefs.contains("autoConnect"))
        	{
        		autoConnect = prefs.getBoolean("autoConnect", false);
        	}
        	else
        	{
        		return false;
        	}
        	return true;
        }
        return false;
	}
	
	private void connect()
	{		
		synchronized (this) {
			try {
				Log("Connecting to:"+ hostname+":"+port);
				connection = new UDPClient(hostname, port);
				connected = true;
			} catch (Exception e) {
				Log("Connection error:\n"+ e.toString());
				e.printStackTrace();
			}
		}
	}
	
	private void send(String text)
	{
		synchronized (this) {
			try {
				Log("Sending message "+text);
				connection.send(text);
			} catch (Exception e) {
				Log("sending error:\n"+ e.toString());
				e.printStackTrace();
			}
		}
	}
	
	private void sendData()
	{
		synchronized (this) {
			try {
				connection.send(sensorData);
			} catch (Exception e) {
				Log("sending error:\n"+ e.toString());
				e.printStackTrace();
			}
		}
	}
	
	private void receive()
	{
		synchronized (this) {
			try {
				String receive = connection.receive();
				if (receive != null)
				{
					Log("received:"+receive);
				}
			} catch (Exception e) {
				Log("receiving error:\n"+ e.toString());
				e.printStackTrace();
			}
		}
	}
	
	private void disconnect()
	{
		synchronized (this) {
			if (connection != null)
			{
				Log("Disconnecting");
				connection.close();
				connection = null;
				connected = false;
			}
		}
	}
    
	public void Log(String text)
	{
		if (text != null)
		{
			TextView tv = (TextView)findViewById(R.id.logTextView);
			if (tv == null)
			{
				Log.i("Log", text);
				return;
			}
			if (text.endsWith("\n"))
			{
				tv.append(text);
			}
			else
			{
				tv.append(text+"\n");
			}
		}
	}

	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		// TODO Auto-generated method stub
		
	}

	float x;
	float y;
	float z;
	
	public void onSensorChanged(SensorEvent event) {
		
		
		if(!connected){
			return ;
		}
		
		try {
			Thread.sleep(16);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		switch(event.sensor.getType()){
			case Sensor.TYPE_ACCELEROMETER:
				sensorData.setData(EventType.ACCELEROMETER, event.values[0], event.values[1], event.values[2]);
				sendData();
				setTitle(" "+event.values[0]+" "+ event.values[1]+" "+ event.values[2]);
				/*Log.v("ORIENTATION",
		                String.valueOf(event.values[0]) + ", " +
		                String.valueOf(event.values[1]) + ", " +
		                String.valueOf(event.values[2]));*/
				
				break;
				
			case Sensor.TYPE_ORIENTATION:
				
				x= updateValue(x, -event.values[1]);
				y= updateValue(y, -event.values[2]);
				//z= updateValue(z, -event.values[0]);

				sensorData.setData(EventType.ORIENTATION, x, y, z);
				sendData();
				setTitle(" "+x+" "+ y+" "+ z);
				/*Log.v("ORIENTATION",
		                String.valueOf(event.values[0]) + ", " +
		                String.valueOf(event.values[1]) + ", " +
		                String.valueOf(event.values[2]));*/
				break;
		}
	}
	
	private float updateValue(float value, float newvalue)
	{
		if (Math.abs((value - newvalue)) > 5)
		{
			return newvalue;
		}
		return value;
	}

}