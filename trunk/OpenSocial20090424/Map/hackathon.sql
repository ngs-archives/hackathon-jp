-- MySQL dump 10.11
--
-- Host: localhost    Database: hackathon
-- ------------------------------------------------------
-- Server version	5.0.51b-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES ujis */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `comment` (
  `pid` int(11) NOT NULL,
  `seq` int(11) NOT NULL,
  `uid` char(32) NOT NULL,
  `comment` text,
  `ctime` datetime NOT NULL,
  PRIMARY KEY  (`pid`,`seq`)
) ENGINE=MyISAM DEFAULT CHARSET=ujis;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `data` (
  `pid` int(11) NOT NULL auto_increment,
  `uid` char(32) NOT NULL,
  `toid` char(32) NOT NULL,
  `seq` int(11) NOT NULL,
  `lat` double default NULL,
  `lon` double default NULL,
  `name` varchar(64) NOT NULL,
  `description` text,
  `ctime` datetime NOT NULL,
  `img` varchar(512) default NULL,
  PRIMARY KEY  (`pid`),
  UNIQUE KEY `uid` (`uid`,`toid`,`seq`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=ujis;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `data`
--

LOCK TABLES `data` WRITE;
/*!40000 ALTER TABLE `data` DISABLE KEYS */;
/*!40000 ALTER TABLE `data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `idtoken`
--

DROP TABLE IF EXISTS `idtoken`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `idtoken` (
  `uid` char(32) NOT NULL,
  `token` char(32) NOT NULL,
  PRIMARY KEY  (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=ujis;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `idtoken`
--

LOCK TABLES `idtoken` WRITE;
/*!40000 ALTER TABLE `idtoken` DISABLE KEYS */;
INSERT INTO `idtoken` VALUES ('wtake4','8580c5301c8d81bef3d2a20a804e0611');
/*!40000 ALTER TABLE `idtoken` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2009-04-23 10:48:26