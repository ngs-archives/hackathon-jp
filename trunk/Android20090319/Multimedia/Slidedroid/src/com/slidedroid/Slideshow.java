package com.slidedroid;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;

import com.google.android.maps.GeoPoint;

import android.app.Activity;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Address;
import android.location.Geocoder;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.provider.MediaStore.Images;
import android.provider.MediaStore.Images.Media;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.Window;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;
import static android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON;

public class Slideshow extends Activity {
    static final private String TAG = "SlideShow";
    static final int sNextImageInterval = 5000;
    private boolean mPosted = false;
    private int mCurrentPosition = 0;

    private TextView date_view = null;
    private TextView place_view = null;

    ImageView mSwitcher = null;
    private Integer[] mImageIds = {
            R.drawable.img1, R.drawable.img2, R.drawable.img3
    };

    private Integer[] mAnime = {
    		R.anim.slide_left,
    		R.anim.slide_right,
    		R.anim.slide_top_to_bottom,
    		R.anim.hyperspace_in
    };

	private Cursor imgCursor;
	private String [] imgUri;
	Geocoder gc = null;

	private class ImgInfo {
		int id;
		 String uri;
		 String taken;
		 String disName;
		 String decs;
		 int size;
		 Double lon;
		 Double lat;
		 String location;
		 Address adr;
		 String sAdr="default address";
		 
		 GeoPoint pt;
		 
		 ImgInfo() {
			 // pt = new GeoPoint();
		 }
		 
		 boolean getAdr() {
			 
			 if(gc==null)
				 return false;
			 
			 List<Address> la = null;
			 adr = null;
			 boolean b=false;
			 try {
				la = gc.getFromLocation(lat, lon, 1);
				if(la!=null && la.size()>0) {
					adr = la.get(0);
					sAdr = adr.toString();
					b = true;
				}
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return b;
			 
		 }
		 
	}
	
	private ImageView mView;
	
	private int cnt=0;
	private ImgInfo [] imgInfo;
    private String [] proj = new String [] {
			Images.Media._ID,
			// Images.Media._COUNT,
			Images.Media.DATA,
			Images.Media.DATE_TAKEN,
			Images.Media.DISPLAY_NAME,
			Images.Media.DESCRIPTION,
			Images.Media.SIZE,
			Images.Media.LONGITUDE,
			Images.Media.LATITUDE
	};

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Window wp = getWindow();
        wp.setFlags(FLAG_KEEP_SCREEN_ON, FLAG_KEEP_SCREEN_ON);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        
        setContentView(R.layout.slideshow);
        
        mSwitcher = (ImageView)findViewById(R.id.imageview);
        mSwitcher.setImageResource(R.drawable.img1);

        date_view = (TextView)findViewById(R.id.date_view);
        place_view = (TextView)findViewById(R.id.place_view);

        setCursor();
        showCursorEntries();
    }
    
    private void setCursor() {
    	Uri imgUri = Media.EXTERNAL_CONTENT_URI;
    	// Uri imgUri = Media.INTERNAL_CONTENT_URI;
    	
    	imgCursor = managedQuery(imgUri, proj, null, null, Media.DATE_TAKEN + " ASC");   	
    	Log.d(TAG, "Got img cursor: " + imgCursor.getCount() + " entires");
    }
    
    private void showCursorEntries() {
    	
    	int n = cnt = imgCursor.getCount();
    	Log.d(TAG, "Got img cursor: " + imgCursor.getCount() + " entires");
    	
    	imgUri = new String[n];
    	imgInfo = new ImgInfo[n];
    	
    	int [] c = new int[proj.length];
    	
    	int i;
    	if (imgCursor.moveToFirst()) {
    		String dateTaken, dataStr;
    		int size, id;
    		int sid;
    		
    		for(i=0; i<proj.length; i++) {
    			c[i] = imgCursor.getColumnIndex(proj[i]);
    		}
    		
    		i=0;
    		
    		do {
    			// id = imgCursor.getInt(0);
    			imgInfo[i] = new ImgInfo();
    			
    			imgInfo[i].id = imgCursor.getInt(c[0]);
    			imgInfo[i].uri = imgCursor.getString(c[1]);
    			imgInfo[i].taken = imgCursor.getString(c[2]);
    			imgInfo[i].size = imgCursor.getInt(c[5]);
    			imgInfo[i].lon = imgCursor.getDouble(c[6]);
    			imgInfo[i].lat = imgCursor.getDouble(c[7]);
    			
    			Log.d(TAG, "id=" + imgInfo[i].id + ", taken=" + imgInfo[i].taken + ", s=" + imgInfo[i].uri);
    			Log.d(TAG,	", t=" + imgInfo[i].disName + ", d=" + imgInfo[i].decs);
    			
    			boolean b = imgInfo[i].getAdr();
    			if (b) {
    				Log.d(TAG, imgInfo[i].sAdr);
    			}
    			i++;
    			
    		} while (imgCursor.moveToNext());
    	
    		
    	}
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadImage();
    }

    @Override
    protected void onPause() {
        super.onPause();
        cancelPost();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        menu.add(0, 0, 0, "TEST1");
        menu.add(0, 1, 0, "TEST2");
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        return true;
    }

	private static final int SCR_WIDHT = 200;
	private static final int SCR_HEIGHT = 480;
	private Bitmap bmp = null;
	
    private void loadImage() {
//        SimpleDateFormat sdf1 = new SimpleDateFormat("yy/MM/dd HH:mm:ss");

//        int i = Integer.getInteger(imgInfo[mCurrentPosition].taken);
//        Date d = new Date(i);
        
        place_view.setText("Tokyo");
		date_view.setText(imgInfo[mCurrentPosition].taken);
//		date_view.setText(sdf1.format(d));
		
    	int w = SCR_WIDHT;
    	
    	Log.d(TAG, "Position = " + mCurrentPosition);
    	BitmapFactory.Options opt = new BitmapFactory.Options();
    	opt.outWidth = w;
    	opt.outHeight = w/2 * 3;
    	if (bmp != null) {
    		bmp.recycle();
    	}
    	bmp = BitmapFactory.decodeFile(imgInfo[mCurrentPosition].uri, opt);

    	mSwitcher.setImageBitmap(bmp);
//        mSwitcher.setImageResource(mImageIds[mCurrentPosition]);

        Random rand = new Random();
        Integer no = Math.abs(rand.nextInt() % mAnime.length);
    	Animation anim = AnimationUtils.loadAnimation(this, mAnime[no]);
    	anim.setRepeatMode(Animation.RESTART);
    	mSwitcher.startAnimation(anim);

    	post();
    }

    private void cancelPost() {
        mHandler.removeCallbacks(mImageLoadRunnable);
        mPosted = false;
    }

    private void post() {
        mHandler.postDelayed(mImageLoadRunnable, sNextImageInterval);
        mPosted = true;
    }

    private Runnable mImageLoadRunnable = new Runnable() {
        public void run() {
//            loadNextImage();
//            if (++mCurrentPosition >= mImageIds.length)
            if (++mCurrentPosition >= imgInfo.length)
                mCurrentPosition = 0;
            loadImage();
        }
    };

    private final Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
        }
    };
}