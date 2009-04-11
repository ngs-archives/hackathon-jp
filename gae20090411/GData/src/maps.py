import cgi
import os
import logging

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from google.appengine.ext.webapp import template

import dbclasses

class show_map(webapp.RequestHandler):
  def get(self):
    marker_list = get_gdata()
    logging.debug(len(marker_list))

    template_values = {
      'marker_list': marker_list,
    }

    path = os.path.join(os.path.dirname(__file__), 'maps.html')
    self.response.out.write(template.render(path, template_values))


def get_gdata():
  marker_list = []
  picts = PictureData.all()
  for pict in picts:
    author = 'none'
    geo = pict.geo()
    keido = geo[:geo.find(',')]
    ido = geo[geo.find(',')+1:]

    m = Merker(author, keido, ido)
    marker_list.append(m)

  return marker_list


def dummy_data():
  marker_list = []
  m1 = Marker('test', 139.734444, 35.696388)
  m2 = Marker('test', 139.731111, 35.696388)
  m3 = Marker('test', 139.734231, 35.696388)

  marker_list.append(m1)
  marker_list.append(m2)
  marker_list.append(m3)

  return marker_list


class Marker():
  def __init__(self, author='', keido=0.0, ido=0.0):
    self.author = author
    self.keido = keido
    self.ido = ido

# gio encoding
def giocoding_keido(dd, mm, ss, ms=0):
    """
    transfer
    """
    x = (mm * 60000 + (ss + 12) * 1000 + ms) / 3.6
    ret = '%d.%d' % (dd, x)
    return float(ret)

# gio encodig
def giocoding_ido(dd, mm, ss, ms=0):
    """
    transfer
    """
    x = (mm * 60000 + (ss - 12) * 1000 + ms) / 3.6
    ret = '%d.%d' % (dd, x)
    return float(ret)

