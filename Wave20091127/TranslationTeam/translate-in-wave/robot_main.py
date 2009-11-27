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

def on_self_added(properties, context):
  """Called when this robot is first added to the wave."""
  blip = context.GetBlipById(context.GetRootWavelet().GetRootBlipId())
  if blip:
    blip.GetDocument().SetText('Translation Helper!')
    blip.GetDocument().AppendElement(
      document.Gadget(gadget_url))


def OnBlipSubmitted(properties, context):
  logging.info('OnBlipSubmitted')
  blip_id = properties['blipId']
  blip = context.GetBlipById(blip_id)
  doc = blip.GetDocument()
  gadget = blip.GetGadgetByUrl(gadget_url)
  hoge = gadget.get("hoge")
  logging.debug("hoge: %s" % hoge)
  delta = {"hoge": "fuga"}
  doc.GadgetSubmitDelta(gadget, delta)

if __name__ == '__main__':
  logging.getLogger().setLevel(logging.DEBUG)
  r = robot.Robot('Translation Helper', '1.0',
                  image_url='http://%s/media/icon.png' % hostname,
                  profile_url='http://%s/_wave/robot/profile' % hostname)
  r.RegisterHandler(events.WAVELET_SELF_ADDED,
                    on_self_added)
  r.RegisterHandler(events.BLIP_SUBMITTED, OnBlipSubmitted)
  r.Run(debug=True)
