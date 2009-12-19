package hoge.photostore;

import hoge.photostore.get.GetActivity;
import hoge.photostore.post.PostActivity;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class PhotoStoreActivity extends Activity implements OnClickListener {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        // ボタン登録
        Button postBtn = (Button) this.findViewById(R.id.btn_post);
        postBtn.setOnClickListener(this);
        Button getBtn = (Button) this.findViewById(R.id.btn_get);
        getBtn.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        if (R.id.btn_post == v.getId()) {
            Intent i = new Intent(PhotoStoreActivity.this, PostActivity.class);
            i.setAction(Intent.ACTION_VIEW);
            startActivity(i);
        } else if (R.id.btn_get == v.getId()) {
            Intent i = new Intent(PhotoStoreActivity.this, GetActivity.class);
            i.setAction(Intent.ACTION_VIEW);
            startActivity(i);
        }
    }
}