package com.googlecode.hackathonjp.servlet;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slim3.datastore.Datastore;

import com.googlecode.hackathonjp.meta.PhotoMeta;
import com.googlecode.hackathonjp.model.Photo;

/**
 * アップロードされた画像の一覧を返す。
 * <p></p>
 * @author shin1ogawa
 */
@SuppressWarnings("serial")
public class List extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		resp.setCharacterEncoding("utf-8");
		java.util.List<Photo> list =
				Datastore.query(PhotoMeta.get()).sort(PhotoMeta.get().createdAt.desc).asList();
		for (Photo photo : list) {
			String keyString = Datastore.keyToString(photo.getKey());
			resp.getWriter().println(keyString + "\t" + photo.getFilename());
		}
		resp.flushBuffer();
	}
}
