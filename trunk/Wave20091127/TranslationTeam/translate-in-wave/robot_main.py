"""Groupy robot"""

import logging
import re

from waveapi import events
from waveapi import model
from waveapi import robot

import kay
kay.setup()

from kay.misc import get_appid
from kay.conf import settings

hostname = "%s.appspot.com" % get_appid()

def on_self_added(properties, context):
  """Called when this robot is first added to the wave."""
  blip = context.GetBlipById(context.GetRootWavelet().GetRootBlipId())
  if blip:
    blip.GetDocument().SetText('Translation Helper!')
    blip.GetDocument().AppendElement(
        document.Gadget(''))


if __name__ == '__main__':
  logging.getLogger().setLevel(logging.DEBUG)
  r = robot.Robot('Translation Helper', '1.0',
                  image_url='http://%s/media/icon.png' % hostname,
                  profile_url='http://%s/_wave/robot/profile' % hostname)
  r.RegisterHandler(events.WAVELET_SELF_ADDED,
                    on_self_added)
  r.Run(debug=True)
