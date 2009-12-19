package org.hackathon.ashiato;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.arnx.jsonic.JSON;

import org.slim3.datastore.Datastore;

/**
 * A servlet that gets a location data for specified email.
 * 
 * @author kazunori_279
 */
public class AshiatoGetServlet extends HttpServlet {

    /**
     * Gets a location data for specified email.
     */
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        // get a param
        final String email = req.getParameter("email").toLowerCase().trim();
        int limit = 1;
        try {
            limit = Integer.parseInt(req.getParameter("limit"));            
        } catch (Exception e) {
            // do nothing
        }

        // find a location data for the email
        final LocMeta lm = new LocMeta();
        final List<Loc> locs =
            Datastore.query(lm).filter(lm.email.equal(email)).sort(
                lm.createdAt.desc).limit(limit).asList();

        // encode the location data into JSON and send it
        res.setContentType("text/plain; charset=UTF-8");
        res.getWriter().print(JSON.encode(locs));
    }
}
