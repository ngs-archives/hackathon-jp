package com.googlecode.hackathonjp.servlet;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.velocity.VelocityContext;
import org.slim3.datastore.Datastore;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.datastore.KeyFactory;
import com.googlecode.hackathonjp.VelocityUtil;
import com.googlecode.hackathonjp.model.Photo;

/**
 * アップロードされたファイルを保存するサーブレット。
 * <dl>
 * <dt>POST</dt>
 * <dd>{@link BlobstoreService}を使って{@link Photo}の保存を行う。</dd>
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
		ServletFileUpload fileUpload = new ServletFileUpload();

		ByteArrayOutputStream image = new ByteArrayOutputStream();
		try {
			FileItemIterator itemIterator = fileUpload.getItemIterator(req);
			while (itemIterator.hasNext()) {
				FileItemStream next = itemIterator.next();
				InputStream inputStream = next.openStream();
				int len;
				int size = 0;
				byte[] buffer = new byte[1024];
				while ((len = inputStream.read(buffer)) != -1) {
					image.write(buffer, 0, len);
					size += len;
				}
				byte[] bytes = new byte[size];
				image.write(bytes);
				Photo photo = new Photo();
				photo.setKey(Datastore.allocateId(Photo.class));
				photo.setImage(bytes);
				photo.setFilename(next.getName());
				Datastore.put(photo);
				resp.setContentType("text/plain");
				resp.setCharacterEncoding("utf-8");
				resp.getWriter().println("key=" + KeyFactory.keyToString(photo.getKey()));
				resp.flushBuffer();
				break;
			}
		} catch (FileUploadException e) {
			resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}
}
