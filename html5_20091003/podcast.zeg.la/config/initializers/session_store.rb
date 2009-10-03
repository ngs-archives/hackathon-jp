# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_podcast_session',
  :secret      => '87b61d2eede15c8a867249ee8286dd1d61e0290825f0eb060102f007278843b9cd1d7e03a89d4be7a807fbfc461b92d2bf6d3ff4d23e88b08257c33788fde683'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
