package org.gtugs.codelab.appengine.blog;

import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.gtugs.codelab.appengine.blog.datastore.Post;

public class ShowListServlet extends HttpServlet {

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/xml");
		resp.setCharacterEncoding("UTF-8");

		Writer out = resp.getWriter();

		out.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");

		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(Post.class);
		List<Post> list = (List<Post>) query.execute();

		out.write("<list>");
		SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy");
		for (Post post : list) {
			out.write("<entry>");
			String date = sdf.format(post.getDate());
			out.write("<date>" + date + "</date>");
			out.write("<title>" + post.getTitle() + "</title>");
			out.write("<content>" + post.getContent() + "</content>");
			out.write("</entry>");
		}
		out.write("</list>");
	}

}
