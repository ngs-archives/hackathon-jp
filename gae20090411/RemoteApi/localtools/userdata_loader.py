from google.appengine.ext import db


class UserDataLoader(Loader):
  def __init__(self):
    Loader.__init__(self, 'UserData',
                    [('id', int),
                     ('name', str),
                     ('email', str),
                     ('password', str)
                     ])

class UserData(db.Model):
  id = db.IntegerProperty()
  name = db.StringProperty()
  email = db.StringProperty()
  password = db.StringProperty()

