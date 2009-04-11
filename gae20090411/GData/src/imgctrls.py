import cgi
import os
import logging
import dbclasses

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template



class GetPicture(webapp.RequestHandler):
    def get(self):
        key = self.request.get("key")
        img = dbclasses.PictureCtrls.getByKey(key)
        if img:
            photo = img.picture
            mimetype = "image/jpeg"
            self.response.headers['Content-Type'] = str(mimetype)
            self.response.out.write(photo)