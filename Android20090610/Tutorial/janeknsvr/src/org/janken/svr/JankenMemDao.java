package org.janken.svr;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JankenMemDao implements JankenDao{
	
	private static Map<Long, JankenData> datamap = new HashMap<Long, JankenData>();
	
	public void saveData(JankenData idata){
		assert(idata != null);
		datamap.put(idata.getId(), idata);
	}
	
	public List<JankenData> findAllData(){
		List<JankenData> list = new ArrayList<JankenData>(datamap.values());
		return list;
	}
	
	public List<JankenData> findByNickname(String inickname){
		List<JankenData> lista = findAllData();
		List<JankenData> list = new ArrayList<JankenData>();
		for (JankenData j:lista){
			if (inickname.equals(j.getNickname())){
				list.add(j);
			}
		}
		return list;
	}
	
	public List<JankenData> findByState(JankenState itype, JankenState iresult) {
		List<JankenData> lista = findAllData();
		List<JankenData> list = new ArrayList<JankenData>();
		for (JankenData j:lista){
			if (itype != null && itype != j.getJtype()){
				continue;
			}
			if (iresult != null && iresult != j.getResult()){
				continue;
			}
			list.add(j);
		}
		return list;
	}

	public JankenData findById(Long iid){
		return datamap.get(iid);
	}

	public long findSize() {
		return datamap.size();
	}
	
	public void deleteData(List<JankenData> ilist){
		for (JankenData j:ilist){
			datamap.remove(j.getId());
		}
	}
	
	public long deleteAllData(){
		final long deleted = datamap.size();
		datamap.clear();
		return deleted;
	}
}
