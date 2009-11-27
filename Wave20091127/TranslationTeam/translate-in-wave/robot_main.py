# coding: utf-8
"""Translate Helper robot"""

import logging
import re

from waveapi import events
from waveapi import model
from waveapi import robot
from waveapi import document

import kay
kay.setup()

from kay.misc import get_appid
from kay.conf import settings

hostname = "%s.appspot.com" % get_appid()

gadget_url = ('http://hackathon-jp.googlecode.com/svn/trunk/'
              'Wave20091127/TranslationTeam/gadget/'
              'translation-helper.xml')

KEY_REQUEST_TYPE = "requestType"
KEY_RESPONSE_TYPE = "responseType"
KEY_PATH = "path"
KEY_LANGUAGE = "language"
KEY_STATUS = "status"
KEY_DATA = "data"

REQUEST_PO = "REQUEST_PO"
RESPONSE_PO = "RESPONSE_PO"

STATUS_PO_EXIST = "200"
STATUS_PO_NOT_EXIST = "null.po"

MOCK_PO_DATA = """
"""

from catalog.models import PoFile

def on_self_added(properties, context):
  """Called when this robot is first added to the wave."""
  blip = context.GetBlipById(context.GetRootWavelet().GetRootBlipId())
  if blip:
    blip.GetDocument().SetText('Translation Helper!')
    blip.GetDocument().AppendElement(
      document.Gadget(gadget_url))

def handle_request_po(gadget):
  path = gadget.get(KEY_PATH)
  language = gadget.get(KEY_LANGUAGE)
  # po_file = PoFile.all().filter("path =", path)\
  #    .filter("language =", language)
  ret = {
    KEY_RESPONSE_TYPE: RESPONSE_PO,
    KEY_STATUS: STATUS_PO_EXIST,
    KEY_DATA: MOCK_PO_DATA,
  }

handler_map = {
  REQUEST_PO: handle_request_po,
}

def OnBlipSubmitted(properties, context):
  logging.info('OnBlipSubmitted')
  blip_id = properties['blipId']
  blip = context.GetBlipById(blip_id)
  doc = blip.GetDocument()
  gadget = blip.GetGadgetByUrl(gadget_url)
  request_type = gadget.get(KEY_REQUEST_TYPE, REQUEST_PO)
  method = handler_map.get(request_type)
  assert(callable(method))
  method(gadget)
#   hoge = gadget.get("hoge")
#   logging.debug("hoge: %s" % hoge)
#   delta = {"hoge": hoge+"fuga"}
#   doc.GadgetSubmitDelta(gadget, delta)

if __name__ == '__main__':
  logging.getLogger().setLevel(logging.DEBUG)
  r = robot.Robot('Translation Helper', '2.0',
                  image_url='http://%s/media/icon.png' % hostname,
                  profile_url='http://%s/_wave/robot/profile' % hostname)
  r.RegisterHandler(events.WAVELET_SELF_ADDED,
                    on_self_added)
  r.RegisterHandler(events.BLIP_SUBMITTED, OnBlipSubmitted)
  r.Run(debug=True)
