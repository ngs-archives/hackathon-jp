package org.gtugs.codelab.appengine.blog;
import org.gtugs.codelab.appengine.blog.datastore.Post;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;
public class ViewActivity extends Activity
{
 @Override
 protected void onCreate(Bundle savedInstanceState)
 {
  super.onCreate(savedInstanceState);
     // ウィンドウタイトルのアイコン(1)
     this.getWindow().requestFeature(Window.FEATURE_LEFT_ICON);
     // レイアウト設定
     setContentView(R.layout.view_activity);
     // ウィンドウタイトルのアイコン(2)
     this.getWindow().setFeatureDrawableResource(Window.FEATURE_LEFT_ICON, R.drawable.icon);
     Button btnEdit = (Button) findViewById(R.id.View_Button_Edit);
     Button btnClose = (Button) findViewById(R.id.ViewButton_windowclose);
     TextView txtDate = (TextView) findViewById(R.id.View_FieldContent_Date);
     TextView txtTitle = (TextView) findViewById(R.id.View_FieldContent_Title);
     TextView txtContent = (TextView) findViewById(R.id.View_FieldContent_Content);
     final Long _id = getIntent().getLongExtra("id", 0L);
     final Post data = Post.findById(_id);
     txtTitle.setText(data.getTitle());
     txtDate.setText(data.getDate().toString());
     txtContent.setText(data.getContent());
     
     btnEdit.setOnClickListener(new View.OnClickListener()
     {
   @Override
   public void onClick(View v)
   {
    Intent intent = new Intent(ViewActivity.this, org.gtugs.codelab.appengine.blog.EditActivity.class);
    intent.setAction(Intent.ACTION_VIEW);
    intent.putExtra("id", data.getId());
    intent.putExtra("title", data.getTitle());
    intent.putExtra("content", data.getContent());
    intent.putExtra("date", data.getDate().toString());
    
    startActivity(intent);
   }
     });
     
     btnClose.setOnClickListener(new View.OnClickListener()
     {
   @Override
   public void onClick(View v)
   {
    finish();
   }
     });
 }
}
 
