package hacathon.android.util;

/**
 * ログ出力のラッパークラス。 <br />
 * とりあえず、System.outに出力している。
 */
public final class Log {
    public static final String TAG = "videx.foundation";

    private Log() {
    }

    public static void v(final String msg) {
        System.out.println(msg);
    }

    public static void v(final String msg, final Throwable tr) {
        System.out.println(msg);
        if (tr != null) {
            tr.printStackTrace();
        }
    }

    public static void v(final String format, final Object... args) {
        v(String.format(format, args));
    }

    public static void d(final String msg) {
        System.out.println(msg);
    }

    public static void d(final String format, final Object... args) {
        d(String.format(format, args));
    }

    public static void d(final String msg, final Throwable tr) {
        System.out.println(msg);
        if (tr != null) {
            tr.printStackTrace();
        }
    }

    public static void i(final String msg) {
        System.out.println(msg);
    }

    public static void i(final String format, final Object... args) {
        i(String.format(format, args));
    }

    public static void i(final String msg, final Throwable tr) {
        System.out.println(msg);
        if (tr != null) {
            tr.printStackTrace();
        }
    }

    public static void w(final String msg) {
        System.out.println(msg);
    }

    public static void w(final String format, final Object... args) {
        w(String.format(format, args));
    }

    public static void w(final String msg, final Throwable tr) {
        System.out.println(msg);
        if (tr != null) {
            tr.printStackTrace();
        }
    }

    public static boolean isLoggable(final int level) {
        return true;
    }

    public static void e(final String msg) {
        System.err.println(msg);
    }

    public static void e(final String msg, final Throwable tr) {
        System.err.println(msg);
        if (tr != null) {
            tr.printStackTrace();
        }
    }
}
