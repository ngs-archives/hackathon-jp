package org.janken.svr;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION) 
public class JankenData {

	
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
    @Persistent
    private String nickname;
    @Persistent
    private JankenState jtype;
    @Persistent
    private JankenState result;
    @Persistent
    private long createMsec;
    @Persistent
    private long startMsec;

    public JankenData(long iid, String inickname) {
    	this.id = iid;
        this.nickname = inickname;
        this.jtype = JankenState.N;
        this.result = JankenState.N;
        this.createMsec = System.currentTimeMillis();
    }
    
    public void startJanken(){
        this.jtype = JankenState.S;// G/C/P
        this.result = JankenState.S;// W/F/T
        this.startMsec = System.currentTimeMillis();
    }
    
    public void cancelJanken(){
        this.jtype = JankenState.N;// G/C/P
        this.result = JankenState.N;// W/F/T
        this.startMsec = 0;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public JankenState getResult() {
		return result;
	}

	public void setResult(JankenState result) {
		this.result = result;
	}

	public long getStartMsec() {
		return startMsec;
	}

	public void setStartMsec(long startMsec) {
		this.startMsec = startMsec;
	}

	public JankenState getJtype() {
		return jtype;
	}

	public void setJtype(JankenState jtype) {
		this.jtype = jtype;
	}

	public long getCreateMsec() {
		return createMsec;
	}

	public void setCreateMsec(long createMsec) {
		this.createMsec = createMsec;
	}

}
