package jp.co.haw.android.example.shake;

import android.content.ComponentName;
import android.content.Intent;
import android.graphics.drawable.Drawable;

public class AppInfo {
	    public CharSequence title;   //タイトル
	    public Intent       intent;  //インテント
	    public Drawable     icon;    //アイコン
	    public boolean      filtered;//フィルター

	    //アクティビティの指定
	    public void setActivity(ComponentName className,int launchFlags) {
	        intent=new Intent(Intent.ACTION_MAIN);
	        intent.addCategory(Intent.CATEGORY_LAUNCHER);
	        intent.setComponent(className);
	        intent.setFlags(launchFlags);
	    }

	    //イコール
	    @Override
	    public boolean equals(Object o) {
	        if (this==o) return true;
	        if (!(o instanceof AppInfo)) return false;
	        AppInfo info=(AppInfo)o;
	        return title.equals(info.title) &&
	            intent.getComponent().getClassName().equals(
	                    info.intent.getComponent().getClassName());
	    }

	    //ハッシュコード
	    @Override
	    public int hashCode() {
	        int result=(title!=null?title.hashCode():0);
	        String name=intent.getComponent().getClassName();
	        result=31*result+(name!=null?name.hashCode():0);
	        return result;
	    }
}
