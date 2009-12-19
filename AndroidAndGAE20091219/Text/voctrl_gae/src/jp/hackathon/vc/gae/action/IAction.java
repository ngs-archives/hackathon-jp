package jp.hackathon.vc.gae.action;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface IAction {
	public void run(HttpServletRequest req, HttpServletResponse resp, Object data) throws IOException;

}
