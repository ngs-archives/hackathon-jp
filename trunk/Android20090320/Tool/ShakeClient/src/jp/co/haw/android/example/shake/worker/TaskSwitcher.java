package jp.co.haw.android.example.shake.worker;

import java.util.ArrayList;
import java.util.List;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;

public class TaskSwitcher {
	
	private final String ACTIVITY_OF_THIS = "jp.co.haw.android.example.shake.ShakeAgent";
	private final String ANDROID_LAUNCHER = "com.android.launcher.Launcher";

	private Context context;
	
	private boolean isWaitingNext;
	private Handler processHandler = new Handler();
	private Runnable processRunnable = new Runnable() {
		public void run() {
			isWaitingNext = false;
		}
	};
	
	private int currentIndex;
	private ActivityManager activityManager;
	private List<ActivityManager.RecentTaskInfo> runningTasks = new ArrayList<ActivityManager.RecentTaskInfo>();
	
	public TaskSwitcher(Context context) {
		this.context = context;
	}
	
	public void onShake() {
		if(!isWaitingNext) {
			currentIndex = 1;
			activityManager = (ActivityManager)context.getSystemService(Context.ACTIVITY_SERVICE);
			List<ActivityManager.RecentTaskInfo> recentTaskList = activityManager.getRecentTasks(30, ActivityManager.RECENT_WITH_EXCLUDED);
			runningTasks.clear();
			
			for(int i = 0; i < recentTaskList.size(); i++) {
				ActivityManager.RecentTaskInfo recentTaskInfo = recentTaskList.get(i);
				String objName = recentTaskInfo.baseIntent.getComponent().getClassName().toString();
				if(!objName.equals(ACTIVITY_OF_THIS) && !objName.equals(ANDROID_LAUNCHER)) {
					runningTasks.add(recentTaskInfo);
				}
			}
		}
		if(runningTasks.size() < 2) {
			return;
		}
		Intent intent = new Intent(Intent.ACTION_MAIN);
		intent.addCategory(Intent.CATEGORY_LAUNCHER);
		intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		
		intent.setComponent(runningTasks.get(currentIndex).baseIntent.getComponent());
		
		context.startActivity(intent);
		currentIndex = currentIndex + 1 < runningTasks.size() ? currentIndex + 1 : 0;
		isWaitingNext = true;
		processHandler.removeCallbacks(processRunnable);
		processHandler.postDelayed(processRunnable, 3000);
	}
}
