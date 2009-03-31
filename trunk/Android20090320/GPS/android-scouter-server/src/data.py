import wsgiref.handlers,cgi
import os, base64, random, logging
import models

from models import Members

from google.appengine.ext import webapp
from google.appengine.api import users
from google.appengine.api import images
from google.appengine.ext import db
from google.appengine.ext.webapp import template


#------------------------------------------------
# Members List
#------------------------------------------------
class MembersList(webapp.RequestHandler):
	
  def get(self):
    
    id=self.request.get("id");
    geo_x=self.request.get("geo_x");
    geo_y=self.request.get("geo_y");
    range=self.request.get("range");

    member_list = Members.all();
    
    self.response.headers['Content-Type'] = 'text/xml; charset=UTF-8'
    self.response.out.write(
      template.render(
        os.path.join(os.path.dirname(__file__), 'views',  'data', 'data.html'),
          {
            'id' : id ,
            'geo_y' : geo_y ,
            'geo_x' : geo_x ,
            'range' : range ,
            'member_list': member_list,
          }
      )
    )

#------------------------------------------------
# Main
#------------------------------------------------
def main():
  application = webapp.WSGIApplication(
    [
		('/data/', MembersList),
    ],
    debug=True)
  wsgiref.handlers.CGIHandler().run(application)


#------------------------------------------------
if __name__ == "__main__":
  main()

