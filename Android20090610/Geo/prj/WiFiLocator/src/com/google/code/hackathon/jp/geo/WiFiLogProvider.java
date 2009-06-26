package com.google.code.hackathon.jp.geo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.android.maps.GeoPoint;

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
/**
 * @author ogura
 * 
 */
public class WiFiLogProvider {

	private static final String TAG = "DbHelper";
	private static final String DB_NAME = "wifi_log.db";
	private static final int DB_VERSION = 1;

	// table name, columns
	public static final String WIFI_LOG_TABLE = "wifi_log";
	public static final String TIME = "time";
	public static final String LOC_LATITUDE = "latitude";
	public static final String LOC_LONGITUDE = "longitude";
	public static final String LOC_ACCURACY = "accuracy";
	public static final String SR_BSSID = "bssid";
	public static final String SR_SSID = "ssid";
	public static final String SR_CAPABILITIES = "capabilities";
	public static final String SR_FREQUENCY = "frequency";
	public static final String SR_LEVEL = "level";

	private static final String NULL_VALUE = "NULL";

	private static final String AREA_QUERY_CONDITION = "( " + LOC_LATITUDE
			+ " BETWEEN ? AND ? ) AND ( " + LOC_LONGITUDE
			+ " BETWEEN ? AND ? ) ";

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
	 * @param list
	 */
	public void storeWiFiLog(Location location, List<ScanResult> list) {
		storeWiFiLog(System.currentTimeMillis(), location, list);
	}

	/**
	 * @param time
	 * @param location
	 * @param list
	 */
	public void storeWiFiLog(long time, Location location, List<ScanResult> list) {
		List<ContentValues> valuesList = logToValues(time, location, list);

		storeWiFiLog(valuesList);

	}

	public void storeWiFiLog(List<ContentValues> valuesList) {
		SQLiteDatabase db = mDbHelper.getWritableDatabase();

		try {
			for (ContentValues values : valuesList) {
				long rowId = db.insert(WIFI_LOG_TABLE, NULL_VALUE, values);
				Log.d(TAG, "rowId: " + rowId);

				// rowId should be greater than 0
				if (rowId <= 0)
					throw new SQLException("Failed to insert wifi log");
			}
		} finally {
			db.close();
		}

	}

	private List<ContentValues> logToValues(long time, Location location,
			List<ScanResult> list) {
		List<ContentValues> result = new ArrayList<ContentValues>();

		for (ScanResult scanResult : list) {
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

			result.add(values);
		}

		return result;
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
		Cursor cursor = null;
		try {
			cursor = db.query(true, WIFI_LOG_TABLE,
					QUERY_COLUMNS,// null, null, null, null, null, null);
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
				double latitude = cursor.getDouble(cursor
						.getColumnIndex(LOC_LATITUDE));
				double longitude = cursor.getDouble(cursor
						.getColumnIndex(LOC_LONGITUDE));

				// TODO other values...

				result.add(new WiFiLog(time, latitude, longitude));
				cursor.moveToNext();
			}
		} finally {
			if (cursor != null && !cursor.isClosed())
				cursor.close();
			db.close();
		}

		return result;
	}
	
	public List<WiFiLog> getAllWiFiLog() {
		List<WiFiLog> result = new ArrayList<WiFiLog>();

		SQLiteDatabase db = mDbHelper.getReadableDatabase();
		Cursor cursor = null;
		try {
			cursor = db.query(true, WIFI_LOG_TABLE,
					QUERY_COLUMNS, null, null, null, null, null, null);

			int numRows = cursor.getCount();
			Log.d(TAG, "size: " + numRows);

			cursor.moveToFirst();
			for (int i = 0; i < numRows; ++i) {
				long time = cursor.getLong(cursor.getColumnIndex(TIME));
				double latitude = cursor.getDouble(cursor
						.getColumnIndex(LOC_LATITUDE));
				double longitude = cursor.getDouble(cursor
						.getColumnIndex(LOC_LONGITUDE));

				// TODO other values...

				result.add(new WiFiLog(time, latitude, longitude));
				cursor.moveToNext();
			}
		} finally {
			if (cursor != null && !cursor.isClosed())
				cursor.close();
			db.close();
		}

		return result;
	}

	/**
	 * 指定された領域の AP 情報を返す。領域の指定は、latitude * 10^6 で行なう
	 * 
	 * @param latitudeNorthE6
	 * @param latitudeSouthE6
	 * @param longitudeEastE6
	 * @param longitudeWestE6
	 * @return
	 */
	public List<AccessPointLocation> getAreaAccessPointLocationE6(
			int latitudeNorthE6, int latitudeSouthE6, int longitudeEastE6,
			int longitudeWestE6) {

		List<AccessPointLocation> result = new ArrayList<AccessPointLocation>();
		SQLiteDatabase db = mDbHelper.getReadableDatabase();
		Cursor cursor = null;
		try {
			cursor = db.query(true, WIFI_LOG_TABLE,
					QUERY_COLUMNS,// null, null, null, null, null, null);
					AREA_QUERY_CONDITION, new String[] {
							Double.toString(LocationHelper
									.toLocationValue(latitudeSouthE6)),
							Double.toString(LocationHelper
									.toLocationValue(latitudeNorthE6)),
							Double.toString(LocationHelper
									.toLocationValue(longitudeWestE6)),
							Double.toString(LocationHelper
									.toLocationValue(longitudeEastE6)) }, null,
					null, TIME, null);

			int numRows = cursor.getCount();
			Log.w(TAG, "hoge");
			Log.w(TAG, "getWiFiLog N:" + latitudeNorthE6 + ",S:"
					+ latitudeSouthE6 + ",E:" + longitudeEastE6 + ",W:"
					+ longitudeWestE6);
			Log.d(TAG, "size: " + numRows);

			cursor.moveToFirst();

			Map<String, Double> latitudeSum = new HashMap<String, Double>();
			Map<String, Double> longitudeSum = new HashMap<String, Double>();
			// TODO use level as ?
			Map<String, Integer> levelSum = new HashMap<String, Integer>();
			Map<String, Integer> levelMax = new HashMap<String, Integer>();

			for (int i = 0; i < numRows; ++i) {
				String ssid = cursor.getString(cursor.getColumnIndex(SR_SSID));
				double latitude = cursor.getDouble(cursor
						.getColumnIndex(LOC_LATITUDE));
				double longitude = cursor.getDouble(cursor
						.getColumnIndex(LOC_LONGITUDE));
				int level = cursor.getInt(cursor.getColumnIndex(SR_LEVEL));

				Log.d(TAG, "db num, lat: " + latitude + ", lng: " + longitude);

				if (!latitudeSum.containsKey(ssid)) {
					latitudeSum.put(ssid, Double.valueOf(0));
					longitudeSum.put(ssid, Double.valueOf(0));
					levelSum.put(ssid, Integer.valueOf(0));
					levelMax.put(ssid, Integer.valueOf(Integer.MIN_VALUE));
				}
				// TODO 負の値で、対数軸との噂なので、sum ではなく、count するのみ
				latitudeSum.put(ssid, latitudeSum.get(ssid) + (1 * latitude));
				longitudeSum
						.put(ssid, longitudeSum.get(ssid) + (1 * longitude));
				levelSum.put(ssid, levelSum.get(ssid) + 1);
				if (levelMax.get(ssid) < level)
					levelMax.put(ssid, level);

				cursor.moveToNext();
			}
			for (String ssid : latitudeSum.keySet()) {
				AccessPointLocation apLocation = new AccessPointLocation();
				int lat = LocationHelper.toGeoPointValue(latitudeSum.get(ssid)
						/ levelSum.get(ssid));
				int lng = LocationHelper.toGeoPointValue(longitudeSum.get(ssid)
						/ levelSum.get(ssid));
				apLocation.setGeoPoint(new GeoPoint(lat, lng));
				apLocation.setLevel(levelMax.get(ssid));
				apLocation.setSsid(ssid);
				result.add(apLocation);
			}

		} finally {
			if (cursor != null && !cursor.isClosed())
				cursor.close();
			db.close();
		}

		return result;
	}
}
