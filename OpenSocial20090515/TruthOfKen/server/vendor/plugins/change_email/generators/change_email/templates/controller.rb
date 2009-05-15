class <%= controller_class_name %>Controller < ApplicationController

  def edit
    if request.post? && params[:<%= user_model_name %>][:email].blank?
      flash[:notice] = "Please enter an email address"
    else
      @<%= user_model_name %> = <%= user_model_name.capitalize %>.find_by_id(current_user.id)
      return unless request.post?
      if @<%= user_model_name %>.nil?
        flash[:notice] = "Please login at first"
        return
      end
      @<%= user_model_name %>.attributes = params[:<%= user_model_name %>]
      if @<%= user_model_name %>.valid_attributes?(:only => [:email, :password])
        if <%= user_model_name.capitalize %>.authenticate(@<%= user_model_name %>.login, params[:<%= user_model_name %>][:password])
          @<%= file_name %> = <%= class_name %>.new do |e|
            e.email = params[:<%= user_model_name %>][:email]
          end
          @<%= file_name %>.<%= user_model_name %> = @<%= user_model_name %>
          @<%= file_name %>.save
          <%= class_name %>Mailer.deliver_change_email(@<%= file_name %>)

          @changed = true
          flash.clear
        else
          flash[:notice] = "Password mismatch" 
        end
      end
    end
  end

  def activate
    flash.clear
    return unless params[:id].nil? || params[:activation_code].nil?
    activator = params[:id] || params[:activation_code]
    @<%= file_name %> = <%= class_name %>.find_by_activation_code(activator) 
    if @<%= file_name %>
      <%= user_model_name %> = @<%= file_name %>.<%= user_model_name %>
      <%= user_model_name %>.update_attribute('email', @<%= file_name %>.email)
      redirect_back_or_default(:controller => '/<%= controller_class_name.downcase %>', :action => 'edit')
      flash[:notice] = "The email address for your account has been updated." 
    else
      flash[:notice] = "Unable to update the email address." 
    end
  end

end
