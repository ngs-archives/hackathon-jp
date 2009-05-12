#!/usr/bin/perl

use strict;
use Image::ExifTool;

#緯度経度の計算
sub latlon_cal{

	my($value_latlon) = @_;
	my @a = ();
	my @b = ();
	my @c = ();

	@a = split(/ deg /, $value_latlon);
	@b = split(/\' /, $a[1]);
	@c = split(/\./, $b[1]);
	my $n_deg = $a[0]+$b[0]/60+$b[1]/3600;

	return($n_deg);
}

# EXIFを読み出す画像のパス
my $image_path = "./images/xxxxxxx.jpg";

my $exifTool = new Image::ExifTool;
my $info = $exifTool->ImageInfo($image_path);

for my $key(sort keys % $info){
	my $valuekey=$info->{$key};
	print("$key:$valuekey\n");

	my $lat ="";
	my $lon ="";
	if($key eq "GPSLatitude"){# 緯度
		$lat = &latlon_cal($valuekey);
		print("$key"."_2:$lat\n");
	}elsif($key eq "GPSLongitude"){# 経度
		$lon = &latlon_cal($valuekey);
		print("$key"."_2:$lon\n");

	}
}
