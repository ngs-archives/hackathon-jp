package org.hackathon.ashiato;

import java.util.Date;

import org.slim3.datastore.Attribute;
import org.slim3.datastore.Model;

import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Key;

@Model
public class Loc {

    @Attribute(primaryKey = true)
    private Key key;

    private String email;

    private GeoPt point;

    private Date createdAt;

    public Key getKey() {
        return key;
    }

    public void setKey(Key key) {
        this.key = key;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public GeoPt getPoint() {
        return point;
    }

    public void setPoint(GeoPt point) {
        this.point = point;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}
