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
			doStart(req, resp);
			break;
		case JANKEN:
			doJanken(req, resp);
			break;
		case RESULT:
			doResult(req, resp);
			break;
		case CANCEL:
			doCancel(req, resp);
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
		if (userid >= 0){
			resp.getWriter().println("userid=" + userid);
		}else{
			resp.getWriter().println("userid=" + "DUPLICATE");
		}
	}
	
	private void doStart(HttpServletRequest req, HttpServletResponse resp)
	throws IOException{
		// Notify Member of Room before doJanken
		final String userid = req.getParameter("userid");
		final JankenData jd = jankenService.findData(Long.valueOf(userid));
		resp.setContentType("text/plain");
		if (jd == null){
			resp.getWriter().println("NOUSER");
		}else{
			if (jankenService.entry(jd)){
				resp.getWriter().println("accepted=" + jankenService.findEntrySize());
			}else{
				resp.getWriter().println("NOTACCEPTABLE:TRYLATER");
			}
		}
	}
	
	
	private void doJanken(HttpServletRequest req, HttpServletResponse resp)
	throws IOException{
		final String userid = req.getParameter("userid");
		final String janken = req.getParameter("janken");
		final JankenData jd = jankenService.findData(Long.valueOf(userid));
		resp.setContentType("text/plain");
		if (jd == null){
			resp.getWriter().println("NOUSER");
		}else{
			JankenState jtype = jd.getJtype();
			
			if (jtype != JankenState.S){
				// not started
				resp.getWriter().println("NOTSTARTED");
			}else{
				// set new type
				try{
					JankenState newtype = JankenState.valueOf(janken.toUpperCase());
					if (jankenService.finishJanken(jd, newtype)){
						final int entry = jankenService.findEntrySize();
						final int finished = jankenService.findFinishSize();
						resp.getWriter().println("accepted=" + finished +"/" + entry);
					}else{
						resp.getWriter().println("NOTACCEPTABLE:NOENTRY");
					}
				}catch(Exception e){
					resp.getWriter().println("ERROR"+e.getClass().getName());
				}
			}
		}
	}

	private void doResult(HttpServletRequest req, HttpServletResponse resp)
	throws IOException{
		final String userid = req.getParameter("userid");
		final JankenData jd = jankenService.findData(Long.valueOf(userid));
		resp.setContentType("text/plain");
		if (jd == null){
			resp.getWriter().println("NOUSER");
		}else{
			JankenState jtype = jd.getJtype();
			
			if (jtype == JankenState.N){
				// not started
				resp.getWriter().println("NOTSTARTED");
			}else if (jtype == JankenState.S){
				// not finished janken (maybe no-possibility to check result without finish)
				resp.getWriter().println("NOTFINISHEDJANKEN");
			}else{
				final List<JankenData> list = jankenService.findResultList();
				if (list == null){
					resp.getWriter().println("NOTFINISHED:JUDGE");
				}else{
					// get result
					final JankenState result = jd.getResult();
					resp.getWriter().println("result=" + result);
					for (JankenData j:list){
						resp.getWriter().println(j.getNickname() + "=" + j.getJtype());
					}
				}
			}
		}
	}

	private void doCancel(HttpServletRequest req, HttpServletResponse resp)
	throws IOException{
		final String userid = req.getParameter("userid");
		final JankenData jd = jankenService.findData(Long.valueOf(userid));
		resp.setContentType("text/plain");
		if (jd == null){
			resp.getWriter().println("NOUSER");
		}else{
			JankenState jtype = jd.getJtype();
			
			if (jtype == JankenState.N){
				// not started
				resp.getWriter().println("NOTSTARTED");
			}else{
				if (jankenService.cancelJanken(jd)){
					resp.getWriter().println("OK");
				}else{
					resp.getWriter().println("CANNOT:COMPLETED");
				}
			}
		}
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
