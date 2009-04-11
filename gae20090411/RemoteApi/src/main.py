from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class MainPage(webapp.RequestHandler):
  def get(self):
    self.response.headers['Content-Type'] = 'text/html'
    self.response.out.write('Hello, webapp World!')

application = webapp.WSGIApplication(
                                     [('/', MainPage)],
                                     debug=True)

def real_main():
  run_wsgi_app(application)

def profile_main():
  # This is the main function for profiling 
  # We've renamed our original main() above to real_main()
  import cProfile, pstats
  prof = cProfile.Profile()
  prof = prof.runctx("real_main()", globals(), locals())



  print "<pre>"
  stats = pstats.Stats(prof)
  stats.sort_stats("time")  # Or cumulative
  stats.print_stats(80)  # 80 = how many to print
  # The rest is optional.
  # stats.print_callees()
  # stats.print_callers()
  print "</pre>"

if __name__ == '__main__':
  profile_main()
