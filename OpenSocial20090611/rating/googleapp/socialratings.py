#!/usr/bin/env python
#
# Storage for ratings in http://code.google.com/p/hackathon-jp/source/browse/#svn/trunk/OpenSocial20090611/rating
# Designed for Google App Engine.
#
# Usage:
# http://socialratings.appspot.com/add?item=star_trek&points=4
# http://socialratings.appspot.com/get?item=star_trek
# http://socialratings.appspot.com/
#
# Author: Nicolas Raoul http://nrw.free.fr
# Date: 2009/06/11 Google Hackathon
#
import cgi
import datetime
import wsgiref.handlers
from google.appengine.ext import db
from google.appengine.ext import webapp

# Data model for a single rating.
class Rating(db.Model):
  item = db.StringProperty()
  points = db.IntegerProperty()
  users = db.IntegerProperty()

# Add a single rating on a given item.
class RatingAdd(webapp.RequestHandler):
  def get(self):self.post()
  def post(self):
    self.response.out.write('<html><body><p>Adding rating... ')
    item = self.request.get('item')
    points = int(self.request.get('points'))
    # Get rating from database if already exists.
    query = "SELECT * FROM Rating WHERE item='%s'" % item
    ratings = db.GqlQuery(query)
    if ratings.count() != 0:
      self.response.out.write('exists... ')
      print points
      print ratings[0].points
      print ratings[0].points + points
      ratings[0].points = ratings[0].points + points
      print ratings[0].points
      ratings[0].users += 1
      ratings[0].put()
    else:
      self.response.out.write('creating... ')
      rating = Rating()
      rating.item = item
      rating.points = points
      rating.users = 1
      rating.put()
    self.response.out.write(' done.</body></html>')

# Get the JSON-formatted rating information for a given item:
class RatingGet(webapp.RequestHandler):
  def get(self):
    self.response.out.write('{')
    item = self.request.get('item')
    query = "SELECT * FROM Rating WHERE item='%s'" % item
    ratings = db.GqlQuery(query)
    points = ratings[0].points
    users = ratings[0].users
    average_rating = points/(1.0*users)
    self.response.out.write('"id" : "%s",' % item)
    self.response.out.write('"average_rating" : %f,' % average_rating)
    self.response.out.write('"total_ratings" : %d' % users)
    self.response.out.write('}')

# Serve the main page, a human interface that shows all ratings, mostly for debug.
class MainPage(webapp.RequestHandler):
  def get(self):
    self.response.out.write('<html><body><p>Ratings:</p><ul>')
    ratings = db.GqlQuery("SELECT * FROM Rating ORDER BY item")
    for rating in ratings:
      self.response.out.write('<li>%s: %d points given by %d users</li>' % (rating.item, rating.points, rating.users))
    self.response.out.write('</ul></body></html>')

# URL Patterns.
application = webapp.WSGIApplication([
  ('/', MainPage),
  ('/add', RatingAdd),
  ('/get', RatingGet)
], debug=True)

# Main.
def main():
  wsgiref.handlers.CGIHandler().run(application)
if __name__ == '__main__':
  main()
