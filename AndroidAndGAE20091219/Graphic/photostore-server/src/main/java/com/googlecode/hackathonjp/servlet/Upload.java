package com.googlecode.hackathonjp.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.velocity.VelocityContext;
import org.slim3.datastore.Datastore;

import appengine.util.MemcacheUtil;

import com.google.appengine.api.datastore.KeyFactory;
import com.googlecode.hackathonjp.VelocityUtil;
import com.googlecode.hackathonjp.model.Photo;

/**
 * アップロードされたファイルを保存するサーブレット。
 * <dl>
 * <dt>POST</dt>
 * <dd>{@link Photo}の保存を行う。</dd>
 * <dt>GET</dt>
 * <dd>アップロード用のHtmlを返す</dd>
 * </dl>
 * @author shin1ogawa
 */
@SuppressWarnings("serial")
public class Upload extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/html");
		resp.setCharacterEncoding("utf-8");
		VelocityContext context = new VelocityContext();
		VelocityUtil.merge(context, "/template/upload.html", resp);
		resp.flushBuffer();
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String raw = req.getHeader("X-RAW");
		if (StringUtils.isNotEmpty(raw)) {
			Photo photo = raw(req, resp);
			resp.setContentType("text/plain");
			resp.setCharacterEncoding("utf-8");
			resp.getWriter().println("key=" + KeyFactory.keyToString(photo.getKey()));
			resp.flushBuffer();
			// Memcacheに搭載された画像の一覧を削除する
			MemcacheUtil.delete(List.MEMCACHE_KEY);
			return;
		}

		ServletFileUpload fileUpload = new ServletFileUpload();

		try {
			FileItemIterator itemIterator = fileUpload.getItemIterator(req);
			while (itemIterator.hasNext()) {
				FileItemStream next = itemIterator.next();
				InputStream inputStream = next.openStream();
				byte[] bytes = IOUtils.toByteArray(inputStream);
				Photo photo = putPhoto(next, bytes);
				resp.setContentType("text/plain");
				resp.setCharacterEncoding("utf-8");
				resp.getWriter().println("key=" + KeyFactory.keyToString(photo.getKey()));
				resp.flushBuffer();
				// Memcacheに搭載された画像の一覧を削除する
				MemcacheUtil.delete(List.MEMCACHE_KEY);
				break;
			}
		} catch (FileUploadException e) {
			resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * バイナリだけを送ってくる場合の処理。
	 * @param req
	 * @param resp
	 * @return 保存した{@link Photo}
	 * @throws IOException
	 */
	private Photo raw(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		byte[] bytes = IOUtils.toByteArray(req.getInputStream());
		Photo photo = new Photo();
		photo.setKey(Datastore.allocateId(Photo.class));
		photo.setImage(bytes);
		photo.setFilename(String.valueOf(System.currentTimeMillis()));
		photo.setCreatedAt(new Date(System.currentTimeMillis()));
		Datastore.put(photo);
		return photo;
	}

	private Photo putPhoto(FileItemStream next, byte[] bytes) {
		Photo photo = new Photo();
		photo.setKey(Datastore.allocateId(Photo.class));
		photo.setImage(bytes);
		photo.setFilename(next.getName());
		photo.setCreatedAt(new Date(System.currentTimeMillis()));
		Datastore.put(photo);
		return photo;
	}
}
