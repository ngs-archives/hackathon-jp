import wsgiref.handlers, cgi

import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

class MainPage(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/html; charset=UTF-8'
		self.response.out.write(
			template.render(
				os.path.join(os.path.dirname(__file__), 'views',  'help', 'help.html'),
				{}
			)
		)

def main():
	application = webapp.WSGIApplication(
		[	('/', MainPage)
		],
		debug=True)
	wsgiref.handlers.CGIHandler().run(application)

if __name__ == "__main__":
	main()


