package org.gtugs.codelab.appengine.blog;

import org.gtugs.codelab.appengine.blog.datastore.Post;

import android.app.Activity;
import android.app.ProgressDialog;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Button;
import android.widget.EditText;
import android.util.Log;
import android.view.View;

public class EditActivity extends Activity 
 implements View.OnClickListener {

    ProgressDialog saving = null;
	private Long id = null;
	public void asyncRequest(final Runnable r) {
        final Handler h = new Handler();
        final Thread t = new Thread(new Runnable() {
            public void run() {
                h.postDelayed(r, 1000);
            }
        });
        id=new Long(1002);
        t.start();
        
    }
	
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.post);

        Button postButton = (Button) findViewById(R.id.post);
        postButton.setOnClickListener(this);
        postButton.setText(R.string.edit);
    }
	
	@Override
	public void onClick(View arg0) {

        saving = new ProgressDialog(findViewById(R.id.post)
                .getContext());
        saving.setIndeterminate(true);
        saving.setMessage(getString(R.string.saving));
        saving.show();

        asyncRequest(new Runnable() {
            public void run() {

                EditText title = (EditText) findViewById(R.id.title);
                Log.d("Blog","title:"+title.getText().toString());
                EditText content = (EditText) findViewById(R.id.content);
                Log.d("Blog","content:"+content.getText().toString());
                Post p = new Post();
                p.setId(EditActivity.this.id);
                p.setTitle(title.getText().toString());
                p.setContent(content.getText().toString());
                p.save();
                saving.dismiss();
            }
        });
	}

}
