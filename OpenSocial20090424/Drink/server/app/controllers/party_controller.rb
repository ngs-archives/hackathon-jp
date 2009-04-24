class PartyController < ApplicationController
  def create
    party = Party.create!(
      :name => params[:name],
      :max => params[:max].to_i,
      :place => params[:place],
      :description => params[:description],
      :owner_name => params[:owner_name],
      :owner_id => params[:owner_id],
      :start_date => params[:date].to_datetime
    )
    
    render :json => {:result => 'true', :party_id => party.id}.to_json
  rescue
    render :json => {:error => $!.message}
  end

  def show
    includes = []
    conds = case
      when params[:owner_id]
        ["owner_id = ?", params[:owner_id]]
      when params[:attender_id]
        ["attenders.member_id = ?", params[:attender_id]]
        includes << :attenders
      when params[:party_id]
        ["id = ?", params[:party_id]]
      else
        nil
      end
    party = Party.find(:first, :conditions => conds, :include => includes)
    render :json => (a = party.attributes).each{|k, v| a[k] = v.to_s if v.is_a?(Time)}
  end

  def list
    render :json => Party.find(:all).map{|party| (a = party.attributes).each{|k, v| a[k] = v.to_s if v.is_a?(Time)}}
  end
end
