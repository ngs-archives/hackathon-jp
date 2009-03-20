package jp.co.haw.android.example.shake;

import android.net.Uri;
import android.provider.BaseColumns;

/**
 * Convenience definitions for NotePadProvider
 */
public final class Application {
    public static final String AUTHORITY = "jp.co.haw.android.provider.application";

    // This class cannot be instantiated
    private Application() {}
    
    /**
     * Notes table
     */
    public static final class Apps implements BaseColumns {
        // This class cannot be instantiated
        private Apps() {}

        /**
         * The content:// style URL for this table
         */
        public static final Uri CONTENT_URI = Uri.parse("content://" + AUTHORITY + "/apps");

        /**
         * The MIME type of {@link #CONTENT_URI} providing a directory of notes.
         */
        public static final String CONTENT_TYPE = "vnd.android.cursor.dir/vnd.haw.apps";

        /**
         * The MIME type of a {@link #CONTENT_URI} sub-directory of a single note.
         */
        public static final String CONTENT_ITEM_TYPE = "vnd.android.cursor.item/vnd.haw.apps";

        /**
         * The default sort order for this table
         */
        public static final String DEFAULT_SORT_ORDER = Apps.ACTION + " DESC";

        /**
         * The title of the note
         * <P>Type: TEXT</P>
         */
        public static final String CLASS = "class";

        /**
         * The note itself
         * <P>Type: INTEGER</P>
         */
        public static final String ACTION = "action";

    }
}
