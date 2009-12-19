package jp.hackathon.vc.gae.action;

import java.io.IOException;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.hackathon.vc.gae.model.VoctrlModel;

public class InputAction implements IAction {

	@Override
	public void run(HttpServletRequest req, HttpServletResponse resp, Object data) throws IOException {
		VoctrlModel model = new VoctrlModel();
		model.setData((String) data);

		PersistenceManager pm = PMF.get().getPersistenceManager();

		try {
			pm.makePersistent(model);

			// String query = "select from " + VoctrlModel.class.getName();
			// List<VoctrlModel> models = (List<VoctrlModel>)
			// pm.newQuery(query).execute();
			//
			// resp.setContentType("text/plain");
			//
			// for (VoctrlModel voctrlModel : models) {
			// PrintWriter writer = resp.getWriter();
			// writer.println(voctrlModel.getData());
			// }
			resp.getWriter().print("OK");
		} catch (Exception e) {
			resp.getWriter().print("Server error");
			e.printStackTrace();
		} finally {
			pm.close();
		}

	}

}
