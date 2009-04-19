#!/usr/bin/perl
#
#

use strict;
use CGI;
use JSON;

use DBIx::Simple;
use HTTP::Lite;

use Encode;

use Data::Dumper;

my $q = new CGI();

# DBhandler
our @dsn = (
	'dbi:mysql:host=localhost;database=gadget;',
	'nobody',
	'',
	{RaiseError => 1},
);
our $db = DBIx::Simple->connect(@dsn);
$db->abstract;

my $id = $q->param('id');
my $token = $q->param('token');

#$id = "09683931003945563316";
#$token = "feb3f5f95bdcf10b495bfd04a0058fd8";

print STDERR "id:",$id, "\n";
print STDERR "token:",$token, "\n";

if (! (defined $id && defined $token ))
{
	# エラー
	print STDERR "id or toekn is invalid\n";
	exit;
}

# idの登録および、cwトークンを検索
my $cwtoken = checkId($id);

if ( ! defined $cwtoken )
{
	print STDERR "cwtoken is invalid\n";
}
if ( $cwtoken ne $token ) 
{
	print STDERR "$cwtoken != $token : login invalid.\n";
}


my $ret = $db->query("select * from data where token = ? order by seq limit 0,6", $token);
#print STDERR Dumper $ret;
my @arr;
while ( my $r = $ret->hash )
{
	push(@arr, $r);
}

my $json = JSON->new()->encode(\@arr);
print "Content-type: text/X-javascript\n\n";
print encode('utf8', decode('eucjp', $json));


sub checkId
{
	my ($id) = @_;
	my $token = undef;

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

