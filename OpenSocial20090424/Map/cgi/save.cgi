#!/usr/bin/perl
#
# ガジェットからデータ登録を行う。

use strict;
use CGI;
use JSON;

use DBIx::Simple;
use HTTP::Lite;

use Encode;

use Data::Dumper;

our $debug = 0;

my $q = new CGI;

print STDERR $q->param;

# DBhandler
our @dsn = (
	'dbi:mysql:host=localhost;database=hackathon;',
	'nobody',
	'',
	{RaiseError => 1},
);
our $db = DBIx::Simple->connect(@dsn);
$db->abstract;

my $uid = $q->param('uid');
my $toid = $q->param('toid');
my $json = url_decode($q->param('json'));

if ( $debug )
{
	$uid = "wtake4";
	$toid = "hogehoge";
	$json = '[{"lat":"35.123","lon":"139.123","name":"taitoru","description":"desukuripusyon","img":"http://hogehoge"}]';
}

print STDERR "uid:",$uid, "\n";
print STDERR "toid:",$toid, "\n";
print STDERR "json:",$json, "\n";

if ( !(defined $uid))
{
	# エラー
	print STDERR "uid is invalid\n";
	exit;
}

if ( ! $toid )
{
	$toid = "**********";
}


my $obj = JSON->new()->decode($json);

foreach my $v (@{$obj})
{
	my $ret = $db->query(
		"insert data (uid,toid,seq,lat,lon,name,description,img,ctime) ".
		"select ?,?,max(seq)+1,?,?,?,?,?,now() from data where uid=? and toid=?", 
		$uid, $toid, $v->{'lat'}, $v->{'lon'}, 
    encode("eucjp", decode("utf8", $v->{'name'})),
    encode("eucjp", decode("utf8", $v->{'description'})), $v->{'img'},
		$uid, $toid, 
	);
	#print STDERR Dumper $ret;
}

print "Content-type: text/X-javascript\n\n";

sub url_decode($) {
	my $str = shift;
	$str =~ tr/+/ /;
	$str =~ s/%([0-9A-Fa-f][0-9A-Fa-f])/pack('H2', $1)/eg;
	return $str;
}
