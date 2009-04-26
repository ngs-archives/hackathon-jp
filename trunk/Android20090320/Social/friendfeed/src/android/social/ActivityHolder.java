package android.social;

import java.io.Serializable;

import org.opensocial.data.OpenSocialActivity;
import org.opensocial.data.OpenSocialPerson;

@SuppressWarnings("serial")
public class ActivityHolder implements Serializable {

	private OpenSocialPerson person;
	private OpenSocialActivity activity;
	
	public ActivityHolder(OpenSocialPerson person, OpenSocialActivity activity) {
		super();
		this.person = person;
		this.activity = activity;
	}
	
	public OpenSocialPerson getPerson() {
		return person;
	}
	
	public OpenSocialActivity getActivity() {
		return activity;
	}
	
}
