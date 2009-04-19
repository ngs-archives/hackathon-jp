#!/usr/bin/perl
#
#

use strict;
use CGI;
use JSON;

my $q = new CGI();

print STDERR $q->param('id');
my $id = $q->param('id');
my $callback = $q->param('callback');

#$id = 11;
#$callback = "http://devel.nissan-carwings.com/test-cgi/test/igoogle/reg.cgi";

if ( ! (defined $id && defined $callback ))
{
	# エラー
	print STDERR "id or callback is invalid\n";
	exit;
}

my $str = <<EOF;
<FORM NAME="myform" ACTION="proauth2.cgi" METHOD="POST"><BR>
<INPUT TYPE="hidden" NAME="gid" value="$id">
<INPUT TYPE="hidden" NAME="callback" value="$callback">
userid:<INPUT TYPE="text" NAME="id" value=""><br>
passwd:<INPUT TYPE="password" NAME="pass" value=""><br>
<INPUT TYPE="submit" NAME="button" Value="submit">
</FORM>
<script src="https://sslseal.jp/vs.cgi?TYPE=JFMT"></script>
EOF

print "Content-type: text/html\n\n";

print $str;

