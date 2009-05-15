require 'pp'
require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class ValidAttributesModel < ActiveRecord::Base
  validates_presence_of :login, :first_name, :last_name, :email, :employee_id
  validates_numericality_of :employee_id
end

class ValidAttributesTest < Test::Unit::TestCase

  def test_valid_attributes
    @model = ValidAttributesModel.new
    assert !@model.valid_attributes?(:login)
    assert @model.errors.invalid?(:login)
    assert !@model.errors.invalid?(:email)
  end

  def test_valid_attributes_args
    @model = ValidAttributesModel.new
    assert !@model.valid_attributes?(:login, :first_name, :email)
    assert !@model.errors.invalid?(:employee_id)
    assert !@model.errors.invalid?(:last_name)
    assert @model.errors.invalid?(:first_name)
  end

  def test_valid_attributes_array
    @model = ValidAttributesModel.new
    assert !@model.valid_attributes?([:login, :first_name, :email])
    assert !@model.errors.invalid?(:employee_id)
    assert !@model.errors.invalid?(:last_name)
    assert @model.errors.invalid?(:first_name)
  end

  def test_valid_attributes_only
    @model = ValidAttributesModel.new
    assert !@model.valid_attributes?(:only=>[:login, :first_name, :email])
    assert !@model.errors.invalid?(:employee_id)
    assert !@model.errors.invalid?(:last_name)
    assert @model.errors.invalid?(:first_name)
  end

  def test_valid_attributes_except
    @model = ValidAttributesModel.new
    assert !@model.valid_attributes?(:except=>[:login, 'first_name'])
    assert @model.errors.invalid?(:employee_id)
    assert @model.errors.invalid?(:last_name)
    assert !@model.errors.invalid?(:first_name)
  end

   def test_save_with_valid_attributes
    @model = ValidAttributesModel.new
    assert !@model.save_with_valid_attributes(:login)
    assert !@model.errors.invalid?(:employee_id)
    assert !@model.errors.invalid?(:first_name)
    assert !@model.errors.invalid?(:last_name)
  end

   def test_save_with_valid_attributes_only
    @model = ValidAttributesModel.new
    @model.login = "testuser1"
    assert  !@model.save_with_valid_attributes(:only=>[:login, :first_name, :email])
    assert !@model.errors.invalid?(:employee_id)
    assert !@model.errors.invalid?(:last_name)
    assert @model.errors.invalid?(:first_name)
  end

  def test_save_with_valid_attributes_except
    @model = ValidAttributesModel.new
    @model.login = "testuser1"
    assert !@model.save_with_valid_attributes(:except=>[:login, 'first_name'])
    assert @model.errors.invalid?(:employee_id)
    assert @model.errors.invalid?(:last_name)
    assert !@model.errors.invalid?(:first_name)
  end

  def test_save_with_valid_attributes_args
    @model = ValidAttributesModel.new
    @model.login = "testuser1"
    assert  !@model.save_with_valid_attributes(:login, :employee_id, 'email')
    assert @model.errors.invalid?(:employee_id)
    assert @model.errors.invalid?(:email)
    assert !@model.errors.invalid?(:login)
    assert !@model.errors.invalid?(:last_name)
    assert !@model.errors.invalid?(:first_name)
  end

  def test_save_with_valid_attributes_array
    @model = ValidAttributesModel.new
    @model.login = "testuser1"
    assert  !@model.save_with_valid_attributes([:login, :employee_id, 'email'])
    assert @model.errors.invalid?(:employee_id)
    assert !@model.errors.invalid?(:last_name)
    assert !@model.errors.invalid?(:first_name)
    assert @model.errors.invalid?(:email)
    assert !@model.errors.invalid?(:login)
  end

  def test_save_with_valid_attributes!
    @model = ValidAttributesModel.new
    assert_raise ActiveRecord::RecordInvalid do
      @model.save_with_valid_attributes!(:only=>['login', :first_name, "last_name"])
    end
  end

  def test_invalid_argument
    @model = ValidAttributesModel.new
    assert_raise ArgumentError do
      @model.valid_attributes?(:only=>:login, :except=>:email)
    end
  end
end
