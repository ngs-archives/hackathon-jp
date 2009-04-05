package android.social;

import java.io.Serializable;
import java.util.List;

import org.opensocial.data.OpenSocialPerson;

@SuppressWarnings("serial")
public class FriendsHolder implements Serializable {
	
	private List<OpenSocialPerson> friends;
	
	public FriendsHolder(List<OpenSocialPerson> friends) {
		super();
		this.friends = friends;
	}
	
	public List<OpenSocialPerson> getFriends() {
		return friends;
	}

}
