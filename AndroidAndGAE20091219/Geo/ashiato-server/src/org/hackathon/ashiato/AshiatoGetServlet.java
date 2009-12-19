package org.hackathon.ashiato;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.arnx.jsonic.JSON;

import org.slim3.datastore.Datastore;

import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Transaction;

public class AshiatoGetServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        final String email = req.getParameter("email").toLowerCase();
        
        final LocMeta lm = new LocMeta();
        final List<Loc> locs = Datastore.query(lm).sort(lm.createdAt.desc).limit(1).asList();

        res.setContentType("text/plain; charset=UTF-8");
        res.getWriter().print(JSON.encode(locs));
    }
}
