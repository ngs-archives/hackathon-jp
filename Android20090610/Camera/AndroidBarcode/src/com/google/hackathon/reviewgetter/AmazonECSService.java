package com.google.hackathon.reviewgetter;

import java.io.IOException;
import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;


import net.it4myself.util.RestfulClient;


public class AmazonECSService {
	public static final String ECS_SERVICE_NAME  = "AWSECommerceService";
	public static final String ITEMLOOKUP_OPERATION = "ItemLookup";
	public static final String DEFAULT_RESGROUP = "Small,Reviews,OfferFull,SalesRank";
	public static final String CONTENT_TYPE = "text/html";
	public static final String BOOKS_SEARCHINDEX = "Books";
	public static final String ISBN_IDTYPE = "ISBN";

	private String version = null;
    private String accessKeyId = null;
    private String secretAccessKey = null;

    public AmazonECSService(String version, String accessKeyId, String secretAccessKey){
    	this.version = version;
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
    }

    public String search(String _version, String _operation, String _resGroup
            , String _itemId, String _contentType, String _searchString, String _idString)
    	throws ParserConfigurationException,SAXException, IOException{
    	AmazonECSObject obj = new AmazonECSObject(_version, this.accessKeyId, null, _operation, _resGroup
            , _itemId, _contentType, _searchString, _idString);
    	SignedRequestsHelper helper = new SignedRequestsHelper(this.accessKeyId, this.secretAccessKey);
    	String reqStr = helper.sign(obj.generateRequestMap());
        return RestfulClient.Get(reqStr, null);
    }

    public String searchByISBN(String isbn) throws ParserConfigurationException,SAXException, IOException{
    	AmazonECSObject obj = new AmazonECSObject(this.version, this.accessKeyId, ECS_SERVICE_NAME,ITEMLOOKUP_OPERATION, DEFAULT_RESGROUP
                ,isbn, CONTENT_TYPE, BOOKS_SEARCHINDEX, ISBN_IDTYPE);
    	SignedRequestsHelper helper = new SignedRequestsHelper(this.accessKeyId, this.secretAccessKey);
    	String reqStr = helper.sign(obj.generateRequestMap());
    	return RestfulClient.Get(reqStr, null);
    }
}
