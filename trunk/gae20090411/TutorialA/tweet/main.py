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
from pyamf.remoting.gateway.google import WebAppGateway

api = twitter.Api(username=configs.TWITTER_USER, password=configs.TWITTER_PWD)

class MainHandler(webapp.RequestHandler):
  def get(self):
    statuses = api.GetFriendsTimeline()
    self.response.out.write('<html><body>')
    self.response.out.write("""
      <form action="/" method="post">
        <div><textarea name="content" rows="3" cols="60"></textarea></div>
        <div><input type="submit" value="say"></div>
      </form>
    """)
    for status in statuses:
      img = '<img src="' + status.user.profile_image_url + '" />'
      self.response.out.write('<div>%s %s: %s</div>' % (img, status.user.name, status.text))
    self.response.out.write("""
      </body>
      </html>
    """)

  def post(self):
    message = self.request.get('content')
    self.response.out.write(message)
    statuses = api.PostUpdate(unicode(message))
    self.redirect('/')

class PhotoHandler(webapp.RequestHandler):
  def get(self):
    statuses = api.GetPublicTimeline()
    self.response.out.write('<html><body>')
    for status in statuses:
      self.response.out.write('<div>%s: %s</div>' % (status.user.name, status.text))
    self.response.out.write("""
      </body>
      </html>
    """)

def echo(data):
    statuses = api.GetFriendsTimeline()
    first = "<tweet>\n"
    content = ''
    for status in statuses:
      content += ('<status>\n')
      content += ('<img src="%s" />\n' % (status.user.profile_image_url))
      content += ('<p class="name">%s</p>\n' % (str(status.user.name).strip()))
      content += ('<p class="status">%s</p>\n' % (status.text))
      content += ('</status>\n')
    last = "</tweet>"
    return first + content + last

class SampleXml(webapp.RequestHandler):
  def get (self):
    statuses = api.GetFriendsTimeline()
    first = "<tweet>\n"
    content = ''
    for status in statuses:
      content += ('<status>\n')
      content += ('<img src="%s" />\n' % (status.user.profile_image_url))
      content += ('<p class="name">%s</p>\n' % (str(status.user.name).strip()))
      content += ('<p class="status">%s</p>\n' % (status.text))
      content += ('</status>\n')
    last = "</tweet>"
    self.response.out.write(first + content + last)

services = {
    'echo': echo,
}

def main():
  application = webapp.WSGIApplication([
    ('/', MainHandler),
    ('/xml/', SampleXml),
    ('/flash/', WebAppGateway(services))
    ],
    debug=True)
  wsgiref.handlers.CGIHandler().run(application)

if __name__ == '__main__':
  main()
