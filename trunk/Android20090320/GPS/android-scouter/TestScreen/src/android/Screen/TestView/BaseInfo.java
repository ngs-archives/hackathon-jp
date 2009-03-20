package android.Screen.TestView;
import java.io.IOException;
import java.io.InputStream;

public class BaseInfo {
	// URL由来のストリーム
	protected InputStream is;

	// ストリームを閉じる処理を共通メソッドとして定義
	public void close() {
		if (is != null) {
			try {
				is.close();
				is = null;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
