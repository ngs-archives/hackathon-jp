#!/usr/bin/perl
#


use strict;
use lib qw(/usr/local/TA/lib);
#use Bookmark2;
use UserInfo;
use Data::Dumper;

my $userinfo = new UserInfo("1000062691", 2);

$userinfo->getChannelList();

#print Dumper $userinfo;

$userinfo->write(0);

