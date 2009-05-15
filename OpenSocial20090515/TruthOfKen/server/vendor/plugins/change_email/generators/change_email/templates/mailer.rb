class <%= class_name %>Mailer < ActionMailer::Base

  def change_email(<%= file_name %>)
    setup_email(<%= file_name %>)
    @recipients  = "#{<%= file_name %>.email}" 
    @subject    += 'Request to change your email'
    @body[:url]  = "http://YOURSITE/activate_email/#{<%= file_name %>.activation_code}" 
  end

  protected
    def setup_email(<%= file_name %>)
      @recipients  = "#{<%= file_name %>.email}"
      @from        = "ADMINEMAIL"
      @subject     = "[YOURSITE] "
      @sent_on     = Time.now
      @body[:<%= file_name %>] = <%= file_name %>
    end
end