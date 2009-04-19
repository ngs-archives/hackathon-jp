#!/usr/bin/perl
#
#

use strict;
use CGI;
use HTTP::Lite;
use JSON;
use Digest::MD5 qw(md5 md5_hex);

my $q = new CGI();

my $gid = $q->param('gid');
my $id = $q->param('id');
my $pass = $q->param('pass');
my $callback = $q->param('callback');

#$gid = 123123;
#$id = 11;
#$pass = "hoge";
#$callback = "http://devel.nissan-carwings.com/test-cgi/test/igoogle/reg.cgi";

if ( ! (defined $gid && defined $pass && defined $id && defined $callback ))
{
	# エラー
	print STDERR "id  .. etc is invalid\n";
	exit;
}

my $ret = checkLogin($id, $pass);

if ( ! defined $ret )
{
	#ログイン失敗
}
my $h = new HTTP::Lite();
$h->reset();
my $req = $h->request($callback."?gid=".$gid."&token=".$ret);
my $buf = $h->body;

print "Content-type: text/html; charset='UTF-8'\n\n";

print $buf;
print "<a href='#' onclick='window.close()'>閉じる</a>";

sub checkLogin
{
	my ($id, $pass) = @_;

	# tokenを返す。
	return md5_hex(rand());
}

