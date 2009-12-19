package org.gtugs.codelab.appengine.blog;

import java.io.IOException;
import java.text.SimpleDateFormat;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.gtugs.codelab.appengine.blog.datastore.Post;

public class ShowDetailServlet extends HttpServlet {
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/html");
		resp.getWriter().println("post");

	}
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/xml");
		
		String sid = req.getParameter("id");
		
		Long id = null;
		try {
		   id = Long.parseLong(sid);
		} catch (NumberFormatException e) {
		   // TODO
		   e.printStackTrace();
		}

//		String date = null;
//		String title = null;
//		String content = null;
//		

		PersistenceManager pm = PMF.get().getPersistenceManager();
		Post post = pm.getObjectById(Post.class, id);
		
		SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy");
		String date = sdf.format(post.getDate());
		String title = post.getTitle();
		String content = post.getContent();

		resp.getWriter().println("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
		resp.getWriter().println("<entry>");
		resp.getWriter().println("<id>"+ id + "</id>");
		resp.getWriter().println("<title>"+ title + "</title>");
		resp.getWriter().println("<content>"+ content + "</content>");
		resp.getWriter().println("<date>"+ date + "</date>");
		resp.getWriter().println("</entry>");
		

	}


}

