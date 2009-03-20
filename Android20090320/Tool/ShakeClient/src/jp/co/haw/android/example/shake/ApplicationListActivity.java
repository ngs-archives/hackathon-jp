package jp.co.haw.android.example.shake;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import android.app.ListActivity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

public class ApplicationListActivity extends ListActivity {
	
	private static List<AppInfo> appList;
	private static AppListAdapter appListAdapter;
	
	private static AppInfo selectedAppInfo;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.application_list);

        loadAppInfo();
        
        for(AppInfo app: appList){
        	System.out.println(app.title);
        }
//
        appListAdapter = new AppListAdapter(this);
        setListAdapter(appListAdapter);
                
    }
	
    @Override
    protected void onListItemClick(ListView l, View v, int position, long id){
    	super.onListItemClick(l, v, position, id);
    	selectedAppInfo = appList.get(position);
    	setResult(0, getIntent());
    	finish();
    };
    
    public static AppInfo getAppInfo(){
    	return selectedAppInfo;
    }
    
    //アプリ情報の読み込み
    private void loadAppInfo() {
    	
        //アプリ情報の読み込み
        PackageManager manager= getPackageManager();
        Intent mainIntent=new Intent(Intent.ACTION_MAIN,null);
        mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);        
        List<ResolveInfo> apps=manager.queryIntentActivities(mainIntent,0);
        Collections.sort(apps,new ResolveInfo.DisplayNameComparator(manager));

        //アプリリストの生成
        appList=new ArrayList<AppInfo>();
        if (apps==null) return;
        for (int i=0;i<apps.size();i++) {
            AppInfo appInfo=new AppInfo();
            ResolveInfo info=apps.get(i);
            appInfo.title=info.loadLabel(manager);
            appInfo.setActivity(new ComponentName(
                info.activityInfo.applicationInfo.packageName,
                info.activityInfo.name),
                Intent.FLAG_ACTIVITY_NEW_TASK
                |Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
            appInfo.icon=info.activityInfo.loadIcon(manager);
            appList.add(appInfo);
        }
    }  


    private static class AppListAdapter extends BaseAdapter {
        private LayoutInflater mInflater;
    	private Context mContext;

    	public AppListAdapter(Context anContext) {
    		this.mContext = anContext;
            mInflater = LayoutInflater.from(mContext);
    	}
    	
		@Override
		public int getCount() {
			return appList.size(); 
		}

		@Override
		public Object getItem(int position) {
			return appList.get(position);
		}

		@Override
		public long getItemId(int position) {
			return position;
		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
	        ViewHolder holder;
			
			if(convertView == null){
	            convertView = mInflater.inflate(R.layout.application_list_item, null);
	            holder = new ViewHolder();
	            holder.title = (TextView) convertView.findViewById(R.id.title);
	            holder.icon  = (ImageView) convertView.findViewById(R.id.icon);
	            convertView.setTag(holder);
			}else {
	            holder = (ViewHolder) convertView.getTag();
	        }
			
			AppInfo appInfo = appList.get(position);
			holder.icon.setImageDrawable(appInfo.icon);
			holder.title.setText(appInfo.title);

			return convertView;
		}
    	
	    static class ViewHolder {
	    	TextView title;
	    	ImageView 		icon;
	    }
    }
}
