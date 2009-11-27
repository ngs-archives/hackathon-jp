# coding: utf-8

import urllib, StringIO, gzip

def get_po(url):
    
    page = urllib.urlopen(url)
    content = page.read()
    sf = StringIO.StringIO(content)
    dec - gzip.GzipFile(fileobj=sf)
    data = dec.read()

    list = url.split('/')
    name = list[-1].rstrip('.gz')

    po = PO(path=list, language='ja', content=data)
    po.put

if __name__ == '__main__':
    name = raw_input('Enter url: ')
    
    
