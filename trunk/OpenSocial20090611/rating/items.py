#!/usr/bin/env python
#
# Items for ratings in http://code.google.com/p/hackathon-jp/source/browse/#svn/trunk/OpenSocial20090611/rating
# Designed for Google App Engine.
#
# This is just a unit tests implementation.
# Real implementations will depend on the items database's nature and structure.
#
# Usage:
# http://socialratings.appspot.com/subCategories?category=World/Europe
# http://socialratings.appspot.com/matchingItems?category=World/Europe/Italy&term=Mario
#
# Author: Nicolas Raoul http://nrw.free.fr
# Date: 2009/06/24
#
import cgi
import datetime
import wsgiref.handlers
from google.appengine.ext import db
from google.appengine.ext import webapp

# Returns the list of sub-categories of the given category, in JSON.
class SubCategories(webapp.RequestHandler):
  def get(self):
    category = self.request.get('category')
    self.response.out.write('{ "subCategories" : [ "Asia", "Africa", "Europe" ] }')

# Returns the list of sub-categories of the given category, in JSON.
class MatchingItems(webapp.RequestHandler):
  def get(self):
    category = self.request.get('category')
    term = self.request.get('term')
    self.response.out.write('{ "matchingItems" : [ "Trattoria Mario", "il Marioti", "Gelateria Mario" ] }')
    
# URL Patterns.
application = webapp.WSGIApplication([
  ('/subCategories', SubCategories),
  ('/matchingItems', MatchingItems)
], debug=True)

# Main.
def main():
  wsgiref.handlers.CGIHandler().run(application)
if __name__ == '__main__':
  main()
