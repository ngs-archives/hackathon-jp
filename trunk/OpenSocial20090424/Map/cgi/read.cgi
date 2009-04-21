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

our $debug = 0;

my $q = new CGI();

# DBhandler
our @dsn = (
	'dbi:mysql:host=localhost;database=hackathon;',
	'nobody',
	'',
	{RaiseError => 1},
);
our $db = DBIx::Simple->connect(@dsn);
$db->abstract;

my $id = $q->param('id');

if ( $debug )
{
$id = "wtake4";
}

print STDERR "id:",$id, "\n";

if (! (defined $id))
{
	# エラー
	print STDERR "id is invalid\n";
	exit;
}


my $ret = $db->query("select * from data where toid = ? or uid = ? order by ctime ", $id, $id);
#print STDERR Dumper $ret;
my @arr;
while ( my $r = $ret->hash )
{
	push(@arr, $r);
}

my $json = JSON->new()->encode(\@arr);
print "Content-type: text/X-javascript\n\n";
print encode('utf8', decode('eucjp', $json));


