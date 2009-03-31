#!/usr/bin/python
# coding=utf-8
from google.appengine.ext import db

class Members(db.Model):
	id = db.IntegerProperty()
	name = db.StringProperty()
	geo_x = db.FloatProperty()
	geo_y = db.FloatProperty()
	picture = db.StringProperty()
	power = db.IntegerProperty()
	profile = db.StringProperty()
	modified = db.DateTimeProperty(auto_now_add=True)
