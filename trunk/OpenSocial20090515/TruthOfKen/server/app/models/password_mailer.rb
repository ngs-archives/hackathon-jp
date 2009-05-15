class PasswordMailer < ActionMailer::Base
  
  def forgot_password(password)
    setup_email(password.account)
    @subject    += 'You have requested to change your password'
    @body[:url]  = "#{$SERVICE_URL}/change_password/#{password.reset_code}"
  end

  def reset_password(account)
    setup_email(account)
    @subject    += 'Your password has been reset.'
  end

  protected
    def setup_email(account)
      @recipients  = "#{account.email}"
      @from        = "ADMINEMAIL"
      @subject     = "[YOURSITE] "
      @sent_on     = Time.now
      @body[:account] = account
    end
end