package jp.hackathon.vc.gae.action;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.hackathon.vc.gae.model.VoctrlModel;

public class OutputAction implements IAction {

	@Override
	public void run(HttpServletRequest req, HttpServletResponse resp, Object data) throws IOException {
		PersistenceManager pm = PMF.get().getPersistenceManager();
//		GoogleQuery gq = new GoogleQuery();
		try {
			String query = "select from " + VoctrlModel.class.getName();
			List<VoctrlModel> models = (List<VoctrlModel>) pm.newQuery(query).execute();
			
			PrintWriter writer = resp.getWriter();
			for (VoctrlModel voctrlModel : models) {
				writer.println(voctrlModel.getData());
//				gq.makeQuery(query, writer);
			}
			pm.deletePersistentAll(models);
		} catch (Exception e) {
			resp.getWriter().append("ERROR");
			e.printStackTrace();
		} finally {
			pm.close();
		}

	}
	
//	private void search(String query){
//		String key = "ABQIAAAAMI2qOraKf1AKK762okOfpxRdIXpbsmqJJwgH19Ff8xKqLPZM9RQ0S3RHR3OKrSkzL8FMvfV5DUfsiQ";
//		URL url = new URL("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=Paris%20Hilton");
//		URLConnection connection = url.openConnection();
//		connection.addRequestProperty("Referer", "http://voctrl.appspot.com");
//
//		String line;
//		StringBuilder builder = new StringBuilder();
//		BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//		while((line = reader.readLine()) != null) {
//		 builder.append(line);
//		}
//
//		JSONObject json = new JSONObject(builder.toString());
//
//		
//	}
	
	
	
	
	

}
