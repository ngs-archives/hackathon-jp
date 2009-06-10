package org.janken;

import java.util.ArrayList;
import java.util.List;

public class Group {
	String groupName;
	ArrayList <User> userList;
	
	public void Group (String name){
		groupName = name;
	}
	
	public void addUser (String name){
		User newUser = new User (name);
		userList.add(newUser);
		
	}
	
	public boolean removeUser (String userName){
		int size = userList.size();
		for (int ii = 0; ii<size; ii++){
			User anyUser = userList.get(ii);
			if (userName.compareTo(anyUser.userName)==0){
				// have found the user
				userList.remove(ii);
				return true;
			}
		}
		// no such user
		return false;
	}
	
	public void onUserGiveHand (String userName,  String hand){
		int size = userList.size();
		for (int ii = 0; ii<size; ii++){
			User anyUser = userList.get(ii);
			if (userName.compareTo(anyUser.userName)==0){
				// have found the user
				anyUser.myHand = hand;
			}
		}
	}
	
	public boolean onJudge (){
		ArrayList <String> resultHandArray = null;
		
		String win,lost;
		
		int size = userList.size();
		for (int ii = 0; ii<size; ii++){
			User anyUser = userList.get(ii);
			String hand = anyUser.myHand;
			int resultSize = resultHandArray.size();
			if (resultSize < 0){
				resultHandArray.add(hand);
			}else{
				// check result list;
				for (int jj = 0; jj< resultSize; jj++){
					String tempHand = resultHandArray.get(jj);
					if (tempHand.compareTo(hand) != 0){
						resultHandArray.add(hand);
					}
				}
				resultSize = resultHandArray.size();
				if (resultSize > 3){
					// something wrong;
					return false;
				}
			}
			if (hand.compareTo("none")==0){
				// someone has not yet give a hand.
				return false;
			}
		}

		int resultSize = resultHandArray.size();
		if (resultSize == 1){
			for (int ii = 0; ii<size; ii++){
				User anyUser = userList.get(ii);
				anyUser.result = 0;
			}			
		}

		if (resultSize == 2){
			String result01 = resultHandArray.get (0);
			String result02 = resultHandArray.get(1);
			
			// todo
			if (result01.compareTo("go")== 0){
				if (result02.compareTo("choki")==0){
					win = "gu";
					lost = "choki";
				}else if (result02.compareTo("pa")==0){
					win = "pa";
					lost = "gu";
				}
			}
				
			for (int ii = 0; ii<size; ii++){
				User anyUser = userList.get(ii);
				anyUser.result = 0;
			}			
		}

		return false;
		
	}
}
