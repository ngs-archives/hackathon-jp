# -*- coding: utf-8 -*-
"""
Make loader class from given models.

PYTHONPATH should include
google_appengine
google_appengine/lib/yaml/lib and
model class's definition module
"""

import sys
import csv
import datetime
try:
    from google.appengine.ext import db
    from google.appengine.api import users
except ImportError:
    print >> sys.stderr, "google_appengine{,/lib/yaml/lib} should be in PYTHONPATH"
    sys.exit(1)


PropTypeMap = {db.StringProperty:unicode,
               db.ByteStringProperty:db.ByteString,
               db.BooleanProperty:bool,
               db.IntegerProperty:int,
               db.FloatProperty:float,
               db.DateTimeProperty:datetime.datetime,
               db.DateProperty:datetime.datetime,
               db.TimeProperty:datetime.datetime,
               db.ListProperty:list,
               db.StringListProperty:list,
               db.ReferenceProperty:db.Key,
               db.SelfReferenceProperty:db.Key,
               db.UserProperty:users.User,
               db.BlobProperty:db.Blob,
               db.TextProperty:db.Text,
               db.CategoryProperty:db.Category,
               db.LinkProperty:db.Link,
               db.EmailProperty:db.Email,
               db.GeoPtProperty:db.GeoPt,
               db.IMProperty:db.IM,
               db.PhoneNumberProperty:db.PhoneNumber,
               db.PostalAddressProperty:db.PostalAddress,
               db.RatingProperty:db.Rating,
               }
# see: docs/python/users/userclass.html for future update.


def generate_loader_class(dottedname, column_order, out=sys.stdout):
    """
    PRECOND: module path in PYTHONPATH
    """
    model = loadclass(dottedname)
    class_header = """from google.appengine.ext import db

class %sLoader(Loader):
    def __init__(self):
        Loader.__init__(self, '%s',
                        [""" % (model.__name__, model.__name__)
    attr_list = []
    for attr in column_order:
        assert isinstance(getattr(model, attr), db.Property)
        attr_list.append(
        "('%s', %s)" % (attr, PropTypeMap[getattr(model, attr).__class__].__name__))
    class_footer = """])"""
    class_str = class_header + ", \n                         ".join(attr_list) + class_footer
    print >> out, class_str

def loadclass(dottedname):
    """
    load class from the dottedname (e.g. 'some.module.ClassName').
    """
    components = dottedname.split('.')
    mod = __import__(components[0])
    for comp in components[1:]:
        mod = getattr(mod, comp)
    return mod

def set_column_order(csvfilename):
    """
    The first line of the csv file consists of column names.
    """
    csvfile = open(csvfilename, 'rb')
    for line in csv.reader(csvfile):
        result = line
        break
    csvfile.close()
    return result

def print_usage():
    print "%s <model class name> <csvfile>" % sys.argv[0]
    print "   <model class name>: is in sys.path"
    print "            <csvfile>: first line consists of column names"

if __name__ == '__main__':
    if len(sys.argv) == 3:
        model_names = sys.argv[1]
        csvfilename = sys.argv[2]
        column_order = set_column_order(csvfilename)
        generate_loader_class(model_names, column_order)
    else:
        print_usage()
