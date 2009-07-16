# -*- coding:utf8 -*-

from google.appengine.ext import db
from gaeo.model import BaseModel, SearchableBaseModel

import logging

class Switch(BaseModel):
    name = db.StringProperty(required=True)
    created_at = db.DateTimeProperty(auto_now_add=True)
    # key_name = "/switch/<name>"

    @classmethod
    def filter_prefix(cls, property_name, prefix):
      query = cls.all()
      query.filter("%s >= " % property_name, u"%s" % prefix)
      query.filter("%s < " % property_name, u"%s\uFFFD" % prefix)
      
      logging.info('00000')
      logging.info(u"%s\xEF\xBF\xBD" % prefix)
      logging.info('00000')
      return query
