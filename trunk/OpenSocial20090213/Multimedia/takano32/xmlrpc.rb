#!/usr/bin/env ruby
# http://www.linux.or.jp/JF/JFdocs/XML-RPC-HOWTO/xmlrpc-howto-ruby.html
# http://www.xmlrpc.com/metaWeblogApi
# http://ecto.kung-foo.tv/index.php
# http://docs.tdiary.org/ja/?xmlrpc.rb


require 'mixi'

require "xmlrpc/server"


# s = XMLRPC::Server.new(8080)
s = XMLRPC::CGIServer.new


class MetaWeblogHandler
	def decode(s)
		return NKF.nkf('-We', s)
	end

	def newPost(blogid, username, password, struct, publish)
		title = decode(struct['title'])
		body = decode(struct['description'])
		session = Mixi::Session.new(username, password)
		session.start
		diary = session.add_diary(title, body)
		session.finish
		return diary.id
	end

	def editPost(postid, username, password, struct, publish)
		title = decode(struct['title'])
		body = decode(struct['description'])
		session = Mixi::Session.new(username, password)
		session.start
		diary = Mixi::Diary.new(session, session.owner_id, postid)
		diary.edit(title, body)
		session.finish
		return true
	end

	def getPost(postid, username, password)
		content = {
			"title" => "これはたいとる",
			"description" => "ほんぶんのないよう"
		}
		return content
	end
end


s.add_handler("metaWeblog", MetaWeblogHandler.new)
s.serve

