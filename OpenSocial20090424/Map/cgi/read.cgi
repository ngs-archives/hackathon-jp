#!/usr/bin/perl
#
#

use strict;
use CGI;
use JSON;

use DBI;

use Encode;

use Data::Dumper;

our $debug = 0;

my $q = new CGI();

# DBhandler
our @dsn = (
    'dbi:mysql:rhathymia_hack',
    'rhathymia_hack',
    'p455w0rd',
    {RaiseError => 1},
    );

our $db = DBI->connect(@dsn);
my $id = $db->selectrow_array(
    "SELECT uid FROM idtoken"
);

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


my $ret = $db->selectall_arrayref("select * from data where uid = ? order by ctime ", {Columns=>{}}, $id);
my @arr = @$ret;

#print STDERR Dumper $ret;

my $json = JSON->new(pretty=>1);
print "Content-type: text/X-javascript\n\n";
print encode('utf8', decode('eucjp', $json->objToJson(\@arr)));
