package jp.co.haw.android.example.shake;

import android.content.ContentProvider;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.content.UriMatcher;
import android.content.res.Resources;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteQueryBuilder;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;

import java.util.HashMap;

import jp.co.haw.android.example.shake.Application.Apps;

/**
 * Provides access to a database of Apps. Each note has a title, the note
 * itself, a creation date and a modified data.
 */
public class ApplicationProvider extends ContentProvider {

    private static final String TAG = "ApplicationProvider";

    private static final String DATABASE_NAME = "application.db";
    private static final int DATABASE_VERSION = 1;
    private static final String APPS_TABLE_NAME = "apps";

    private static HashMap<String, String> sAppsProjectionMap;

    private static final int APPS = 1;
    private static final int APPS_ID = 2;

    private static final UriMatcher sUriMatcher;

    /**
     * This class helps open, create, and upgrade the database file.
     */
    private static class DatabaseHelper extends SQLiteOpenHelper {

        DatabaseHelper(Context context) {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            db.execSQL("CREATE TABLE " + APPS_TABLE_NAME + " ("
                    + Apps._ID + " INTEGER PRIMARY KEY,"
                    + Apps.CLASS + " TEXT,"
                    + Apps.ACTION + " INTEGER"
                    + ");");
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            Log.w(TAG, "Upgrading database from version " + oldVersion + " to "
                    + newVersion + ", which will destroy all old data");
            db.execSQL("DROP TABLE IF EXISTS " + APPS_TABLE_NAME);
            onCreate(db);
        }
    }

    private DatabaseHelper mOpenHelper;

    @Override
    public boolean onCreate() {
        mOpenHelper = new DatabaseHelper(getContext());
        return true;
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs,
            String sortOrder) {
        SQLiteQueryBuilder qb = new SQLiteQueryBuilder();

        switch (sUriMatcher.match(uri)) {
        case APPS:
            qb.setTables(APPS_TABLE_NAME);
            qb.setProjectionMap(sAppsProjectionMap);
            break;

        case APPS_ID:
            qb.setTables(APPS_TABLE_NAME);
            qb.setProjectionMap(sAppsProjectionMap);
            qb.appendWhere(Apps._ID + "=" + uri.getPathSegments().get(1));
            break;

        default:
            throw new IllegalArgumentException("Unknown URI " + uri);
        }

        // If no sort order is specified use the default
        String orderBy;
        if (TextUtils.isEmpty(sortOrder)) {
            orderBy = Apps.DEFAULT_SORT_ORDER;
        } else {
            orderBy = sortOrder;
        }

        // Get the database and run the query
        SQLiteDatabase db = mOpenHelper.getReadableDatabase();
        Cursor c = qb.query(db, projection, selection, selectionArgs, null, null, orderBy);

        // Tell the cursor what uri to watch, so it knows when its source data changes
        c.setNotificationUri(getContext().getContentResolver(), uri);
        return c;
    }

    @Override
    public String getType(Uri uri) {
        switch (sUriMatcher.match(uri)) {
        case APPS:
            return Apps.CONTENT_TYPE;

        case APPS_ID:
            return Apps.CONTENT_ITEM_TYPE;

        default:
            throw new IllegalArgumentException("Unknown URI " + uri);
        }
    }

    @Override
    public Uri insert(Uri uri, ContentValues initialValues) {
        // Validate the requested uri
        if (sUriMatcher.match(uri) != APPS) {
            throw new IllegalArgumentException("Unknown URI " + uri);
        }

        ContentValues values;
        if (initialValues != null) {
            values = new ContentValues(initialValues);
        } else {
            values = new ContentValues();
        }

        // Make sure that the fields are all set
        if (values.containsKey(Apps.CLASS) == false || values.containsKey(Apps.ACTION) == false) {
        	throw new SQLException("Failed to insert row into " + uri);
        }

        SQLiteDatabase db = mOpenHelper.getWritableDatabase();
        long rowId = db.insert(APPS_TABLE_NAME, Apps.CLASS, values);
        if (rowId > 0) {
            Uri noteUri = ContentUris.withAppendedId(Apps.CONTENT_URI, rowId);
            getContext().getContentResolver().notifyChange(noteUri, null);
            return noteUri;
        }

        throw new SQLException("Failed to insert row into " + uri);
    }

    @Override
    public int delete(Uri uri, String where, String[] whereArgs) {
        SQLiteDatabase db = mOpenHelper.getWritableDatabase();
        int count;
        switch (sUriMatcher.match(uri)) {
        case APPS:
            count = db.delete(APPS_TABLE_NAME, where, whereArgs);
            break;

        case APPS_ID:
            String noteId = uri.getPathSegments().get(1);
            count = db.delete(APPS_TABLE_NAME, Apps._ID + "=" + noteId
                    + (!TextUtils.isEmpty(where) ? " AND (" + where + ')' : ""), whereArgs);
            break;

        default:
            throw new IllegalArgumentException("Unknown URI " + uri);
        }

        getContext().getContentResolver().notifyChange(uri, null);
        return count;
    }

    @Override
    public int update(Uri uri, ContentValues values, String where, String[] whereArgs) {
        SQLiteDatabase db = mOpenHelper.getWritableDatabase();
        int count;
        switch (sUriMatcher.match(uri)) {
        case APPS:
            count = db.update(APPS_TABLE_NAME, values, where, whereArgs);
            break;

        case APPS_ID:
            String noteId = uri.getPathSegments().get(1);
            count = db.update(APPS_TABLE_NAME, values, Apps._ID + "=" + noteId
                    + (!TextUtils.isEmpty(where) ? " AND (" + where + ')' : ""), whereArgs);
            break;

        default:
            throw new IllegalArgumentException("Unknown URI " + uri);
        }

        getContext().getContentResolver().notifyChange(uri, null);
        return count;
    }

    static {
        sUriMatcher = new UriMatcher(UriMatcher.NO_MATCH);
        sUriMatcher.addURI(Application.AUTHORITY, "apps", APPS);
        sUriMatcher.addURI(Application.AUTHORITY, "apps/#", APPS_ID);

        sAppsProjectionMap = new HashMap<String, String>();
        sAppsProjectionMap.put(Apps._ID, Apps._ID);
        sAppsProjectionMap.put(Apps.CLASS, Apps.CLASS);
        sAppsProjectionMap.put(Apps.ACTION, Apps.ACTION);

    }
}
