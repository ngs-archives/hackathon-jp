require 'digest/sha1'

class <%= class_name %> < ActiveRecord::Base
  belongs_to :<%= user_model_name %>

  protected
  def before_create
    self.activation_code = Digest::SHA1.hexdigest(Time.now.to_s.split(//).sort_by {rand}.join )
    self.expiration_date = 2.weeks.from_now
  end
end