#require File.join(File.dirname(__FILE__), "rails", "init")
require 'aasm'
require File.dirname(__FILE__) + '/lib/authorization/aasm_roles'
require File.dirname(__FILE__) + '/lib/authentication'
require File.dirname(__FILE__) + '/lib/authentication/by_password'
require File.dirname(__FILE__) + '/lib/authentication/by_cookie_token'
