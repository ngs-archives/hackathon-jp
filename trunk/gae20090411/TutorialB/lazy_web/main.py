# encoding=utf8

#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#




import wsgiref.handlers
import cgi
import os
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from google.appengine.ext.webapp import template
from yahoo import YahooJLP
import logging
from twitter import api

USER_NAME = 'your_name'
PASSWORD = 'your_password'

logging.getLogger().setLevel(logging.DEBUG)
class MainHandler(webapp.RequestHandler):

  def get(self):
    self.response.out.write('Hello world!')

class MainPage(webapp.RequestHandler):
  def post(self):
    id = self.request.get('twitterId')
    passwd = self.request.get('twitterPass')
    timeline = list()
    jlp = YahooJLP()
    try:
        # Twitter
        t = api.TwitterClone(id, passwd, 'http://twitter.com/')
        for data in reversed(t.get_friends_timeline()):
            #パーサーを使って名詞だけを抽出する
            #timeline.append('[t]%-12s : %s' % (data['user']['screen_name'], data['text']))
            text = data['text']
            if (text):
                words = jlp.parse(text)
                for word in words:
                    timeline.append(word['surface'])
    except:
        self.error(500)

    template_values = {
      'timeline': timeline,
      }

    path = os.path.join(os.path.dirname(__file__), 'main.html')
    self.response.out.write(template.render(path, template_values))

class TestPage(webapp.RequestHandler):
  def get(self):
    # Wassr
    w = api.TwitterClone(USER_NAME,PASSWORD, 'http://api.wassr.jp/')
    timeline = list()
    for data in reversed(w.get_public_timeline()):
        timeline.append('[w]%-12s : %s' % (data['user_login_id'], data['text']))

    # Twitter
    t = api.TwitterClone(USER_NAME, PASSWORD, 'http://twitter.com/')
    for data in reversed(t.get_public_timeline()):
        timeline.append('[t]%-12s : %s' % (data['user']['screen_name'], data['text']))

    template_values = {
      'timeline': timeline,
      }

    path = os.path.join(os.path.dirname(__file__), 'test.html')
    self.response.out.write(template.render(path, template_values))

def main():
  application = webapp.WSGIApplication([('/', MainHandler)
                                        ,('/main.cgi', MainPage)
                                        ,('/test.cgi', TestPage)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
