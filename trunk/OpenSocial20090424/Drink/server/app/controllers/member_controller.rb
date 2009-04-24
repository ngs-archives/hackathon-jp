class MemberController < ApplicationController

  def create
      member = Attender.create!(
        :party_id => params[:party_id],
        :member_id => params[:member_id],
        :name => params[:name],
        :gender => params[:gender],
        :age => params[:age].to_i,
        :comment => params[:comment]
      )
      
      render :json => {:result => 'true', :member_id => member.id}.to_json
    rescue
      render :json => {:error => $!.message}
  end
  
  def list
    render :json => Attender.find(:all).map{|party| party.attributes}.to_json
  end
end
