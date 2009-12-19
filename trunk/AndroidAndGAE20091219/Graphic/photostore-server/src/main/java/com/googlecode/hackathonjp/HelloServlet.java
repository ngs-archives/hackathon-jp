package com.googlecode.hackathonjp;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.velocity.VelocityContext;

/**
 * 動作確認用のサーブレット。
 * @author shin1ogawa
 */
@SuppressWarnings("serial")
public class HelloServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) {
		VelocityContext context = new VelocityContext();
		context.put("message", "Hello, world");
		context.put("timestamp", getTimestamp());
		VelocityUtil.merge(context, "/template/hello.vm", response);
	}

	private String getTimestamp() {
		SimpleDateFormat df = new SimpleDateFormat();
		df.setTimeZone(TimeZone.getTimeZone("GMT+9"));
		return df.format(new Date(System.currentTimeMillis()));
	}
}
