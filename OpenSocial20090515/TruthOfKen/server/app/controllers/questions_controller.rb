class QuestionsController < ApplicationController
  # GET /questions
  # GET /questions.xml
  def index
    #@Answer = Answer.find(:first, :conditions => ['mixi_id != ?', params[:mixi_id]], :order => "updated_at DESC")
    @questions = Question.find_by_sql(["select * from questions where id not in (select question_id from answers where mixi_id = :mid) order by updated_at DESC limit 1",{ :mid => params[:mixi_id]}] );
    json = @questions.to_json;
    
    #json.gsub(/\\([\\\/]|u[[:xdigit:]]{4})/) do
    #            ustr = $1
    #            if ustr.starts_with?('u')
    #              [ustr[1..-1].to_i(16)].pack("U")
    #            elsif ustr == '\\'
    #              '\\\\'
    #            else
    #              ustr
    #            end
    #        end
    p json    
    respond_to do |format|
      #format.html # index.html.erb
      format.json { render :json => json }
      #format.xml  { render :xml => @questions }
    end
  end

  # GET /questions/1
  # GET /questions/1.xml
  def show
    @question = Question.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @question }
    end
  end

  # GET /questions/new
  # GET /questions/new.xml
  def new
    @question = Question.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @question }
    end
  end

  # GET /questions/1/edit
  def edit
    @question = Question.find(params[:id])
  end

  # POST /questions
  # POST /questions.xml
  def create
    @question = Question.new(params[:question])

    respond_to do |format|
      if @question.save
        flash[:notice] = 'Question was successfully created.'
        format.html { redirect_to(@question) }
        format.xml  { render :xml => @question, :status => :created, :location => @question }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /questions/1
  # PUT /questions/1.xml
  def update
    @question = Question.find(params[:id])

    respond_to do |format|
      if @question.update_attributes(params[:question])
        flash[:notice] = 'Question was successfully updated.'
        format.html { redirect_to(@question) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /questions/1
  # DELETE /questions/1.xml
  def destroy
    @question = Question.find(params[:id])
    @question.destroy

    respond_to do |format|
      format.html { redirect_to(questions_url) }
      format.xml  { head :ok }
    end
  end
end
