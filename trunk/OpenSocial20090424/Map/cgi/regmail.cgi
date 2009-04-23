#!/usr/bin/perl
#
#
#
#

use strict;

use CGI qw(url param);

use Data::Dumper;

use DBIx::Simple;

use XML::TreePP;

use Digest::MD5  qw(md5 md5_hex md5_base64);

use Email::Valid::Loose;

use JSON;

my $okmes = {status=>"OK"};
my $ngmes = {status=>"NG"};

our $debug = 1;

my $path = "/test-cgi/hogehoge";

my $host = url(-base=>1);

my $c = new CGI;

my $uid = $c->param('uid');
my $address = $c->param('address');

if ( $debug )
{
	$uid = "wtake4";
	$address = 'wtake4@di.pdx.ne.jp';
}

if ( ! $uid )
{
	showHeader();

	print JSON->new()->encode($ngmes);
	exit (0);
}

# addressのバリデートチェック(モジュール使う)
if ( ! Email::Valid::Loose->address($address) )
{
	# error
	print STDERR "address:$address is invalid";

	showHeader();

	print JSON->new()->encode($ngmes);
	exit (0);
}

# DBhandler
my @dsn = ( 
  'dbi:mysql:host=localhost;database=hackathon;',
  'nobody',
  '',
  {RaiseError => 1}, 
);
my $db = DBIx::Simple->connect(@dsn);
$db->abstract;


# トークンの発行
# $uid + dateのmd5値
my $token = md5_hex($uid. localtime);

# DBから削除(キーはuid)従って1uidにつき1ケータイのみリンクできる。
$db->query("delete from idtoken where uid=?", $uid);

# DB登録
$db->query("insert into idtoken (uid, token) values(?, ?)", $uid, $token );


my $param = "?token=$token";


my $sendmail = '/usr/sbin/sendmail'; # sendmailコマンドパス
my $from = 'Map Share<nobody@goo.ne.jp>'; # 送信元メールアドレス
my $to = $address;
my $cc = "";
my $subject = '地図シェアのリンク'; # メールの件名
my $msg = <<"_TEXT_"; # メールの本文(ヒアドキュメントで変数に代入)

$host$path$param

_TEXT_

# sendmail コマンド起動
open(SDML,"| $sendmail -t -i") || die 'sendmail error';

# 変換は Jcode.pm
use Jcode;
# $subject を JIS に変換
&Jcode::convert(\$msg,'jis');
&Jcode::convert(\$subject,'jis');
$subject = jcode($subject)->mime_encode;


# メールヘッダ出力
print SDML "From: $from\n";
print SDML "To: $to\n";
print SDML "Cc: $cc\n";
print SDML "Subject: $subject\n";
print SDML "Content-Transfer-Encoding: 7bit\n";
# Content-type で文字コードを明示
print SDML "Content-type: text/plain;charset=\"ISO-2022-JP\"\n\n"; 
#print SDML "Content-Type: text/plain;\n\n";
# メール本文出力
print SDML "$msg";
# sendmail コマンド閉じる
close(SDML); 


showHeader();

print JSON->new()->encode($okmes);
exit (0);

sub showHeader
{
	print "Content-type: text/X-javascript\n\n";
}
