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
    attenders = Attender.find(:all, :conditions => ["party_id = ?", params[:party_id]])
    render :json => attenders.map{|attender| (a = attender.attributes).each{|k, v| a[k] = v.to_s if v.is_a?(Time)}}
  end
end
