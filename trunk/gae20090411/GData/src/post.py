import time
import datetime
import StringIO
import EXIF
from google.appengine.api import images
from google.appengine.ext import webapp
from dbclasses import *


class PostHandler(webapp.RequestHandler):
    def post(self):
        sio = StringIO.StringIO(self.request.get("image"))
        tags = EXIF.process_file(sio)
#         self.response.out.write("""<html>
# <body>
#   <table>
# """)
#         for key in tags.keys():
#             if key in ('EXIF DateTimeOriginal', 'Image DateTime', 'EXIF DateTimeDigitized'):
#                 self.response.out.write("    <tr><td>%s</td><td>%s</td></tr>\n" % (key, tags[key]))
#             if key in ('GPS GPSLatitude', 'GPS GPSLongitude'):
#                 deg = self.__getDegree(tags[key].values)
#                 self.response.out.write("    <tr><td>%s</td><td>%f</td></tr>\n" % (key, deg))
            
#         self.response.out.write("""  </table>
# </body>
# </html>""")
        
        image = self.request.get("image")
        if tags.get('Image DateTime') != None:
            st = time.strptime(tags['Image DateTime'].values, '%Y:%m:%d %H:%M:%S')
            imgDateTime =  datetime.datetime(st[0], st[1], st[2], st[3], st[4], st[5])
        else:
            imgDateTime = None
        if tags.get('GPS GPSLatitude') != None:
            lat = self.__getDegree(tags['GPS GPSLatitude'].values)
        else:
            lat = 0.0
        if tags.get('GPS GPSLongitude') != None:
            lon = self.__getDegree(tags['GPS GPSLongitude'].values)
        else:
            lon = 0.0

        pictData = PictureData(picture     = image,
                               geo         = "%f, %f" % (lat, lon),
                               imgdatetime = imgDateTime)
        PictureCtrls.set(pictData)

        self.redirect('/')

    def __getDegree(self, values):
        deg  = values[0].num / values[0].den / 1.0
        deg += values[1].num / values[1].den / 60.0
        deg += values[2].num / values[2].den / 3600.0
        return deg
