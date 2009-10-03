class PlayerController < ApplicationController
  def index
  end

  def proxy
    url = URI.parse(params[:url])
    body = ""
    Net::HTTP.start(url.host) do |http|
      response = http.get(url.path);
      body = response.body
    end
    respond_to do |format|
      format.rss do
        render(:text  => body)
      end
    end
  end
end
