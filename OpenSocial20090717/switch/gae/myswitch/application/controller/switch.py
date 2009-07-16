# -*- coding:utf8 -*-

import cgi
import datetime
import time
import logging

from google.appengine.ext import db

from gaeo.controller import BaseController

from model.switch import Switch

class SwitchController(BaseController):
    # keyが存在するかどうか確認
    def check_exist(self):
      key_name = "/switch/%s" % (self.params['name'])
      switch = Switch.get_by_key_name(key_name)
      if switch is None:
        self.render(text=0)
      else:
        self.render(text=1)
    
    def create(self):
      key_name = "/switch/%s" % (self.params['name'])
      switch = Switch.get_by_key_name(key_name)
      #if switch is None:
      switch  = Switch(key_name=key_name,name=self.params['name'])
      switch.put()
      self.switch = switch

    def list(self):
      limit = 30
      if self.params.has_key('limit') and self.params['limit'].isdigit():
        limit = int(self.params['limit'])
      switches = Switch.all().fetch(limit=limit)
      self.jsons = ["{name:'%s', created_at:'%s'}," % (s.name, s.created_at) for s in switches ] 

    def search(self):
      limit = 30
      if self.params.has_key('limit') and self.params['limit'].isdigit():
        limit = int(self.params['limit'])
      word = self.params['name']
      # TODO : 遅いなら __KEY__で検索してもいいかも
      #switches = db.GqlQuery(" SELECT * FROM Switch WHERE name >= :1 AND name < :2", 
      #                      word, word + u"\xEF\xBF\xBD")
      switches = Switch.filter_prefix("name",word).fetch(100)
      self.jsons = ["{name:'%s', created_at:'%s'}," % (s.name, s.created_at) for s in switches ] 
