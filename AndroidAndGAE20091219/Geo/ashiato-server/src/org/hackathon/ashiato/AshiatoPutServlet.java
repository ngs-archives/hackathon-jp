package org.hackathon.ashiato;

import java.io.IOException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slim3.datastore.Datastore;

import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Transaction;

public class AshiatoPutServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        final String email = req.getParameter("email").toLowerCase().trim();
        final String lng = req.getParameter("lng");
        final String lat = req.getParameter("lat");

        final Loc loc = new Loc();
        loc.setEmail(email);
        loc.setPoint(new GeoPt(Float.parseFloat(lat), Float.parseFloat(lng)));
        loc.setCreatedAt(new Date());

        Transaction tx = Datastore.beginTransaction();
        Datastore.put(loc);
        Datastore.commit(tx);

        res.setContentType("text/plain; charset=UTF-8");
        res.getWriter().print("OK");
    }
}
