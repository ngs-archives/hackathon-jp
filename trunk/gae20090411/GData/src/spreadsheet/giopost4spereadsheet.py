import urllib
import urllib2

SHEET_URL = 'http://spreadsheets.google.com/formResponse?formkey=cDUzWFdyd3pZLUhtZWdmdTZ0LXVQTlE6MA..'

def post2spreadsheet(author='', keido='', ido=''):
  params = {
    'entry.0.single' : author,
    'entry.1.single' : keido,
    'entry.2.single' : ido,
  }
  urllib2.urlopen(SHEET_URL, urllib.urlencode(params))

if __name__ == '__main__':
  post2spreadsheet('local', '139.7', '35.657777')
