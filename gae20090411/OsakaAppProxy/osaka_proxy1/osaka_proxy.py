import os

host = os.environ["HTTP_HOST"]
path = os.environ["PATH_INFO"]
qs = os.environ["QUERY_STRING"]
if qs != "":
  path = path + "?" + qs

from google.appengine.api import urlfetch
result = urlfetch.fetch("http://colunet.appspot.com/my_proxy2?" + host + path);

ct = result.headers["content-type"]
text = result.content

try:
  if ct.index("text/html")==0:
    text = text.replace("できます。", "でけるで。")
    text = text.replace("します。", "するで。")
    text = text.replace("ています。", "とるで。")
    text = text.replace("ください。", "なはれ。")
    text = text.replace("いません。", "ないんや。")
    text = text.replace("ており、", "とって、")
    text = text.replace("すれば、", "するんやったら、")
    text = text.replace("です。", "やで。")
    ct = "text/html"
except ValueError:
  ct = ct

#try:
#  if ct.index("image/")==0:
#    from google.appengine.api import images
#    img = images.Image(text)
#    img.im_feeling_lucky()
#    text = img.execute_transforms()
#    ct = "image/jpeg"
#except ValueError:
#  ct = ct

print 'Content-Type: ' + ct
print ''
print text
