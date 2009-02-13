require 'cgi'
cgi = CGI.new
url = cgi.params['image'][0]
uri = URI.parse(url)

open(uri) do |data|
	open('face.jpg', 'w') do |file|
		file.print(data.read)
	end
end


cgi.out(
        "type"       => "image/jpeg",
        "charset"    => "iso-2022-jp"
        )do
	IO.popen("./haar_detect face.jpg --no-gui", "r+") do |io|
		io.read
	end
end








