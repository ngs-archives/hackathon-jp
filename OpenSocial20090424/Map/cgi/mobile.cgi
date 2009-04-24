#!/usr/local/bin/perl
use strict;
use warnings;

use CGI;
use Template;
use HTTP::MobileAgent;
use LWP::UserAgent;
use HTTP::Request;
use HTTP::Response;
use URI::Escape;

my $APIKEY = "4cce56d9c8bfa3baf894c082e79d9e33bd562710fc22bff4c1a7f56cadca46ad";

my $q = CGI->new;
my $agent = HTTP::MobileAgent->new;
my $tt = Template->new({ABSOLUTE => 1});
#my $returi = "http://www.plants-web.jp/map/comment.cgi";
my $display = uri_escape("現在地を更新");
my $returi = "http://$ENV{'SERVER_NAME'}$ENV{'SCRIPT_NAME'}";

my $output;

my $ua = uri_escape($agent->user_agent);
my $apiuri = "http://api.cirius.co.jp/v1/geoform/xhtml?ua=${ua}&return_uri=${returi}&api_key=${APIKEY}&display=${display}";

my $req = HTTP::Request->new('GET' => $apiuri); # HTTP リクエストを作成
my $proxy = new LWP::UserAgent;
my $res = $proxy->request($req); # $res に HTTP レスポンスが返ってくる

my $address = $q->param("address");
$address ||= "未設定";
my $lat = $q->param("lat");
my $lng = $q->param("lon");

# sample.htmlのagentパラメータへ
# HTTP::MobileAgentのインスタンスをセットする
$tt->process('template.html',
    {agent => $agent, form => $res->content, address => $address }, \$output) or die $Template::ERROR;

print $q->header(-charset=>'UTF-8');
print $output;

exit;
