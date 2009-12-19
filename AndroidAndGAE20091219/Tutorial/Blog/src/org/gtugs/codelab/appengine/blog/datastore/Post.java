package org.gtugs.codelab.appengine.blog.datastore;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

//
//  Insert your code
//Å@


@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Post {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;

	@Persistent
    private Date date;
	@Persistent
    private String title;
	@Persistent
    private String content;

    public Post() {

    }
    

    
    public Date getDate() {
return date;
    }

    public void setDate(Date date) {
this.date = date;
    }

    public String getTitle() {
return title;
    }

    public void setTitle(String title) {
this.title = title;
    }

    public void setContent(String content) {
this.content = content;
    }



	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}



	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}



	/**
	 * @return the content
	 */
	public String getContent() {
		return content;
	}

}

