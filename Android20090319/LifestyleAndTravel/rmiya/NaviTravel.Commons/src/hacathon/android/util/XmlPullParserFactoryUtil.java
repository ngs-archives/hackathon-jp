package hacathon.android.util;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;
import org.xmlpull.v1.XmlSerializer;

public final class XmlPullParserFactoryUtil {

	private XmlPullParserFactoryUtil() {
	}

	public static XmlPullParser newPullParser() throws XmlPullParserException {
		return newInstance().newPullParser();
	}

	public static XmlSerializer newSerializer() throws XmlPullParserException {
		return newInstance().newSerializer();
	}

	private static XmlPullParserFactory mInstance;

	private static XmlPullParserFactory newInstance()
			throws XmlPullParserException {
		if (mInstance == null) {
			mInstance = XmlPullParserFactory.newInstance();
			mInstance.setNamespaceAware(true);
		}
		return mInstance;
	}
}
