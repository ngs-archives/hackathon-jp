package com.googlecode.hackathonjp.model;

import java.io.Serializable;

import org.slim3.datastore.Attribute;
import org.slim3.datastore.Model;

import com.google.appengine.api.datastore.Key;

/**
 * 画像を保存するモデル。
 * @author shin1ogawa
 */
@Model
public class Photo implements Serializable {

	private static final long serialVersionUID = -8112786415978292190L;

	@Attribute(primaryKey = true)
	private Key key;

	private String filename;

	@Attribute(lob = true)
	private String description;

	@Attribute(lob = true)
	private byte[] image;

	private long schemaVersion = 1L;


	/**
	 * @return the key
	 * @category accessor
	 */
	public Key getKey() {
		return key;
	}

	/**
	 * @param key the key to set
	 * @category accessor
	 */
	public void setKey(Key key) {
		this.key = key;
	}

	/**
	 * @return the filename
	 * @category accessor
	 */
	public String getFilename() {
		return filename;
	}

	/**
	 * @param filename the filename to set
	 * @category accessor
	 */
	public void setFilename(String filename) {
		this.filename = filename;
	}

	/**
	 * @return the description
	 * @category accessor
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description the description to set
	 * @category accessor
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the image
	 * @category accessor
	 */
	public byte[] getImage() {
		return image;
	}

	/**
	 * @param image the image to set
	 * @category accessor
	 */
	public void setImage(byte[] image) {
		this.image = image;
	}

	/**
	 * @return the schemaVersion
	 * @category accessor
	 */
	public long getSchemaVersion() {
		return schemaVersion;
	}

	/**
	 * @param schemaVersion the schemaVersion to set
	 * @category accessor
	 */
	public void setSchemaVersion(long schemaVersion) {
		this.schemaVersion = schemaVersion;
	}
}
