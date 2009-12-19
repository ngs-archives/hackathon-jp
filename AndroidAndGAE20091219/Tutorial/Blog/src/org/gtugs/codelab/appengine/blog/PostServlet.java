package org.gtugs.codelab.appengine.blog;

import java.io.IOException;
import java.util.Date;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.gtugs.codelab.appengine.blog.datastore.Post;

public class PostServlet extends HttpServlet {

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
   throws IOException {
req.setCharacterEncoding("UTF-8");

resp.setContentType("text/html");

String sid = req.getParameter("id");
String title = req.getParameter("title");
String content = req.getParameter("content");

Long id = null;
try {
   id = Long.parseLong(sid);
} catch (NumberFormatException e) {
   id = null;
}

PersistenceManager pm = PMF.get().getPersistenceManager();
Post post = null;
if (id == null || "".equals(id)) {
   post = new Post();
} else {
   post = pm.getObjectById(Post.class, id);
}
post.setTitle(title);
post.setContent(content);
post.setDate(new Date());
try {
   pm.makePersistent(post);
   resp
   .getWriter()
   .println(
   "post success!<br /><a href=\"JavaScript:history.back();\">return</a>");
} finally {
   pm.close();
}
    }

}



