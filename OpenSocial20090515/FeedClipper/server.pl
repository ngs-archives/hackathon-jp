#!/usr/bin/perl
use strict;
use warnings;
use utf8;

use HTTP::Engine;
use JSON::XS;
use Encode;

use Flickr::API::Photos;

my $flickr = Flickr::API::Photos->new('ebfcb9e971b46ce2cf195c55f1e8ec82');

use Net::Amazon;

my $amazon = Net::Amazon->new(token => '1N5YCMS15ZE0ZSY43YR2', locale => 'jp');

my $engine = HTTP::Engine->new(
    interface => {
        module => 'ServerSimple',
        args   => {
            host => 'localhost',
            port =>  10800,
        },
        request_handler => \&handle_request,
    },
);
$engine->run;

sub handle_request {
    my $req = shift;

    my $url  = $req->param('url');
    my $text = decode('utf8',$req->param('text')||'');
    my $html;

    return HTTP::Engine::Response->new(status => 500, body => 'url is empty') unless $url;

    if ( $url =~ m{^http://www.flickr.com/photos/(.+?)/(\d+?)/} ) {
        my ($user, $photo_id) = ($1, $2);

        my $result = $flickr->getInfo($photo_id);

        my $photo_url = sprintf(
            "http://farm%s.static.flickr.com/%s/%s_%s.jpg",
            $result->{farm}, $result->{server},
            $result->{id},   $result->{secret}
        );

        $html = qq{<img src="$photo_url" />};
    }
    elsif ( $url =~ m{http://www.youtube.com/watch\?v=([^&]+)} ) {
        my $video_id = html_escape($1);

        $html = qq{<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/$video_id&hl=ja&fs=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/$video_id&hl=ja&fs=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="425" height="344"></embed></object>};
    }
    elsif ( $url =~ m{http://www.nicovideo.jp/watch/([^&?/]+)} ) {
        my $nico_id = html_escape($1);

        $html = qq{<iframe width="312" height="176" src="http://ext.nicovideo.jp/thumb/$nico_id" scrolling="no" style="border:solid 1px #CCC;" frameborder="0"><a href="http://www.nicovideo.jp/watch/$nico_id">【ニコニコ動画】</a></iframe>};
    }
    elsif ( $url =~ m{http://www.nicovideo.jp/watch/([^&?/]+)} ) {
        my $nico_id = html_escape($1);

        $html = qq{<iframe width="312" height="176" src="http://ext.nicovideo.jp/thumb/$nico_id" scrolling="no" style="border:solid 1px #CCC;" frameborder="0"><a href="http://www.nicovideo.jp/watch/$nico_id">【ニコニコ動画】</a></iframe>};
    }
    elsif ( $url =~ m{http://(?:www.)amazon.(?:co.)jp/.*(?:ASIN|product-description|product|dp)/([^/]+)(?:/.*)*$} ) {
        my $asin = $1;

        my $result = $amazon->search(asin => $asin);

        if ( $result->is_success() ) {
            my $prop = $result->properties();
            $html = sprintf( qq{<table><tr><td><a href="%s"><img src="%s" /></a></td><td><a href="%s">%s</a><br />%s<br />\\%s</td></tr></table>},
                $prop->DetailPageURL(), $prop->ImageUrlMedium(),
                $prop->DetailPageURL(), $prop->ProductName(),
                $prop->can('authors') ? $prop->authors() : ($prop->can('artists') ? $prop->artists() : ''),
                $prop->OurPrice(),
            );
        } else {
            $html = "商品情報の取得に失敗しました";
        }
    }
    elsif ( $url =~ m{^http://} ) {
        my $u = html_escape($url);
        $html = qq{<a href="$u">$u</a>};
    }
    else {
        return HTTP::Engine::Response->new(status => 500, body => 'url invalid');
    }

    $html = "$text<br /><br />$html";

    my $res = HTTP::Engine::Response->new;
    $res->status(200);

    if ( $req->param('preview') ) {
        $res->content_type('text/html;charset=utf-8');
        $res->body(qq{<html><head><title>preview</title></head><body><h1>preview</h1>$html</body></html>});
    } else {
        $res->content_type('application/javascript;charset=utf-8');
        my $coder = JSON::XS->new->ascii->pretty->allow_nonref;
        $res->body($coder->encode({ url => $url, html => $html }));
    }

    $res;
}

sub html_escape {
    my $str = shift;

    # XSS guard
    for ($str) {
        s/&/&amp;/g;
        s/</&lt;/g;
        s/>/&gt;/g;
        s/"/&quot;/g;
    }

    $str;
}

