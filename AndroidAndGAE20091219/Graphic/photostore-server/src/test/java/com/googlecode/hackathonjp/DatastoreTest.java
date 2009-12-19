package com.googlecode.hackathonjp;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.dev.LocalDatastoreService;
import com.google.appengine.tools.development.ApiProxyLocal;
import com.google.appengine.tools.development.ApiProxyLocalImpl;
import com.google.apphosting.api.ApiProxy;

import static org.hamcrest.Matchers.*;

import static org.junit.Assert.*;

/**
 * AppEngineのDatastoreを使ったテストの動作確認用テストケース。
 * @author shin1ogawa
 */
public class DatastoreTest {

	/**
	 * 保存操作。
	 * @throws EntityNotFoundException 
	 */
	@Test
	public void datastore() throws EntityNotFoundException {
		Entity entity = new Entity("SampleEntity");
		entity.setProperty("property1", 1L);
		entity.setProperty("property2", "string");
		DatastoreService service = DatastoreServiceFactory.getDatastoreService();
		Key key = service.put(entity);
		assertThat(key, is(not(nullValue())));
		assertThat(service.get(key), is(not(nullValue())));
	}

	/**
	 * AppEngineのテスト環境を開始する。
	 */
	@Before
	public void setUp() {
		ApiProxy.setEnvironmentForCurrentThread(new LocalEnvironment("com.googlecode.hackathonjp",
				"DatastoreTest"));
		ApiProxy.setDelegate(new ApiProxyLocalImpl(new File("target/DatastoreTest")) {
		});
		((ApiProxyLocalImpl) ApiProxy.getDelegate()).setProperty(
				LocalDatastoreService.NO_STORAGE_PROPERTY, Boolean.TRUE.toString());
	}

	/**
	 * AppEngineのテスト環境を終了する。
	 */
	@After
	public void tearDown() {
		if (ApiProxy.getDelegate() != null) {
			((ApiProxyLocal) ApiProxy.getDelegate()).stop();
			ApiProxy.setDelegate(null);
		}
		ApiProxy.setEnvironmentForCurrentThread(null);
	}


	static class LocalEnvironment implements ApiProxy.Environment {

		final String appId;

		final String versionId;


		/**
		 * the constructor.
		 * @param appId
		 * @param versionId
		 * @category constructor
		 */
		public LocalEnvironment(String appId, String versionId) {
			this.appId = appId;
			this.versionId = versionId;
		}

		/**
		 * sdkで起動した時に{@code ApiProxy.getCurrentEnvironment().getAppId()}で取得される値
		 */
		public String getAppId() {
			return appId;
		}

		/**
		 * sdkで起動した時に{@code ApiProxy.getCurrentEnvironment().getVersionId()}
		 * で取得される値
		 */
		public String getVersionId() {
			return versionId;
		}

		public String getRequestNamespace() {
			return "";
		}

		public String getAuthDomain() {
			return "gmail.com";
		}

		public boolean isLoggedIn() {
			return true;
		}

		public String getEmail() {
			return "servicetest@gmail.com";
		}

		public boolean isAdmin() {
			return true;
		}

		public Map<String, Object> getAttributes() {
			Map<String, Object> map = new HashMap<String, Object>();
			return map;
		}
	}

}
