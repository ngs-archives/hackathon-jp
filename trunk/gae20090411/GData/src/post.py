# -*- coding: utf-8 -*-
import time
import datetime
import StringIO
import EXIF
from google.appengine.api import images
from google.appengine.ext import webapp
from dbclasses import *


class PostHandler(webapp.RequestHandler):
    def post(self):
        # 画像データの取得
        image = self.request.get("image")
        # EXIFの解析
        sio = StringIO.StringIO(image)
        tags = EXIF.process_file(sio)
        
        # 画像の日付
        if tags.get('Image DateTime') != None:
            st = time.strptime(tags['Image DateTime'].values, '%Y:%m:%d %H:%M:%S')
            imgDateTime = datetime.datetime(*st[0:6])
        else:
            imgDateTime = None
        # 緯度
        if tags.get('GPS GPSLatitude') != None:
            lat = self.__getDegree(tags['GPS GPSLatitude'].values)
        else:
            lat = 0.0
        # 軽度
        if tags.get('GPS GPSLongitude') != None:
            lon = self.__getDegree(tags['GPS GPSLongitude'].values)
        else:
            lon = 0.0

        # データの保存
        pictData = PictureData(picture     = image,
                               geo         = "%f, %f" % (lat, lon),
                               imgdatetime = imgDateTime)
        PictureCtrls.set(pictData)

        self.redirect('/')

    # EXIFの緯度経度情報からfloat型の数値への変換
    def __getDegree(self, values):
        deg  = values[0].num / values[0].den / 1.0
        deg += values[1].num / values[1].den / 60.0
        deg += values[2].num / values[2].den / 3600.0
        return deg
