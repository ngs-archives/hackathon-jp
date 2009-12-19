package com.googlecode.hackathonjp.servlet;

import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slim3.datastore.Datastore;
import org.slim3.datastore.EntityNotFoundRuntimeException;

import com.google.appengine.api.datastore.Key;
import com.googlecode.hackathonjp.meta.PhotoMeta;
import com.googlecode.hackathonjp.model.Photo;

/**
 * 画像を返す。
 * @author shin1ogawa
 */
@SuppressWarnings("serial")
public class Download extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String keyString = req.getParameter("key");
		if (StringUtils.isEmpty(keyString)) {
			list(req, resp);
			return;
		}
		Key key = Datastore.stringToKey(keyString);
		try {
			Photo photo = Datastore.get(Photo.class, key);
			ServletOutputStream outputStream = resp.getOutputStream();
			byte[] bytes = photo.getImage();
			resp.setContentLength(bytes.length);
			outputStream.write(bytes);
			resp.flushBuffer();
		} catch (EntityNotFoundRuntimeException e) {
			resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
	}

	private void list(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		resp.setCharacterEncoding("utf-8");
		java.util.List<Photo> list =
				Datastore.query(PhotoMeta.get()).sort(PhotoMeta.get().createdAt.desc).asList();
		for (Photo photo : list) {
			String keyString = Datastore.keyToString(photo.getKey());
			resp.getWriter().println(
					"<a href=\"/download?key=" + keyString + "\">" + photo.getFilename() + "</a>");
		}
		resp.flushBuffer();
	}
}
