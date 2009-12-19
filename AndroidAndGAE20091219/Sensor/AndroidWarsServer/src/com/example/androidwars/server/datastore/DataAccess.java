package com.example.androidwars.server.datastore;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;

public class DataAccess {
	
	private static final String KIND_EVENT = "event";
	private static final String KIND_COUNTER = "counter";
	
	public static Long saveEvent(String entityString, Map<String, Object> entityMap) {
		Long version = DataAccess.getEventVersion();
    	DatastoreService service = DatastoreServiceFactory.getDatastoreService();
        //Key key = KeyFactory.createKey(KIND_EVENT, version);
        Entity entity = new Entity(KIND_EVENT, String.valueOf(version));
        entity.setProperty("action", ((BigDecimal)entityMap.get("action")).longValue());
        entity.setProperty("name", entityMap.get("name"));
        entity.setProperty("value", entityString);
        entity.setProperty("version", version);
        service.put(entity);
		return version;
	}
	
	public static List<Map<String, Object>> loadEvents(Long version) {
		Query query = new Query(KIND_EVENT);
		query.addFilter("version", FilterOperator.GREATER_THAN, version);
		query.addSort("version");
    	DatastoreService service = DatastoreServiceFactory.getDatastoreService();
    	PreparedQuery pq = service.prepare(query);
    	FetchOptions limit = FetchOptions.Builder.withOffset(0);
    	List<Entity> results = pq.asList(limit);
    	List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
    	for(Entity entity : results) {
    		list.add(entity.getProperties());
    	}
		return list;
	}
	
    public static Long getEventVersion() {
    	//TODO: îrëºêßå‰,ï™éU,ÉäÉgÉâÉC,îƒópâª
    	DatastoreService service = DatastoreServiceFactory.getDatastoreService();
    	Long count = 0l;
        try {
            Key key = KeyFactory.createKey(KIND_COUNTER, "event");
            Entity entity = service.get(key);
            count = (Long)entity.getProperty("count");
            count++;
            entity.setProperty("count", count);
            service.put(entity);
        } catch(EntityNotFoundException e) {
            Entity entity = new Entity(KIND_COUNTER, "event");
            count = (Long)0l;
            entity.setProperty("count", count);
            entity.setProperty("name", "event");
            service.put(entity);
        }
        return count;
    }

}
