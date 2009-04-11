import os

from google.appengine.api import urlfetch
result = urlfetch.fetch("http://" + os.environ["QUERY_STRING"]);

print 'Content-Type: ' + result.headers["content-type"]
print ''
print result.content
