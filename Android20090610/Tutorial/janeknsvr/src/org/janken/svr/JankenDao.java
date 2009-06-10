package org.janken.svr;

import java.util.List;

import javax.jdo.PersistenceManager;

public class JankenDao {
	
	// ref: http://codezine.jp/article/detail/3904/?p=2

	private static long sid = 0;
	public static long getSeq(){
		return sid++;
	}

	public void saveData(JankenData idata){
		assert(idata != null);

		PersistenceManager pm = PMF.get().getPersistenceManager();  // （3）
		try {
		    pm.makePersistent(idata);  // （4）
		} finally {
		    pm.close();  // （5）
		}
	}
	
	@SuppressWarnings("unchecked")
	public List<JankenData> findAllData(){

		PersistenceManager pm = PMF.get().getPersistenceManager();  // （3）
		String query = "select from " + JankenData.class.getName();  // （2）
		List<JankenData> list = (List<JankenData>) pm.newQuery(query).execute();  // （3）
		return list;
	}
	
	@SuppressWarnings("unchecked")
	public List<JankenData> findByNickname(String inickname){
		
		PersistenceManager pm = PMF.get().getPersistenceManager();  // （3）
		String query = "select from " + JankenData.class.getName() + "where nickname == '"+inickname+"'";
		List<JankenData> list = (List<JankenData>) pm.newQuery(query).execute();  // （3）
		return list;
	}
	
	public void deleteData(List<JankenData> ilist){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		pm.deletePersistentAll(ilist);
	}
	
	public long deleteAllData(){

		PersistenceManager pm = PMF.get().getPersistenceManager();  // （3）
		String query = "select from " + JankenData.class.getName();  // （2）
		final long deleted = pm.newQuery(query).deletePersistentAll();
		return deleted;
	}
}
