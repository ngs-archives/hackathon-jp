class PartyController < ApplicationController
  def create
    party = Party.create!(
      :name => params[:name],
      :max => params[:max].to_i,
      :place => params[:place],
      :description => params[:description],
      :kanji => params[:kanji],
      :start_date => params[:date].to_datetime
    )
    
    render :json => {:result => 'true', :party_id => party.id}.to_json
  rescue
    render :json => {:error => $!.message}
  end
end
