#!/usr/bin/perl
#
#

use strict;
use CGI;
use JSON;
use DBIx::Simple;

my $q = new CGI();

# DBhandler
our @dsn = (
	'dbi:mysql:host=localhost;database=gadget;',
	'nobody',
	'',
	{RaiseError => 1},
);
my $db = DBIx::Simple->connect(@dsn);
$db->abstract;

my $gid = $q->param('gid');
my $token = $q->param('token');
#$gid = 4567890;
#$token = "0xtokentoken";;

if ( ! (defined $gid && defined $token ))
{
	# 
	print STDERR "id or token is invalid\n";
	exit;
}

$db->query("insert idtoken values(?, ?, now(), now())", $gid, $token);

print "Content-type: text/html; charset=utf8\n\n";
#print "<script type=javascript>";
#print "<!--\n";
#print "location.reload();\n";
#print "-->\n";
#print "</script>";
#print "<body onload='location.reload();'>token is $token <br> gid is $gid</body>";
print "<body> token is $token <br> gid is $gid<br>";
print "reload your page.";


