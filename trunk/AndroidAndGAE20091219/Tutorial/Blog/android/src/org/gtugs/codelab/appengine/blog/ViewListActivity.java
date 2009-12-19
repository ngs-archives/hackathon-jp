package org.gtugs.codelab.appengine.blog;

import java.util.List;
import org.gtugs.codelab.appengine.blog.datastore.Post;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;

public class ViewListActivity extends Activity {
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// ウィンドウタイトルのアイコン(1)
		this.getWindow().requestFeature(Window.FEATURE_LEFT_ICON);
		// レイアウト設定
		setContentView(R.layout.viewlist_activity);
		// ウィンドウタイトルのアイコン(2)
		this.getWindow().setFeatureDrawableResource(Window.FEATURE_LEFT_ICON,
				R.drawable.icon);
		Button btnClose = (Button) this
				.findViewById(R.id.ViewList_Button_windowclose);
		Button btnNewPost = (Button) this
				.findViewById(R.id.ViewList_Button_NewPost);
		ListView listView = (ListView) this
				.findViewById(R.id.ViewList_ListView);
		List<Post> allData = this._getAllData();
		ArrayAdapter<Post> adapter = new ArrayAdapter<Post>(this,
				R.layout.viewlist_row, allData);
		listView.setAdapter(adapter);
		btnNewPost.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent intent = new Intent(ViewListActivity.this,
						org.gtugs.codelab.appengine.blog.PostActivity.class);
				intent.setAction(Intent.ACTION_VIEW);
				startActivity(intent);
			}
		});
		btnClose.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				finish();
			}
		});
		listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
			@Override
			public void onItemClick(AdapterView<?> parent, View view,
					int position, long id) {
				final Object chosen = parent.getAdapter().getItem(position);
				if (chosen instanceof Post) {
					Post selectedPost = (Post) chosen;
					Intent intent = new Intent(ViewListActivity.this,
							org.gtugs.codelab.appengine.blog.ViewActivity.class);
					intent.setAction(Intent.ACTION_VIEW);
					intent.putExtra("id", selectedPost.getId());
					startActivity(intent);
				}
			}
		});
	}

	/**
	 * 
	 * @return
	 */
	private List<Post> _getAllData() {
		// TODO - Stub Data To ListView
		return Post.select();
	}
}
