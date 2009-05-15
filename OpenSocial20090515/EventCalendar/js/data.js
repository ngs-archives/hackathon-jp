
var data = {
	dao: {},
	status: {
		CREATING: "creating",
		FIX: "fix",
		CANCEL: "cancel"
	},
	entryType: {
		WHEN: "いつ",
		WHERE: "どこで",
		WHAT: "何を",
		WHO: "誰と"		
	},
	createUser: function(id, nickname){
		var user = {
			id: id,
			nickname: nickname
		};
		return user;
	},
	createEntry: function(type, user, postedAt, content, comment){
		var entry = {
			id: data.dao.__private.getNextEntryId(),
			type: type,
			user: user,
			postedAt: postedAt,
			content: content,
			comment: comment
		};
		return entry;
	},
	createEvent: function(title, creator, participants, status){
		var event = {
			id: data.dao.__private.getNextEventId(),
			title: title,
			creator: creator,
			participants: participants,
			status: status,
			entries: []
		};
		return event;
	}
};

var DummyDao = {
	// __private以下は非公開メソッド
	__private: {
		__lastEntryId: 0,
		__lastEventId: 0,
		getNextEntryId: function(){
			return this.__lastEntryId++;
		},
		getNextEventId: function(){
			return this.__lastEventId++;
		}
	},
	
	getEventsByOwerUserId: function(userId){
		var events = [];
		var user = data.createUser(userId, "sugimori");
		events.push(data.createEvent(0, "花見", user, [user], data.status.CRIATING));
		return events;
	},
	
	getEventById: function(eventId){
		var events = this.getEventsByOwerUserId("test");
		return events[0];
	},
	
	addEntry: function(eventId, entry){
	},
	
	updateEvent: function(event){
	},
	
	registerEvent: function(event){
	}
};

data.dao = DummyDao;