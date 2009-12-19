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
import org.gtugs.codelab.appengine.blog.xml.Element;

public class ShowListServlet extends HttpServlet {

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/xml");
		resp.setCharacterEncoding("UTF-8");

		Writer out = resp.getWriter();

		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(Post.class);
		List<Post> list = (List<Post>) query.execute();

		Element root = new Element("list");
		SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy");
		for (Post post : list) {
			Element entry = new Element("entry");
			entry.add(new Element("id", post.getId().toString()));
			String date = sdf.format(post.getDate());
			entry.add(new Element("date", date));
			entry.add(new Element("title", post.getTitle()));
			entry.add(new Element("content", post.getContent()));
			root.add(entry);
		}
		out.write(root.toXML());
	}

}
