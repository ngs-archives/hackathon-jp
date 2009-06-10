package org.janken.svr;

import java.util.List;

public class JankenService {
	
	private JankenDao jankenDao = new JankenDao();
	
	public long createUser(String inickname){
		long userid = -1;
		synchronized(JankenService.class){
			final List<JankenData> list = jankenDao.findByNickname(inickname);
			if (list == null || list.size() == 0){
				userid = JankenDao.getSeq();
				final JankenData jd = new JankenData(userid, inickname);
				jankenDao.saveData(jd);
			}
		}
		return userid;
	}

}
