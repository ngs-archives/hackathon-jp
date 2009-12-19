package jp.hackathon.vc.gae.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.hackathon.vc.gae.model.VoctrlModel;

public class OutputAction implements IAction {

	@Override
	public void run(HttpServletRequest req, HttpServletResponse resp, Object data) throws IOException {
		// resp.getWriter().println("output test");

		PersistenceManager pm = PMF.get().getPersistenceManager();

		try {

			String query = "select from " + VoctrlModel.class.getName();
			List<VoctrlModel> models = (List<VoctrlModel>) pm.newQuery(query).execute();

			//resp.setContentType("text/plain");
			resp.setCharacterEncoding("UTF-8");

			for (VoctrlModel voctrlModel : models) {
				PrintWriter writer = resp.getWriter();
				writer.println(voctrlModel.getData());
			}
//			pm.deletePersistentAll(models);
		} catch (Exception e) {
			resp.getWriter().append("ERROR");
			e.printStackTrace();
		} finally {
			pm.close();
		}

	}

}
