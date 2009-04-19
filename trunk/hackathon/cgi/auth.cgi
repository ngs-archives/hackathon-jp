#!/usr/bin/perl
#
#

use strict;
use CGI;
use JSON;

use DBIx::Simple;
use HTTP::Lite;

my $q = new CGI();
my $j = {};
my $authurl = 
	"https://devel.nissan-carwings.com/test-cgi/test/igoogle/proauth.cgi";
my $callbackurl = 
	"http://devel.nissan-carwings.com/test-cgi/test/igoogle/reg.cgi";

# DBhandler
our @dsn = (
	'dbi:mysql:host=localhost;database=gadget;',
	'nobody',
	'',
	{RaiseError => 1},
);

print STDERR $q->param('id');
my $id = $q->param('id');

#$id = 123123;

if ( ! defined $id )
{
	# エラー
	print STDERR "id is invalid\n";
	exit;
}

# idの登録および、cwトークンを検索
my $cwtoken = checkId($id);

if ( ! defined $cwtoken )
{
	# cwの認証ページへ
	# javasでiframeにURLを埋め込む。
	# 認証ページへのURL,認証後のコールバックURLをJSONで返す。

	$j->{'authurl'} = $authurl;
	$j->{'callback'} = HTTP::Lite::escape($callbackurl);
	print STDERR "cwtoken is invalid\n";
}
$j->{'token'} = $cwtoken;


print "Content-type: text/X-javascript\n\n";
print JSON->new()->encode($j);


sub checkId
{
	my ($id) = @_;
	my $token = undef;
	my $db = DBIx::Simple->connect(@dsn);
	$db->abstract;

	my $ret = $db->query("select token from idtoken where id = ?", $id);
	if ( $ret->rows > 0 )
	{
		$token = $ret->hash()->{'token'};
	}
	# ローカルDBを検索してidからトークンを探す。
	# トークンがあったらcwサーバに問い合わせてトークンが
	# 有効かどうか判断する。
	# いずれかでNGだった場合はundefを返す。
	#return "0x4123472834923492897";
	return $token;
}

