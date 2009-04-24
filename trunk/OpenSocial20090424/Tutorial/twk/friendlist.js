      /**
       * Request the OWNER and OWNER's friends.
       */
      function request() {
        var idspec = opensocial.newIdSpec({ "userId" : "OWNER", "groupId" : "FRIENDS" });
        var req = opensocial.newDataRequest();
        req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), "get_owner");
        req.add(req.newFetchPeopleRequest(idspec), "get_friends");
        req.send(response);
      };

      /**
       * Parses the response and generates html to list the names of the owner and
       * his or her friends.
       *
       * @param {Object} dataResponse Friend information that was requested.
       */
      function response(dataResponse) {
        var owner = dataResponse.get('get_owner').getData();
        /* @var owner Map< PersonId, Map<String, Object>> */
        var friends = dataResponse.get('get_friends').getData();
        /* @var friends Collection<Person> */ 
        
        var html = owner.getDisplayName() + 'の友達は' + friends.size() + '人です';
        html += ':<br><ul>';
        friends.each(function(person) {
          console.debug(person);
          /* @var person Person */
          html += '<li>' + person.getDisplayName() + '<br />';
          html += 'id:' + person.getId();
          html += 'isOwner:' + person.isOwner();
          html += 'isViewer:' + person.isViewer();
          html += '</li>';
//          person.getField(key, opt_params);
        });
        html += '</ul>';
        document.getElementById('message').innerHTML = html;
      };

      // Execute the request function when the application is finished loading.
      gadgets.util.registerOnLoadHandler(request);

