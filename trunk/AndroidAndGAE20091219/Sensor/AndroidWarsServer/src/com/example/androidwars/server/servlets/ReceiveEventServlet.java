package com.example.androidwars.server.servlets;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.arnx.jsonic.JSON;
import net.arnx.jsonic.JSONException;

import com.example.androidwars.server.datastore.DataAccess;

@SuppressWarnings("serial")
public class ReceiveEventServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(ReceiveEventServlet.class.getName());
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String event = req.getParameter("event");
		Map<String, Object> eventMap = null;
		try {
			eventMap = (Map<String, Object>)JSON.decode(event);
        } catch(JSONException je) {
    		resp.setContentType("text/plain");
    		resp.getWriter().println("{result:\"ng\"}");
        }
        log.info(event);
        Long version = DataAccess.saveEvent(event, eventMap);
        log.info(String.valueOf(version));
		resp.setContentType("text/plain");
		resp.getWriter().println("{result:\"ok\"}");
	}
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
	throws IOException {
		doGet(req, resp);
	}
}
