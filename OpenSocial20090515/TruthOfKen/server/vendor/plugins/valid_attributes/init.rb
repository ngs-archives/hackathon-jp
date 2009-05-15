require 'valid_attributes'
ActiveRecord::Errors.send(:include, ActiveRecord::ValidAttributes)
