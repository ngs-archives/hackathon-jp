#!/usr/bin/env python
#
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
import codecs
import getopt
import sys
import twitter
import configs
from google.appengine.ext import webapp


class MainHandler(webapp.RequestHandler):

  def get(self):
    self.response.out.write('<html><body>')
    self.response.out.write("""
          <form action="/" method="post">
            <div><textarea name="content" rows="3" cols="60"></textarea></div>
            <div><input type="submit" value="say"></div>
          </form>
        </body>
      </html>""")

  def post(self):
    message = self.request.get('content')
    self.response.out.write(message)

    api = twitter.Api(username=configs.TWITTER_USER, password=configs.TWITTER_PWD)
    statuses = api.PostUpdate(unicode(message))
    self.response.out.write('%s' % statuses)


def main():
  application = webapp.WSGIApplication([('/', MainHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
