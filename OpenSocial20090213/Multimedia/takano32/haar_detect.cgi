#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import urllib2
import os
import md5
import cgi
from opencv.cv import *
from opencv.highgui import *

def faceDetect(imgfile):
  # 画像を読み込む
  src_img = cvLoadImage(imgfile, CV_LOAD_IMAGE_COLOR)
  src_gray = cvCreateImage(cvSize(src_img.width, src_img.height),
                           IPL_DEPTH_8U, 1)

  # ブーストされた分類器のカスケードを読み込む
  cascade_name = "/usr/share/opencv/haarcascades/haarcascade_frontalface_default.xml"
  #cascade_name = "/var/www/db/haarcascade_frontalface_default.xml"
  cascade = cvLoadHaarClassifierCascade(cascade_name, cvSize(1,1))

  # メモリを確保し，読み込んだ画像のグレースケール化，ヒストグラムの均一化を行う
  storage = cvCreateMemStorage(0)
  cvClearMemStorage(storage)
  cvCvtColor(src_img, src_gray, CV_BGR2GRAY)
  cvEqualizeHist(src_gray, src_gray)

  # 顔検出
  faces = cvHaarDetectObjects(src_gray, cascade, storage, 1.11, 4, 0, cvSize(0, 0))

  # 検出された全ての顔位置に枠を描画する
  for c, i in enumerate(faces):
    center.x = cvRound(i.x + i.width * 0.5)
    center.y = cvRound(i.y + i.height * 0.5)
    radius = cvRound((i.width + i.height) * 0.25)
    r, g, b = colors[c%8]
    cvCircle(src_img, center, radius, CV_RGB(r, g, b), 3, 8, 0)

  return src_img

def getImageFileFromURL(url, filename):
  f = urllib2.urlopen(url)
  save_image = file(filename, "wb")
  save_image.write(f.read())
  save_image.close()

if __name__ == '__main__':
  # CGIでURLを取得
  f = cgi.FieldStorage()
  url = f.getfirst('image_url', '')
  m = md5.new(url)
  filename = m.hexdigest()
  image_name = '/tmp/' + filename + '.jpg'

  # URLから画像を取得して保存
  getImageFileFromURL(url, image_name)

  # 顔認識処理
  img = faceDetect(image_name)

  new_image_name = '/tmp/new' + filename + '.jpg'

  # 顔認識画像を保存
  cvSaveImage(new_image_name, img)

  os.remove(image_name)

  # 顔認識画像を表示
  print "Content-Type: image/jpeg"
  print ""
  f2 = file(new_image_name)
  print f2.read()
  f2.close()

os.remove(new_image_name)
