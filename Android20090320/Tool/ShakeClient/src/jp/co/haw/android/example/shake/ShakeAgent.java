package jp.co.haw.android.example.shake;

import java.util.ArrayList;
import java.util.List;

import jp.co.haw.android.example.shake.Application.Apps;
import android.app.Activity;
import android.content.ComponentName;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

public class ShakeAgent extends Activity {
	
	private Button buttonSelectApp;
	private Spinner spinnerShake;
	
	private ImageView selectAppIcon;
	private TextView selectAppName;
	
	private static List<ShakeInfo> shakeList;
	private static ShakeListAdapter shakeListAdapter;
	
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.shake_agent);
        
        spinnerShake = (Spinner)findViewById(R.id.SpinnerShake); 
        
        loadShakeInfo();
        
        shakeListAdapter = new ShakeListAdapter(this);
        spinnerShake.setAdapter(shakeListAdapter);
        
        buttonSelectApp = (Button)findViewById(R.id.ButtonSeelectApp);
        buttonSelectApp.setOnClickListener(new View.OnClickListener() {
        	public void onClick(View v) {

        		int resultCode = 0;
        		startActivityForResult(
        				new Intent(getApplicationContext(), ApplicationListActivity.class),
        				resultCode
        				);
        		
        	}       
        });
        
        selectAppIcon = (ImageView)findViewById(R.id.select_app_icon);
        selectAppName = (TextView)findViewById(R.id.select_app_title);
     
        Button buttonStart = (Button)findViewById(R.id.buttonStart);
        buttonStart.setOnClickListener(mStartListner);
        
        Button buttonStop = (Button)findViewById(R.id.buttonStop);
        buttonStop.setOnClickListener(mStopListner);
    }

    private OnClickListener mStartListner = new OnClickListener() {
    	public void onClick(View v) {
    		Intent intent = new Intent(Intent.ACTION_VIEW);
    		intent = new Intent(ShakeAgent.this, ShakeDetector.class);
    		startService(intent);
    	}
    };
    
    private OnClickListener mStopListner = new OnClickListener() {
    	public void onClick(View v) {
    		Intent intent = new Intent(Intent.ACTION_VIEW);
    		intent = new Intent(ShakeAgent.this, ShakeDetector.class);
    		stopService(intent);
    	}
    };
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    	
    	//if (requestCode==0 && resultCode==RESULT_OK) {
    		setAppInfo( ApplicationListActivity.getAppInfo());
        //}

    }   
    
    private void setAppInfo(AppInfo appInfo){
    	
    	selectAppIcon.setImageDrawable(appInfo.icon);
    	selectAppName.setText(appInfo.title);
    	
    	update(appInfo.intent.getComponent());
    }
    
    private void loadShakeInfo() {

    	String[] column = {Apps.ACTION, Apps.CLASS};
    	Cursor cursor = managedQuery(
    						Apps.CONTENT_URI,
    						column, 
    						null,
    						null, 
    						Apps.DEFAULT_SORT_ORDER);

    	shakeList = new ArrayList<ShakeInfo>();
    	
    	if( cursor.getCount() == 0 ){

    		ContentResolver cr = getContentResolver();
    		
    		for(int i=0; i<4; i++){
	        	ContentValues v = new ContentValues();
	        	v.put(Apps.CLASS, "jp.co.haw.android.example.shake.ShakeAgent");
	        	v.put(Apps.ACTION, i);        	
	        	cr.insert(Apps.CONTENT_URI, v);
    		}
    		
    	}else{

			cursor.moveToFirst();
			
    		for(int i=0; i<cursor.getCount(); i++){

    			
    			if( cursor.getInt(cursor.getColumnIndexOrThrow(Apps.ACTION)) == 0 ){    			
    				shakeList.add(new ShakeInfo(0, "右", cursor.getString(cursor.getColumnIndexOrThrow(Apps.CLASS))));	// 0
    			}else if( cursor.getInt(cursor.getColumnIndexOrThrow(Apps.ACTION)) == 1 ){
    				shakeList.add(new ShakeInfo(1, "左", cursor.getString(cursor.getColumnIndexOrThrow(Apps.CLASS)))); // 1
    			}else if( cursor.getInt(cursor.getColumnIndexOrThrow(Apps.ACTION)) == 2 ){
    				shakeList.add(new ShakeInfo(2, "奥", cursor.getString(cursor.getColumnIndexOrThrow(Apps.CLASS)))); // 2
    			}else if( cursor.getInt(cursor.getColumnIndexOrThrow(Apps.ACTION)) == 3 ){
    				shakeList.add(new ShakeInfo(3, "手前", cursor.getString(cursor.getColumnIndexOrThrow(Apps.CLASS)))); // 3
    			}
    			
    			cursor.moveToNext();
    		}
    	}
	}
    
    private ShakeInfo getCurrentShakeInfo(){
    	return shakeList.get(spinnerShake.getSelectedItemPosition());
    }
    
    private void update(ComponentName componentName){

    	ShakeInfo shakeInfo = getCurrentShakeInfo();
    	
    	String where = String.format(" %s=%d ", Apps.ACTION, shakeInfo.action);
    	
    	ContentResolver cr = getContentResolver();
    	
    	ContentValues v = new ContentValues();
    	System.out.println(componentName.getPackageName());
    	String app = componentName.getClassName();
    	v.put(Apps.CLASS, app);
    	v.put(Apps.ACTION, shakeInfo.action);
    	
    	cr.update(Apps.CONTENT_URI, v, where, null);
    }
    
//    private void insert(){
//
//    	cr = getContentResolver();
//    	ContentValues v = new ContentValues();
//    	v.put(Apps.CLASS, ShakeAgent.class.toString());
//    	v.put(Apps.ACTION, 1);
//    	
//    	Uri uri = cr.insert(Apps.CONTENT_URI, v);
//    	
//    	int i = cr.delete(uri, null, null);
//    	
//    	cr.update(uri, v, null, null);
//    }
    

    private static class ShakeListAdapter extends BaseAdapter {
        private LayoutInflater mInflater;
    	private Context mContext;
    	

    	public ShakeListAdapter(Context anContext) {
    		this.mContext = anContext;
            mInflater = LayoutInflater.from(mContext);
    	}
    	
    	@Override
    	public int getCount() {
    		return shakeList.size(); 
    	}

    	@Override
    	public Object getItem(int position) {
    		return shakeList.get(position);
    	}

    	@Override
    	public long getItemId(int position) {
    		return position;
    	}

    	@Override
    	public View getView(int position, View convertView, ViewGroup parent) {
            ViewHolder holder;
    		
    		if(convertView == null){
                convertView = mInflater.inflate(R.layout.shake_list_item, null);
                holder = new ViewHolder();
                holder.title = (TextView) convertView.findViewById(R.id.name);
                convertView.setTag(holder);
    		}else {
                holder = (ViewHolder) convertView.getTag();
            }
    		
    		ShakeInfo shakeInfo = shakeList.get(position);
    		holder.title.setText(shakeInfo.name);

    		return convertView;
    	}
    	
        static class ViewHolder {
        	TextView title;
        }
    }
}