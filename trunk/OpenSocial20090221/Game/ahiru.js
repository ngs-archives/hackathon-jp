function init() {
  var params = {};

  params[opensocial.DataRequest.PeopleRequestFields] = [
    opensocial.Person.Field.AGE,
    opensocial.Person.Field.GENDER,
    opensocial.Person.Field.CURRENT_LOCATION];

  var req = opensocial.newDataRequest();
  req.add(
      req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER_FRIENDS, params),
      'friends');
  req.send(function(data) {
      var people = data.get('friends').getData();

      html = new Array();
      html.push('<ul>');
      people.each(function(person) {
        var age = person.getField(opensocial.Person.Field.AGE);
        var gender = person.getField(opensocial.Person.Field.GENDER);
        var addr = person.getField(opensocial.Person.Field.CURRENT_LOCATION);

        html.push('<li>' + person.getDisplayName() + "(" + age + ")" + "</li>");
      });
      html.push('</ul>');
      document.getElementById('friends').innerHTML = html.join('');
      });
}
