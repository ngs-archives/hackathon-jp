from google.appengine.ext import db
import logging

class PictureData(db.Model):
    picture = db.BlobProperty()
    geo = db.GeoPtProperty()  # Format = "緯度, 経度"
    imgdatetime = db.DateTimeProperty(auto_now_add=False)
    upload = db.DateTimeProperty(auto_now_add=True)

MAX_FILES = 100

class PictureCtrls():
    
    @staticmethod
    def set(data):
        pic = PictureData()
        if len(data.picture) < (1024*1024):
            pic.picture = data.picture
        else:
            pic.picture = None
        pic.imgdatetime = data.imgdatetime
        pic.geo = data.geo
        pic.put()
    
    @staticmethod
    def delPic(key):
        try:
            pic = db.get(key)
            pic.delete()
            return True
        except:
            return False
            
    @staticmethod
    def update(key, data):
        pic = db.get(key)
        pic.filename = data.filename
        pic.picture = data.picture
        pic.geo = data.geo
        pic.put()
    
    @staticmethod
    def getAllPicture():
        pics = PictureData.all()
        return pics
    
    @staticmethod
    def getPicCount():
        pics = PictureData.all()
        return pics.count()
    
    @staticmethod
    def overFiles():
        return (PictureCtrls.getPicCount() >= MAX_FILES)
    
    
    @staticmethod
    def delOldestPic():
        pics = PictureData.all()
        pics.order("upload")
        if pics.count() > 0:
            pic = pics[0]
            pic.delete()
    
    @staticmethod
    def getPicutreByDate(start, end):
        pics = PictureCtrls.getAllPicture()
        pics.filter("upload >=", start).filter("upload <=", end)
        return pics
       
    @staticmethod
    def getByKey(key):
        pic = db.get(key)
        return pic