package org.janken.svr;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.*;

@SuppressWarnings("serial")
public class JaneknsvrServlet extends HttpServlet {
	
	private JankenService jankenService = new JankenService();
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		final String cmdorg = req.getParameter("command");
		
		JankenCmd jc = null;
		try {
			jc = JankenCmd.valueOf(cmdorg.toUpperCase());
		}catch(IllegalArgumentException e){
			jc = JankenCmd.HELP;
		}catch(Exception e){
			jc = JankenCmd.HELP;
		}
		
		switch (jc){
		case LOGIN:
			doLogin(req, resp);
			break;
		case START:
			doLogin(req, resp);
			break;
		case RESULT:
			doLogin(req, resp);
			break;
		case JANKEN:
			doLogin(req, resp);
			break;
		case CANCEL:
			doLogin(req, resp);
			break;
		case HELP:
			default:
				doHelp(req, resp);
				break;
		}
		
	}
	
	private void doLogin(HttpServletRequest req, HttpServletResponse resp)
	throws IOException{
		final String nickname = req.getParameter("nickname");
		final long userid = jankenService.createUser(nickname);
		resp.setContentType("text/plain");
		resp.getWriter().println("userid=" + userid);
	}
	
	private void doHelp(HttpServletRequest req, HttpServletResponse resp)
	throws IOException{
		
		resp.setContentType("text/plain");
		resp.getWriter().println("command=[CMD]");
		resp.getWriter().println("&otherprm=[prm]....");
		resp.getWriter().print("   [CMD]:");
		
		for (JankenCmd e:JankenCmd.values()){
			resp.getWriter().print("" + e + ",");
		}
		
	}
	
}
