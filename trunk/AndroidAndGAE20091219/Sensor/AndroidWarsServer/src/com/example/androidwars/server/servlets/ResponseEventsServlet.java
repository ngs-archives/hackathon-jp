package com.example.androidwars.server.servlets;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.arnx.jsonic.JSON;

import com.example.androidwars.server.datastore.DataAccess;

@SuppressWarnings("serial")
public class ResponseEventsServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(ResponseEventsServlet.class.getName());
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		String versionString = req.getParameter("version");
		Long version = -1l;
		try {
			version = Long.parseLong(versionString);
		} catch(NumberFormatException e) {
			e.printStackTrace();
		}
		
        log.info(version + "");
        List<Map<String, Object>> events = DataAccess.loadEvents(version);
        String eventsString = JSON.encode(events);
        
		resp.setContentType("text/plain");
		resp.getWriter().println(eventsString);
	}
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
	throws IOException {
		doGet(req, resp);
	}
}
