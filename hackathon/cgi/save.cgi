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

my $q = new CGI;

print STDERR $q->param;

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
my $json = url_decode($q->param('json'));

print STDERR "id:",$id, "\n";
print STDERR "token:",$token, "\n";
print STDERR "json:",$json, "\n";
#$id = 123123;

if ( !(defined $id && defined $token ))
{
	# エラー
	print STDERR "id or toekn is invalid\n";
	exit;
}

# idの登録および、cwトークンを検索
my $cwtoken = checkId($id);

if ( !defined $cwtoken )
{
	print STDERR "cwtoken is invalid\n";
}
if ( $cwtoken ne $token ) 
{
	print STDERR "$cwtoken != $token : login invalid.\n";
}

my $obj = JSON->new()->decode($json);


my $i = 0;
$db->query("delete from data where token = ?", $token);
foreach my $v (@{$obj})
{
	#my $v = $obj->{$k};
	my $ret = $db->query("insert data (token, seq, lat, lon, name, description, phone) values(?, ?, ?, ?, ?, ?, ?)",
		$token, $i, $v->{'lat'}, $v->{'lon'}, 
    encode("eucjp", decode("utf8", $v->{'name'})),
    encode("eucjp", decode("utf8", $v->{'description'})),
    encode("eucjp", decode("utf8", $v->{'phone'})),
	);
	$i++;
	#print STDERR Dumper $ret;
}

print "Content-type: text/X-javascript\n\n";


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

sub url_decode($) {
	my $str = shift;
	$str =~ tr/+/ /;
	$str =~ s/%([0-9A-Fa-f][0-9A-Fa-f])/pack('H2', $1)/eg;
	return $str;
}
