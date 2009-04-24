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

  def list
    render :json => Party.find(:all).map{|party| party.attributes}.to_json
  end
end
