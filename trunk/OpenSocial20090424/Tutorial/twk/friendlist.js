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
        var friends = dataResponse.get('get_friends').getData(); 
        var html = owner.getDisplayName() + '�̗F�B�ꗗ';
        html += ':<br><ul>';
        friends.each(function(person) {
          html += '<li>' + person.getDisplayName() + '</li>';
        });
        html += '</ul>';
        document.getElementById('message').innerHTML = html;
      };

      // Execute the request function when the application is finished loading.
      gadgets.util.registerOnLoadHandler(request);
