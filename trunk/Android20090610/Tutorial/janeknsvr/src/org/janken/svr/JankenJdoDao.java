package org.janken.svr;

import java.util.List;

import javax.jdo.PersistenceManager;

public class JankenJdoDao implements JankenDao {
	
	// ref: http://codezine.jp/article/detail/3904/?p=2

	private static long sid = 0;
	public static long getSeq(){
		return sid++;
	}

	/* (非 Javadoc)
	 * @see org.janken.svr.JankenDao#saveData(org.janken.svr.JankenData)
	 */
	public void saveData(JankenData idata){
		assert(idata != null);

		PersistenceManager pm = PMF.get().getPersistenceManager();  // （3）
		try {
		    pm.makePersistent(idata);  // （4）
		} finally {
		    pm.close();  // （5）
		}
	}
	
	/* (非 Javadoc)
	 * @see org.janken.svr.JankenDao#findAllData()
	 */
	@SuppressWarnings("unchecked")
	public List<JankenData> findAllData(){

		PersistenceManager pm = PMF.get().getPersistenceManager();  // （3）
		String query = "select from " + JankenData.class.getName();  // （2）
		List<JankenData> list = (List<JankenData>) pm.newQuery(query).execute();  // （3）
		return list;
	}
	
	/* (非 Javadoc)
	 * @see org.janken.svr.JankenDao#findByNickname(java.lang.String)
	 */
	@SuppressWarnings("unchecked")
	public List<JankenData> findByNickname(String inickname){
		
		PersistenceManager pm = PMF.get().getPersistenceManager();  // （3）
		String query = "select from " + JankenData.class.getName() + "where nickname == '"+inickname+"'";
		List<JankenData> list = (List<JankenData>) pm.newQuery(query).execute();  // （3）
		return list;
	}
	
	public JankenData findById(Long iid){
		return null;
	}

	/* (非 Javadoc)
	 * @see org.janken.svr.JankenDao#deleteData(java.util.List)
	 */
	public void deleteData(List<JankenData> ilist){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		pm.deletePersistentAll(ilist);
	}
	
	/* (非 Javadoc)
	 * @see org.janken.svr.JankenDao#deleteAllData()
	 */
	public long deleteAllData(){

		PersistenceManager pm = PMF.get().getPersistenceManager();  // （3）
		String query = "select from " + JankenData.class.getName();  // （2）
		final long deleted = pm.newQuery(query).deletePersistentAll();
		return deleted;
	}

	public long findSize() {
		// TODO 自動生成されたメソッド・スタブ
		return 0;
	}

	public List<JankenData> findByState(JankenState type, JankenState result) {
		// TODO 自動生成されたメソッド・スタブ
		return null;
	}
}
