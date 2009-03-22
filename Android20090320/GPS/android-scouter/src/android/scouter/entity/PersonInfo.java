package android.scouter.entity;

/**
 * 人物情報
 *
 * @since 2008/03/20
 * 
 */
public class PersonInfo {

	/**
	 * ID
	 */
	private String id;

	/**
	 * 名前
	 */
	private String name;

	/**
	 * 経度
	 */
	private String geo_longitude;

	/**
	 * 緯度
	 */
	private String geo_latitude;

	/**
	 * 写真
	 */
	private String picture;

	/**
	 * 戦闘力
	 */
	private String power;

	/**
	 * プロフィール
	 */
	private String profile;

	/**
	 * 変更日時
	 */
	private String modified;

	/**
	 * @param id the id to set
	 */
	public void setID(String id) {
		this.id = id;
	}

	/**
	 * @return the id
	 */
	public String getID() {
		return id;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		
		this.name = name;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param geo_longitude the geo_longitude to set
	 */
	public void setGeoLongitude(String geo_longitude) {
		this.geo_longitude = geo_longitude;
	}

	/**
	 * @return the geo_longitude
	 */
	public String getGeoLongitude() {
		return geo_longitude;
	}

	/**
	 * @param geo_latitude the geo_latitude to set
	 */
	public void setGeoLatitude(String geo_latitude) {
		this.geo_latitude = geo_latitude;
	}

	/**
	 * @return the geo_latitude
	 */
	public String getGeoLatitude() {
		return geo_latitude;
	}

	/**
	 * @param power the power to set
	 */
	public void setPower(String power) {
		this.power = power;
	}

	/**
	 * @param picture the picture to set
	 */
	public void setPicture(String picture) {
		this.picture = picture;
	}

	/**
	 * @return the picture
	 */
	public String getPicture() {
		return picture;
	}

	/**
	 * @return the power
	 */
	public String getPower() {
		return power;
	}

	/**
	 * @param profile the profile to set
	 */
	public void setProfile(String profile) {
		this.profile = profile;
	}

	/**
	 * @return the profile
	 */
	public String getProfile() {
		return profile;
	}

	/**
	 * @param modified the modified to set
	 */
	public void setModified(String modified) {
		this.modified = modified;
	}

	/**
	 * @return the modified
	 */
	public String getModified() {
		return modified;
	}

	/**
	 * コンストラクタ
	 */
	public PersonInfo() {
	}

}
