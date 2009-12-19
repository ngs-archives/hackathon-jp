package com.googlecode.hackathonjp.servlet;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slim3.datastore.Datastore;

import appengine.util.MemcacheUtil;

import com.googlecode.hackathonjp.meta.PhotoMeta;
import com.googlecode.hackathonjp.model.Photo;

/**
 * アップロードされた画像の一覧を返す。
 * <p>キーとファイル名をタブ文字で区切った画像情報を、画像の数だけ改行区切りのtext/plainで返す。</p>
 * @author shin1ogawa
 */
@SuppressWarnings("serial")
public class List extends HttpServlet {

	static final String MEMCACHE_KEY = "list";


	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		resp.setCharacterEncoding("utf-8");
		@SuppressWarnings("unchecked")
		java.util.List<Photo> list = (java.util.List<Photo>) MemcacheUtil.get(MEMCACHE_KEY);
		if (list == null) {
			list = Datastore.query(PhotoMeta.get()).sort(PhotoMeta.get().createdAt.desc).asList();
			MemcacheUtil.put(MEMCACHE_KEY, list);
		}
		for (Photo photo : list) {
			String keyString = Datastore.keyToString(photo.getKey());
			resp.getWriter().println(keyString + "\t" + photo.getFilename());
		}
		resp.flushBuffer();
	}
}
