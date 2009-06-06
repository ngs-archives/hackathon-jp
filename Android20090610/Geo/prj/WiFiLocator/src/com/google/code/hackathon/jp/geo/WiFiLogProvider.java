package com.google.code.hackathon.jp.geo;

import java.util.ArrayList;
import java.util.List;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.location.Location;
import android.net.wifi.ScanResult;
import android.provider.BaseColumns;
import android.util.Log;

/**
 * DB まわりの処理を行なう
 * 
 * @author ogura
 * 
 */
public class WiFiLogProvider {

	private static final String TAG = "DbHelper";
	private static final String DB_NAME = "wifi_log.db";
	private static final int DB_VERSION = 1;

	// table name, columns
	private static final String WIFI_LOG_TABLE = "wifi_log";
	private static final String TIME = "time";
	private static final String LOC_LATITUDE = "latitude";
	private static final String LOC_LONGITUDE = "longitude";
	private static final String LOC_ACCURACY = "accuracy";
	private static final String SR_BSSID = "bssid";
	private static final String SR_SSID = "ssid";
	private static final String SR_CAPABILITIES = "capabilities";
	private static final String SR_FREQUENCY = "frequency";
	private static final String SR_LEVEL = "level";

	private static final String NULL_VALUE = "NULL";

	private static final String AREA_QUERY_CONDITION = "( " + LOC_LATITUDE
			+ " BETWEEN ? AND ? ) AND ( " + LOC_LONGITUDE + " BETWEEN ? AND ? ) ";
	
	private static final String[] QUERY_COLUMNS = new String[] { TIME,
		LOC_LATITUDE, LOC_LONGITUDE, LOC_ACCURACY, SR_BSSID, SR_SSID,
		SR_CAPABILITIES, SR_FREQUENCY, SR_LEVEL };

	private static class DatabaseHelper extends SQLiteOpenHelper {

		public DatabaseHelper(Context context, String name,
				CursorFactory factory, int version) {
			super(context, name, factory, version);
			// TODO Auto-generated constructor stub
		}

		@Override
		public void onCreate(SQLiteDatabase db) {
			db.execSQL("CREATE TABLE " + WIFI_LOG_TABLE + " ( "
					+ BaseColumns._ID + " INTEGER PRIMARY KEY, " + TIME
					+ " INTEGER, " + LOC_LATITUDE + " REAL, " + LOC_LONGITUDE
					+ " REAL, " + LOC_ACCURACY + " REAL, " + SR_BSSID
					+ " TEXT, " + SR_SSID + " TEXT, " + SR_CAPABILITIES
					+ " TEXT, " + SR_FREQUENCY + " INTEGER, " + SR_LEVEL
					+ " INTEGER " + ");");
		}

		@Override
		public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
			// TODO Auto-generated method stub
			Log.w(TAG, "Upgrading database from version " + oldVersion + " to "
					+ newVersion + ", which will destroy all old data");
			db.execSQL("DROP TABLE IF EXISTS notes");
			onCreate(db);
		}

	}

	private DatabaseHelper mDbHelper;

	public WiFiLogProvider(Context context) {
		mDbHelper = new DatabaseHelper(context, DB_NAME, null, DB_VERSION);
	}

	/**
	 * save location, ScanResult to the database
	 * 
	 * @param location
	 * @param scanResult
	 */
	public void storeWiFiLog(Location location, ScanResult scanResult) {
		storeWiFiLog(System.currentTimeMillis(), location, scanResult);
	}

	/**
	 * @param time
	 * @param location
	 * @param scanResult
	 */
	public void storeWiFiLog(long time, Location location, ScanResult scanResult) {
		SQLiteDatabase db = mDbHelper.getWritableDatabase();
		ContentValues values = logToValues(time, location, scanResult);

		long rowId = db.insert(WIFI_LOG_TABLE, NULL_VALUE, values);
		Log.d(TAG, "rowId: " + rowId);

		db.close();
		// rowId should be greater than 0
		if (rowId <= 0)
			throw new SQLException("Failed to insert wifi log");
	}

	private ContentValues logToValues(long time, Location location,
			ScanResult scanResult) {
		ContentValues values = new ContentValues();

		values.put(TIME, time);
		values.put(LOC_LATITUDE, location.getLatitude());
		values.put(LOC_LONGITUDE, location.getLongitude());
		values.put(LOC_ACCURACY, location.getAccuracy());

		if (scanResult != null) {
			values.put(SR_BSSID, scanResult.BSSID);
			values.put(SR_SSID, scanResult.SSID);
			values.put(SR_CAPABILITIES, scanResult.capabilities);
			values.put(SR_FREQUENCY, scanResult.frequency);
			values.put(SR_LEVEL, scanResult.level);
		}

		return values;
	}

	/**
	 * extract wifilog in the specified area
	 * 
	 * @param latitudeNorth
	 * @param latitudeSouth
	 * @param longitudeEast
	 * @param longitudeWest
	 * @return
	 */
	public List<WiFiLog> getWiFiLog(double latitudeNorth, double latitudeSouth,
			double longitudeEast, double longitudeWest) {
		List<WiFiLog> result = new ArrayList<WiFiLog>();

		SQLiteDatabase db = mDbHelper.getReadableDatabase();
		Cursor cursor = db.query(true, WIFI_LOG_TABLE, QUERY_COLUMNS,//null, null, null, null, null, null);
				AREA_QUERY_CONDITION, new String[] {
						Double.toString(latitudeSouth),
						Double.toString(latitudeNorth),
						Double.toString(longitudeWest),
						Double.toString(longitudeEast) }, null, null, TIME,
				null);

		int numRows = cursor.getCount();
		Log.d(TAG, "size: " + numRows);

		cursor.moveToFirst();
		for (int i = 0; i < numRows; ++i) {
			long time = cursor.getLong(cursor.getColumnIndex(TIME));
			double latitude = cursor.getDouble(cursor.getColumnIndex(LOC_LATITUDE));
			double longitude = cursor.getDouble(cursor.getColumnIndex(LOC_LONGITUDE));
			
			//TODO other values...
			
			result.add(new WiFiLog(time, latitude, longitude));
			cursor.moveToNext();
		}
		db.close();

		return result;
	}
}
