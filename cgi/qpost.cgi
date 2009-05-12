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

our $debug = 1;

my $q = new CGI;

print STDERR $q->param;

# DBhandler
our @dsn = (
	'dbi:mysql:host=localhost;database=hackathon0515;',
	'nobody',
	'',
	{RaiseError => 1},
);
our $db = DBIx::Simple->connect(@dsn);
$db->abstract;

my $uid = $q->param('uid');
my $name = $q->param('name');
my $url = $q->param('url');
my $json = url_decode($q->param('json'));
my $lon = "";
my $lat = "";
my $enddate = "";

if ( $debug )
{
	$uid = "wtake4";
	$name = "name dayo.";
	$url = "http://www.geocities.jp/zzr_1100c22004/photomaedango_terameshi-club_348-06.jpg";
	$json = '[{"uid":"friend_123","mail":"wtake4@di.pdx.ne.jp","name":"name desu"},
		{"uid":"friend_456","mail":"ezmaysun@ezweb.ne.jp","name":"sigoto keitai"}]';

	$lat = 39.1235;
	$lon = 139.54321;

}

print STDERR "uid:",$uid, "\n";
print STDERR "name:",$name, "\n";
print STDERR "url:",$url, "\n";
print STDERR "json:",$json, "\n";

if ( !(defined $uid))
{
	# エラー
	showHeader();
	my $buf = {"stat"=>"NG", "qid"=>''};

	print JSON->new()->encode($buf);
	exit 0;
}


my $obj = JSON->new()->decode($json);

my $lastid;
# insert question
my $ret = $db->query(
	"insert question (uid,lat,lon,name,URL,enddate, ctime) values(?,?,?,?,?,?,now())", 
	$uid, $lat, $lon, $name, $url, $enddate
);
$lastid = $db->query("select last_insert_id()")->list;

foreach my $v (@{$obj})
{
	# insert friends

	$ret = $db->query(
		"insert friend (qid,uid,mail) values(?,?,?)", 
		$lastid, $v->{'uid'}, $v->{'mail'}
	);
}

my $buf = {"stat"=>"OK", "qid"=>$lastid};

showHeader();

print JSON->new()->encode($buf);


sub url_decode($) {
	my $str = shift;
	$str =~ tr/+/ /;
	$str =~ s/%([0-9A-Fa-f][0-9A-Fa-f])/pack('H2', $1)/eg;
	return $str;
}
sub showHeader
{
	print "Content-type: text/X-javascript\n\n";
}
