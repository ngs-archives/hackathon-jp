package com.google.hackathon.reviewgetter;

import java.io.IOException;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import net.it4myself.util.RestfulClient;

import android.os.ParcelFormatException;

import com.google.zxing.client.android.AndroidHttpClient;

public class AmazonRequester {


    private static final String ECS_ROOT = "http://webservices.amazon.co.jp/onca/xml?" +
    		"Service=AWSECommerceService";
    private static final String ECS_VERSION = "&Version=";
    private static final String ECS_ACCESSKEYID = "&AWSAccessKeyId=";
    private static final String ECS_OPERATION = "&Operation=";
    private static final String ECS_RESGROUP = "&ResponseGroup=";
    private static final String ECS_ITEMID = "&itemId=";
    private static final String ECS_CONTENTTYPE = "&ContentType=";
        
    private String requestStr = null;
    private String version = null;
    private String accessKeyId = null;
    private String operation = null;
    private String resGroup = null;
    private String itemId = null;
    private String contentType = null;
    
    private DocumentBuilderFactory factory;
    private DocumentBuilder builder;
    
    public AmazonRequester(String _version, String _accessKeyId, String _operation, String _resGroup
            , String _itemId, String _contentType){
        version = _version;
        accessKeyId = _accessKeyId;
        operation = _operation;
        resGroup = _resGroup;
        itemId = _itemId;
        contentType = _contentType;
    }
    
  
    public Document searchByISBN(String ISBN) throws ParserConfigurationException, 
        SAXException, IOException{
        itemId = ISBN;
        generateRequestStr();
        factory = DocumentBuilderFactory.newInstance();
        builder = factory.newDocumentBuilder();
        return RestfulClient.Get(requestStr, null, builder);
    }

    public void generateRequestStr(){
        requestStr = ECS_ROOT;
        requestStr += (version == null)? "" : ECS_VERSION.concat(version);
        requestStr += (accessKeyId == null)? "" : ECS_ACCESSKEYID.concat(accessKeyId);
        requestStr += (operation == null)? "" : ECS_OPERATION.concat(operation);
        requestStr += (resGroup == null)? "" : ECS_RESGROUP.concat(resGroup);
        requestStr += (itemId == null)? "" : ECS_ITEMID.concat(itemId);
        requestStr += (contentType == null)? "" : ECS_CONTENTTYPE.concat(contentType);
        
    }


    public String getVersion() {
        return version;
    }



    public void setVersion(String version) {
        this.version = version;
    }



    public String getAccessKeyId() {
        return accessKeyId;
    }



    public void setAccessKeyId(String accessKeyId) {
        this.accessKeyId = accessKeyId;
    }



    public String getOperation() {
        return operation;
    }



    public void setOperation(String operation) {
        this.operation = operation;
    }



    public String getResGroup() {
        return resGroup;
    }



    public void setResGroup(String resGroup) {
        this.resGroup = resGroup;
    }



    public String getItemId() {
        return itemId;
    }



    public void setItemId(String itemId) {
        this.itemId = itemId;
    }



    public String getContentType() {
        return contentType;
    }



    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
}