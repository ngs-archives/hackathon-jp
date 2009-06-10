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
    private JankenState result;
    @Persistent
    private long startMsec;

    public JankenData(long iid, String inickname) {
    	this.id = iid;
        this.nickname = inickname;
        this.result = JankenState.N;
        this.startMsec = System.currentTimeMillis();
    }

}
