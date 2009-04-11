from google.appengine.ext import db

class UserData(db.Model):
  id = db.IntegerProperty()
  name = db.StringProperty()
  email = db.StringProperty()
  password = db.StringProperty()
