#!/usr/bin/env perl
#
# 1.TAではSSO連携を確認し、proid->labidへの変換を行う。
# 2.labidを引数にLABCGIがキックされ、LABではlabid->tokenへの変換を行う。
# 3.tokenをもってLABから起動される。
# 4.tokenからidtokenテーブルを検索し、gadgetのuidを取得。
# 5.gadgetのuidをキーにsocialコンテナをキックし、RestfulAPIからデータを取得する。
# 6.gadgetのuidをキーに友達一覧を検索し、友達がuid宛にプレゼントしたデータを取得する。（プレゼントデータ） <<まだ
# 7.プレゼントデータが合った場合はrestfulAPIを使って友達にメッセージングを行う。 <<まだ
#

use strict;
use lib qw(/usr/local/CWL/lib/perl);
use Net::OAuth;
use Data::Dumper;
use Digest::MD5 qw(md5 md5_hex);

use HTTP::Request::Common;
use LWP::UserAgent;
use JSON;
use CWL::RSS::CWCplain;
use Encode;

use CGI;


my $cwc = new CWL::RSS::CWCplain;
my $q = new CGI;
my $ua = LWP::UserAgent->new;

#-- myGadget専用部分
my $consumer_key = "orkut.com:113014574036";
my $consumer_secret = "oE9dEtQFmMxOGEW0hglO8zTv";
my $appid = "113014574036";

#-- TODO: tokenが渡されるのでidtokenテーブルからidを取得する。
my $uid = "09683931003945563316";

my $dataKey = "cw_".$uid;

my $time = sprintf("%d", time);
my $nonce = md5_hex $time;

#-- TODO: 関数かする。
#-- TODO: 友達一覧を取得する。
#-- TODO: 友達一覧をからappdataを取得する。自分宛のがあったらいただく。
#-- TODO: いただいたらメッセージングサービスでお礼を言う。
my $request = Net::OAuth->request('consumer')->new
(
	consumer_key => $consumer_key,
	consumer_secret => $consumer_secret,
	#request_url => 'http://sandbox.orkut.com/social/rest/people/16205469926827057997/@self',
	#request_url => 'http://sandbox.orkut.com/social/rest/people/09683931003945563316/@self',
	# appdata
	request_url => 'http://sandbox.orkut.com/social/rest/appdata/09683931003945563316/@self/'.$appid,
	request_method => 'GET',
	signature_method => 'HMAC-SHA1',
	timestamp => $time,
	nonce => $nonce,
	extra_params => 
	{
		xoauth_requestor_id=>"09683931003945563316",
		# appdata一部の場合はこっちにfields=でキーを指定する。
		fields=>$dataKey,
	}
);

$request->sign;

#print Dumper $request;

my $url =  $request->to_url;

#print $url,"\n";

my $res = $ua->request(GET $url);


my $content = $res->content;

$content =~ s/\\"/"/g;
$content =~ s/"\[/\[/g;
$content =~ s/\]"/\]/g;

#print Dumper $content;

my $h = JSON->new()->decode($content);

#print Dumper $h;

#-- TODO: CWC形式に変換する。

$cwc->channel(title => 'title dayo ', description => '', link => '');
my $items;
foreach my $i ( @{$h->{'entry'}->{$uid}->{$dataKey}})
{
#print STDERR decode('utf8', $i->{'description'});
	my $name = decode('utf8', $i->{'name'});
	my $desc = encode('eucjp', decode('utf8', $i->{'description'}));
	$desc =~ s/\\n//g;
print STDERR Dumper $i;
	my $data = undef;
	if ( $i->{img} ne "" )
	{
		$data =<< "EOF";
<![CDATA[
<body bgcolor="#000000">
<table border='0'>
<tr>
<td align=center>
<font color='#ffffff'>$name</font>
</td>
<tr>
<br>
</tr>
</tr>
<tr>
<td align=center width=420>
<img src=$i->{img}
</td>
</tr>
</table>
</body>
]]>
EOF
	}

	my $item = {
		title => encode('eucjp', decode('utf8', $i->{'name'})),
		description => $desc,
		lat => $i->{'lat'},
		lon => $i->{'lon'},
		tel => $i->{'phone'},
		#url => $i->{'link'},
		#image => $i->{'img'},
		data => $data,
	};
	push(@{$items}, $item);
}
$cwc->item($items);

print "Content-Type: application/xml; charset='utf8'\n\n";
print $cwc->show();

