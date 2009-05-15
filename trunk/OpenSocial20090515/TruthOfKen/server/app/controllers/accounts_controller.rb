class AccountsController < ApplicationController
  # Be sure to include AuthenticationSystem in Application Controller instead
  include AuthenticatedSystem
  before_filter :login_required, :except => [ :new,
                                              :create,
                                              :activate,
                                              :suspend,
                                              :unsuspend,
                                              :destroy,
                                              :purge,
                                              :index,
                                              :show
                                              ]
  # Protect these actions behind an admin login
  # before_filter :admin_required, :only => [:suspend, :unsuspend, :destroy, :purge]
  before_filter :find_account, :only => [:suspend, :unsuspend, :destroy, :purge]
  

  # render new.rhtml
  def new
    @account = Account.new
  end
 
  def create
    logout_keeping_session!
    @account = Account.new(params[:account])
    @account.register! if @account && @account.valid?
    success = @account && @account.valid?
    if success && @account.errors.empty?
      redirect_back_or_default('/')
      flash[:notice] = "Thanks for signing up!  We're sending you an email with your activation code."
    else
      flash[:error]  = "We couldn't set up that account, sorry.  Please try again, or contact an admin (link is above)."
      render :action => 'new'
    end
  end

  def activate
    logout_keeping_session!
    account = Account.find_by_activation_code(params[:activation_code]) unless params[:activation_code].blank?
    case
    when (!params[:activation_code].blank?) && account && !account.active?
      account.activate!
      flash[:notice] = "Signup complete! Please sign in to continue."
      redirect_to '/login'
    when params[:activation_code].blank?
      flash[:error] = "The activation code was missing.  Please follow the URL from your email."
      redirect_back_or_default('/')
    else 
      flash[:error]  = "We couldn't find a account with that activation code -- check your email? Or maybe you've already activated -- try signing in."
      redirect_back_or_default('/')
    end
  end

  def suspend
    @account.suspend! 
    redirect_to accounts_path
  end

  def unsuspend
    @account.unsuspend! 
    redirect_to accounts_path
  end

  def destroy
    @account.delete!
    redirect_to accounts_path
  end

  def purge
    @account.destroy
    redirect_to accounts_path
  end
  
  # There's no page here to update or destroy a account.  If you add those, be
  # smart -- make sure you check that the visitor is authorized to do so, that they
  # supply their old password along with a new one to update it, etc.

  # GET /accounts
  # GET /accounts.xml
  def index
    @accounts = Account.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @accounts }
    end
  end

  # GET /accounts/1
  # GET /accounts/1.xml
  def show
    @account = Account.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @account }
    end
  end

  # GET /accounts/1/edit
  def edit
    #TODO ここにログインユーザでかつ、そのIDのアカウント情報の更新なのか確認をいれる。

    @account = Account.find(params[:id])
  end

  # PUT /accounts/1
  # PUT /accounts/1.xml
  def update
    #TODO ここにログインユーザでかつ、そのIDのアカウント情報の更新なのか確認をいれる。

    @account = Account.find(params[:id])

    respond_to do |format|
      if @account.update_attributes(params[:account])
        flash[:notice] = 'Account was successfully updated.'
        format.html { redirect_to(@account) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @account.errors, :status => :unprocessable_entity }
      end
    end
  end

protected
  def find_account
    @account = Account.find(params[:id])
  end
end
