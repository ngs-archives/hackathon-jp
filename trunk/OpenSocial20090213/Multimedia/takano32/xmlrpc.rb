#!/usr/bin/env ruby

require 'xmlrpc/server'
require 'uri'
require 'open-uri'

# s = XMLRPC::Server.new(8080)
s = XMLRPC::CGIServer.new

class HaarDetectFacesHandler
	def getFaces(url)
		uri = URI.parse(url)

		open(uri) do |data|
			open('face.jpg', 'w') do |file|
				file.print(data.read)
			end
		end
		
		IO.popen("./haar_detect face.jpg --no-gui", "r+") do |io|
			io.read
		end
	end
end

s.add_handler("haarDetectFaces", HaarDetectFacesHandler.new)
s.serve

