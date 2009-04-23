CREATE TABLE `comment` (
`pid` INT( 11 ) NOT NULL ,
`seq` INT( 11 ) NOT NULL ,
`uid` CHAR( 32 ) NOT NULL ,
`comment` TEXT NOT NULL ,
`ctime` DATETIME NOT NULL ,
PRIMARY KEY ( `pid` )
) TYPE = MYISAM COMMENT = '地点データ毎のコメント';
