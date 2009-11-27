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

import simplejson

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
KEY_DATA = "messages"

REQUEST_PO = "REQUEST_PO"
RESPONSE_PO = "RESPONSE_PO"

STATUS_PO_EXIST = "200"
STATUS_PO_NOT_EXIST = "null.po"

#from catalog.models import PO

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
  from babel.messages import pofile
  f = open("sample.po.txt")
  po_file = pofile.read_po(f)
  messages = []
  for message in po_file:
    if message.id:
      flags = message.flags if message.flags else None
      
      messages.append({"flags": list(message.flags),
                       "locations": list(message.locations),
                       "msgid": message.id,
                       "msgstr": message.string})
  ret = {
    KEY_RESPONSE_TYPE: RESPONSE_PO,
    KEY_STATUS: STATUS_PO_EXIST,
    KEY_DATA: messages,
  }
  logging.debug(messages)
  return ret


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
  ret = method(gadget)
  doc.GadgetSubmitDelta(gadget, ret)
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
