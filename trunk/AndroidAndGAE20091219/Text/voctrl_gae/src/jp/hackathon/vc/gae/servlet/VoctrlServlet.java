package jp.hackathon.vc.gae.servlet;
import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.hackathon.vc.gae.action.InputAction;
import jp.hackathon.vc.gae.action.OutputAction;


@SuppressWarnings("serial")
public class VoctrlServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(VoctrlServlet.class.getName());
	
	private InputAction inputAction = new InputAction();
	private OutputAction outputAction = new OutputAction();
	
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setCharacterEncoding("UTF-8");
		
		String path = req.getPathInfo().substring(1);
		if(path.startsWith("input/")){
			log.info("Starting input action");
			
			String query = path.split("/")[1];
			log.info("query = " + query);
			
			inputAction.run(req, resp, query);
		}else if(path.equals("output")){
			log.info("Starting output action");
			
			outputAction.run(req, resp, null);
		}
	}
}
