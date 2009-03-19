package com.slidedroid;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Address;
import android.location.Geocoder;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore.Images;
import android.provider.MediaStore.Images.Media;
import android.util.Log;
import android.widget.ImageView;
import android.widget.Toast;

import com.google.android.maps.GeoPoint;

public class Slideshow extends Activity {
	
	private static final int SCR_WIDHT = 200;
	private static final int SCR_HEIGHT = 480;
	
	private final static String TAG = "Slideshow";
	private Cursor imgCursor;
	
	private String [] imgUri;
	
	Geocoder gc;
	
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
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        gc = new Geocoder(this);
        
        mView = (ImageView)findViewById(R.id.main);
        
        setCursor();
        
        showCursorEntries();
        
        drawImg(cnt-1);
        
       addDescription2(cnt-1, "Nice pic", "It was so hot...");
    }
    
    
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
    
    private void drawImg(int i) {
    	
    	int w = SCR_WIDHT;
    	
    	BitmapFactory.Options opt = new BitmapFactory.Options();
    	opt.outWidth = w;
    	opt.outHeight = w/2 * 3;
    
    	Bitmap bmp = BitmapFactory.decodeFile(imgInfo[0].uri, opt);
    	
    	
    	// float rf = (float)bmp.getWidth() / SCR_WIDHT;
    	// int h = (int) (bmp.getHeight() / rf);
    
    	mView.setImageBitmap(bmp);
    	
    	// Toast t = new Toast(this);
    	Toast.makeText(this, imgInfo[i].sAdr, 10).show();
    	// t.setText(imgInfo[i].sAdr);
    	// t.show();
    	
    }
    
    
    
    void addDescription(int ix, String title, String desc) {
    	ContentValues val = new ContentValues(2);
    	
    	val.put(proj[3], title);
    	val.put(proj[4], desc);
    	
    	ContentResolver cr = getContentResolver();
    	String sid; Uri u;
    	
    	// throws exception:
    	// Caused by: java.lang.UnsupportedOperationException: Unknown or unsupported URL: 
    	// content://media/external/images/media/com.slidedroid.Slideshow$ImgInfo@433e5e58
    	/*sid = String.valueOf(imgInfo[ix]);
    	u = Uri.withAppendedPath(Media.EXTERNAL_CONTENT_URI, sid );
    	sid=null;*/
    	
    	// this is like in Sql: WHERE sid
    	// WHERE "_id=5"
    	// throws
    	// 03-19 06:36:15.975: ERROR/AndroidRuntime(1811): Caused by: java.lang.UnsupportedOperationException: 
    	// Unknown or unsupported URL: content://media/external/images/media
    	u = Media.EXTERNAL_CONTENT_URI;
    	sid = proj[0] + "=" + imgInfo[ix].id;   
    	
    	cr.update(u, val, sid, null);
    	
    }
    
    void addDescription2(int ix, String title, String desc) {
    	
    	ContentValues values = new ContentValues(3);
    	values.put(Media.DISPLAY_NAME, title);
    	values.put(Media.DESCRIPTION, desc);
    	values.put(Media.MIME_TYPE, "image/jpeg");

    	// Add a new record without the bitmap, but with the values just set.
    	// insert() returns the URI of the new record.
    	Uri uri = getContentResolver().insert(Media.EXTERNAL_CONTENT_URI, values);

    	// Now get a handle to the file for that record, and save the data into it.
    	// Here, sourceBitmap is a Bitmap object representing the file to save to the database.
    	Bitmap sourceBitmap = BitmapFactory.decodeFile(imgInfo[ix].uri);
    	try {
    	    OutputStream outStream = getContentResolver().openOutputStream(uri);
    	    sourceBitmap.compress(Bitmap.CompressFormat.JPEG, 50, outStream);
    	    outStream.close();
    	    Log.d(TAG, "Wrote " + title +", " + desc);
    	} catch (Exception e) {
    	    Log.e(TAG, "exception while writing image", e);
    	}
    }
    
    
}