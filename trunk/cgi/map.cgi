#!/usr/bin/perl

use strict;
use CGI;

my $lat="";
my $lon="";

my $lat_now="";
my $lon_now="";

$lat="35.681382";
$lon="139.766084";


$lat_now="35.45776";
$lon_now="139.63604";


#$gmap="http://maps.google.com/staticmap?center=".$lat.",".$lon."&zoom=$zooms{$zoom_now}&size=225x225&maptype=mobile&markers=".$omise.$lat_now.",".$lon_now.",redc&key=ABQIAAAAKjkQduEs7Gka2G2J-I9-MhRNdfb7NmQUw2abfUeu5VMjfmvRzRRoAcnbTV_LpWpgUDkZdxOY5huhzQ";

my $gmap="http://maps.google.com/staticmap?center=".$lat.",".$lon."&size=225x225&maptype=mobile&markers=".$lat_now.",".$lon_now.",redc&key=ABQIAAAAKjkQduEs7Gka2G2J-I9-MhRNdfb7NmQUw2abfUeu5VMjfmvRzRRoAcnbTV_LpWpgUDkZdxOY5huhzQ";


print "Content-type: text/html\n";
print "Pragma: no-cache\n";
print "Expires: Mon,26,Jul 1997 05:00:00 GMT\n";
print "Cache-control: no-cache,must-revalidate\n";
print "If-Modified-Since: Mon,26,Jul 1997 05:00:00 GMT\n";

print "<img src='$gmap'>\n";

print "</body>\n";
print "</html>\n";

