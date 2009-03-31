#!/usr/bin/python
# coding=utf-8

import wsgiref.handlers, cgi
import os,logging,models

from models import Members

from google.appengine.api import images
from google.appengine.api import users
from google.appengine.ext import webapp,db
from google.appengine.ext.webapp import template


class MainPage(webapp.RequestHandler):
	def get(self):


                mode = self.request.get("mode")
		if mode == 'register':
	 		member = Members()
	 		member.id = int(self.request.get("id"))
			member.name = self.request.get("name")
			member.picture = self.request.get("picture")
			member.profile = self.request.get("profile")
	 		member.geo_x = float(self.request.get("geo_x"))
	 		member.geo_y = float(self.request.get("geo_y"))
	 		member.put()

                member_list = Members.all();
		self.response.headers['Content-Type'] = 'text/html; charset=UTF-8'
		self.response.out.write(
			template.render(
				os.path.join(os.path.dirname(__file__), 'views',  'admin', 'top.html'),
				{
					'member_list': member_list,
			        }
			)
		);



#------------------------------------------------
# Main
#------------------------------------------------
def main():
	application = webapp.WSGIApplication(
		[	('/admin/', MainPage)
		],
		debug=True)
	wsgiref.handlers.CGIHandler().run(application)

#------------------------------------------------
if __name__ == "__main__":
	main()


