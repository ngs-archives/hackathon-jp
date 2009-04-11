# -*- coding: utf-8 -*-

import urllib, urllib2
from django.utils import simplejson

class TwitterClone:
    def __init__(self, user, passwd,url):
        self.user = user
        self.passwd = passwd
        self.url = url

    def post(self, text):
        text = text.encode('utf-8')
        self.get_opener().open(self.url + 'statuses/update.json', urllib.urlencode({'status':text,'source':source}))

    def get_public_timeline(self):
        url = self.url + 'statuses/public_timeline.json'
        r = self.get_opener().open(url)
        data = simplejson.loads(r.read())
        return data

    def get_friends_timeline(self):
        url = self.url + 'statuses/friends_timeline.json'
        r = self.get_opener().open(url)
        data = simplejson.loads(r.read())
        return data

    def get_replies(self):
        url = self.url + 'statuses/replies.json'
        r = self.get_opener().open(url)
        data = simplejson.loads(r.read())
        return data

    def get_opener(self):
        passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
        passman.add_password(None, self.url , self.user, self.passwd)
        authhandler = urllib2.HTTPBasicAuthHandler(passman)
        opener = urllib2.build_opener(authhandler)
        return opener

