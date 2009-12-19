
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
resp.setContentType("text/html");
resp.setCharacterEncoding("UTF-8");

Writer out = resp.getWriter();

out.write("<a href=\"/admin/view.jsp\">New Entry</a><br />");
out.write("<hr />");
out.write("<h1><a href=\"/\">Hello App Engine!</a></h1>");
out.write("<hr />");

PersistenceManager pm = PMF.get().getPersistenceManager();
Query query = pm.newQuery(Post.class);
List<Post> list = (List<Post>) query.execute();

SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy");
for (Post post : list) {
   String date = sdf.format(post.getDate());
   out.write(date + "<font size=5>" + post.getTitle() + "</font>");

   String linkEdit = "[<a href=\"/admin/edit?id=" + post.getId()
   + "\">ï“èW</a>]";
   out.write(linkEdit);

   out.write("<br />");
   out.write(post.getContent());
   out.write("<hr />");
}

    }

}

