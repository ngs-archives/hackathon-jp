require 'active_record/version'
module ActiveRecord
  class Base
    attr_accessor :current_valid_attributes
    def valid_attributes?(*args)
      tmphash = (args.first.is_a?(Hash) ? args.first : {:only => args})
      if(tmphash[:except] && tmphash[:only])
        raise ArgumentError, "Please do not use the :only key and :except key in the same time."
      end
      self.current_valid_attributes = args
      result = valid?
      self.current_valid_attributes = nil
      return result
    end

    def save_with_valid_attributes(*args)
     if valid_attributes?(*args)
        save(false)
        return true
      else
        return false
      end
    end

    def save_with_valid_attributes!(*args)
     if valid_attributes?(*args)
        save(false)
      else
        raise ActiveRecord::RecordInvalid.new(self)
      end
    end

  end

  module ValidAttributes

    def self.included(base) #:nodoc:
      base.class_eval do
        if ::ActiveRecord::VERSION::MAJOR >=2 && ::ActiveRecord::VERSION::MINOR >=2
          alias_method_chain :add, :valid_attributes
        else
          alias_method_chain :add, :valid_attributes_for_2_1
        end
      end
    end

    def add_with_valid_attributes(attribute, message = nil, options = {})
      args = @base.current_valid_attributes
      if args.nil?
        add_without_valid_attributes(attribute, message, options)
      else
        args = args.first.is_a?(Array) ? args.first : args
        args = args.first.is_a?(Hash) ? args.first : {:only => args}

        if args[:except]
          args[:except] = [args[:except]] unless args[:except].is_a?(Array)
          args[:except].map! do |elem|
            elem.is_a?(Symbol) ? elem : elem.to_sym
          end
        else
          args[:only] = [args[:only]] unless args[:only].is_a?(Array)
          args[:only].map! do |elem|
            elem.is_a?(Symbol) ? elem : elem.to_sym
          end
        end

        if ((args[:except] && !args[:except].include?(attribute)) || 
            args[:only] && args[:only].include?(attribute))
          add_without_valid_attributes(attribute, message, options)
        end
      end
    end

    def add_with_valid_attributes_for_2_1(attribute, message = @@default_error_messages[:invalid])
      args = @base.current_valid_attributes
      if args.nil?
        add_without_valid_attributes_for_2_1(attribute, message)
      else
        args = args.first.is_a?(Array) ? args.first : args
        args = args.first.is_a?(Hash) ? args.first : {:only => args}

        if args[:except]
          args[:except] = [args[:except]] unless args[:except].is_a?(Array)
          args[:except].map! do |elem|
            elem.is_a?(Symbol) ? elem : elem.to_sym
          end
        else
          args[:only] = [args[:only]] unless args[:only].is_a?(Array)
          args[:only].map! do |elem|
            elem.is_a?(Symbol) ? elem : elem.to_sym
          end
        end

        if ((args[:except] && !args[:except].include?(attribute)) || 
            args[:only] && args[:only].include?(attribute))
          add_without_valid_attributes_for_2_1(attribute, message)
        end
      end
    end

  end
end

