package org.janken.svr;

import java.util.ArrayList;
import java.util.List;

public class JankenService {
	
	public static final long LOGIN_TIMEOUT = 10 * 60 * 1000;
	public static final long JANKEN_TIMEOUT = 20 * 1000;
	public static final long ROOM_FULL = 50;
	public static final long CHK_PERIOD = 1 * 1000;
	
	private static long lastChecked = 0;
	
	private final JankenDao jankenDao = new JankenMemDao();
	private long entryTime = 0;
	private long finishTime = 0;
	private List<JankenData> entryList = new ArrayList<JankenData>();
	private List<JankenData> finishList = new ArrayList<JankenData>();
	
	public JankenService(){
	}
	
	private void checkState(){
		final long nowMsec = System.currentTimeMillis();
		if (nowMsec - lastChecked < CHK_PERIOD){
			return;
		}
		synchronized(JankenService.class){
			lastChecked = nowMsec;
			final List<JankenData> list = jankenDao.findAllData();
			if (list == null || list.size() == 0){
				return;
			}
			final List<JankenData> rmlist = new ArrayList<JankenData>();
			for (JankenData jd:list){
				if (nowMsec - jd.getCreateMsec() > LOGIN_TIMEOUT){
					rmlist.add(jd);
					continue;
				}
				if (jd.getJtype() == JankenState.S &&
						nowMsec - jd.getStartMsec() > JANKEN_TIMEOUT ){
					rmlist.add(jd);
					continue;
				}
			}
			if (rmlist.size() > 0){
				for (JankenData j:rmlist){
					entryList.remove(j);
				}
				jankenDao.deleteData(rmlist);
			}
			if (entryTime > 0 && nowMsec - entryTime > LOGIN_TIMEOUT){
				// expire entry
				entryTime = 0;
				finishTime = 0;
				entryList.clear();
			}
		}
	}
	
	public long createUser(String inickname){
		long userid = -1;
		synchronized(JankenService.class){
			checkState();
			final List<JankenData> list = jankenDao.findByNickname(inickname);
			if (list == null || list.size() == 0){
				userid = JankenJdoDao.getSeq();
				final JankenData jd = new JankenData(userid, inickname);
				jankenDao.saveData(jd);
			}
		}
		return userid;
	}
	
	public JankenData findData(Long iid){
		checkState();
		return jankenDao.findById(iid);
	}
	
	public boolean entry(JankenData jd){
		synchronized(JankenService.class){
			checkState();
			final long nowMsec = System.currentTimeMillis();
			if (entryTime == 0){
				// not started , do entry
				_clearEntry(nowMsec);
				_entry(jd);
				return true;
			}
			if (finishTime == 0){
				// started but not yet finished, try entry
				_entry(jd);
				return true;
			}
			if (nowMsec - finishTime > JANKEN_TIMEOUT){
				// restarting, do entry
				_clearEntry(nowMsec);
				_entry(jd);
				return true;
			}
			return false;
		}
	}
	
	private void _clearEntry(long nowMsec){
		entryTime = nowMsec;
		finishTime = 0;//reset
		entryList.clear();
		finishList.clear();
	}
	
	private void _entry(JankenData jd){
		jd.startJanken();
		entryList.add(jd);
	}
	
	public boolean finishJanken(JankenData jd, JankenState jtype){
		synchronized(JankenService.class){
			checkState();
			if (entryList.contains(jd)){
				jd.setJtype(jtype);
				finishList.add(jd);
				if (entryList.size() == finishList.size()){
					_doFinish();
					finishTime = System.currentTimeMillis();
				}
				return true;
			}else{
				// not attendant or expired
				return false;
			}
		}
	}
	
	private void _doFinish(){
		// judge
	}
	
	public boolean isJudged(){
		return (finishTime > 0);
	}
	
	public List<JankenData> findResultList(){
		if (isJudged()){
			return finishList;
		}else{
			return null;
		}
	}

	public boolean cancelJanken(JankenData jd){
		synchronized(JankenService.class){
			checkState();
			if (finishList.contains(jd) && isJudged()){
				// already judged, cannot cancel
				return false;
			}
			jd.cancelJanken();
			if (entryList.remove(jd)){
				finishList.remove(jd);
				if (entryList.size() == finishList.size()){
					_doFinish();
					finishTime = System.currentTimeMillis();
				}
				return true;
			}else{
				// not attendant or expired
				return false;
			}
		}
	}
	
	public long findSize() {
		return jankenDao.findSize();
	}
	
	public int findEntrySize(){
		return entryList.size();
	}
	
	public int findFinishSize(){
		return finishList.size();
	}
	
	public long findSizeByState(JankenState itype, JankenState iresult) {
		final List<JankenData> list = jankenDao.findByState(itype, iresult);
		if (list == null){
			return -1;
		}else{
			return list.size();
		}
	}
}