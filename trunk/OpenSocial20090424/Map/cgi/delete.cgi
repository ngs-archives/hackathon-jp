#!/usr/bin/perl
#
# ガジェットからデータ削除を行う。

use strict;
use CGI;
use JSON;

use DBIx::Simple;
use HTTP::Lite;

use Encode;

use Data::Dumper;

my $okmes = {"stat"=>"OK"};
my $ngmes = {"stat"=>"NG"};

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

my $pid = $q->param('pid');
my $uid = $q->param('uid');

if ( $debug )
{
	$pid = "110";
	$uid = "wtake4";
}

print STDERR "pid:",$pid, "\n";
print STDERR "uid:",$uid, "\n";

if ( !(defined $pid)  || !defined($uid) )
{
	# エラー
	showHeader();

	print JSON->new()->encode($ngmes);
	exit (0);
}

my $ret = $db->query( "delete from data where pid = ? and uid = ?", $pid, $uid);

showHeader();

print JSON->new()->encode($okmes);
exit (0);

sub showHeader
{
	print "Content-type: text/X-javascript\n\n";
}
sub url_decode($) {
	my $str = shift;
	$str =~ tr/+/ /;
	$str =~ s/%([0-9A-Fa-f][0-9A-Fa-f])/pack('H2', $1)/eg;
	return $str;
}
