# -*- coding: utf-8 -*-
# catalog.models

from google.appengine.ext import db

# Create your models here.
class PO(db.Model):
        path = db.StringProperty()
        language = db.StringProperty()
        content = db.BlobProperty()
        created = db.DateTimeProperty(auto_now_add=True)
        updated = db.DateTimeProperty(auto_now=True)


