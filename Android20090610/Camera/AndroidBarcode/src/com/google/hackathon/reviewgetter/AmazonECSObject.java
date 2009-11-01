package com.google.hackathon.reviewgetter;

import java.util.HashMap;
import java.util.Map;

public class AmazonECSObject {
	private static final String ECS_SERVICE = "Service";
	private static final String ECS_VERSION = "Version";
	private static final String ECS_OPERATION = "Operation";
	private static final String ECS_RESGROUP = "ResponseGroup";
	private static final String ECS_ITEMID = "ItemId";
	private static final String ECS_CONTENTTYPE = "ContentType";
	private static final String ECS_IDTYPE = "IdType";
	private static final String ECS_SEARCHINDEX = "SearchIndex";

    private String version = null;
    private String accessKeyId = null;
    private String serviceName = null;
    private String operation = null;
    private String resGroup = null;
    private String itemId = null;
    private String contentType = null;
    private String searchIndex = null;
    private String idType = null;

    public AmazonECSObject(String _version, String _accessKeyId, String serviceName, String _operation, String _resGroup
            , String _itemId, String _contentType, String _searString, String _idString){
        version = _version;
        accessKeyId = _accessKeyId;
        this.setServiceName(serviceName);
        operation = _operation;
        resGroup = _resGroup;
        itemId = _itemId;
        contentType = _contentType;
        searchIndex = _searString;
        idType = _idString;
    }

	/**
	 * @param version セットする version
	 */
	public void setVersion(String version) {
		this.version = version;
	}
	/**
	 * @return version
	 */
	public String getVersion() {
		return version;
	}
	/**
	 * @param accessKeyId セットする accessKeyId
	 */
	public void setAccessKeyId(String accessKeyId) {
		this.accessKeyId = accessKeyId;
	}
	/**
	 * @return accessKeyId
	 */
	public String getAccessKeyId() {
		return accessKeyId;
	}
	/**
	 * @param operation セットする operation
	 */
	public void setOperation(String operation) {
		this.operation = operation;
	}
	/**
	 * @return operation
	 */
	public String getOperation() {
		return operation;
	}
	/**
	 * @param resGroup セットする resGroup
	 */
	public void setResGroup(String resGroup) {
		this.resGroup = resGroup;
	}
	/**
	 * @return resGroup
	 */
	public String getResGroup() {
		return resGroup;
	}
	/**
	 * @param itemId セットする itemId
	 */
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
	/**
	 * @return itemId
	 */
	public String getItemId() {
		return itemId;
	}
	/**
	 * @param contentType セットする contentType
	 */
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	/**
	 * @return contentType
	 */
	public String getContentType() {
		return contentType;
	}
	/**
	 * @param searchIndex セットする searchIndex
	 */
	public void setSearchIndex(String searchIndex) {
		this.searchIndex = searchIndex;
	}
	/**
	 * @return searchIndex
	 */
	public String getSearchIndex() {
		return searchIndex;
	}
	/**
	 * @param idType セットする idType
	 */
	public void setIdType(String idType) {
		this.idType = idType;
	}
	/**
	 * @return idType
	 */
	public String getIdType() {
		return idType;
	}

	public Map<String, String> generateRequestMap(){
		Map<String, String> map  = new HashMap<String, String>();

        if(version != null) map.put(ECS_VERSION, version);
        if(serviceName != null) map.put(ECS_SERVICE, serviceName);
        if(operation != null) map.put(ECS_OPERATION, operation);
        if(resGroup != null) map.put(ECS_RESGROUP, resGroup);
        if(itemId != null) map.put(ECS_ITEMID, itemId);
        if(contentType != null) map.put(ECS_CONTENTTYPE, contentType);
        if(searchIndex != null) map.put(ECS_SEARCHINDEX, searchIndex);
        if(idType != null) map.put(ECS_IDTYPE, idType);
        return map;
	}

	/**
	 * @param serviceName セットする serviceName
	 */
	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	/**
	 * @return serviceName
	 */
	public String getServiceName() {
		return serviceName;
	}
}
