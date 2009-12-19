<%@page pageEncoding="UTF-8" isELIgnored="false"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@taglib prefix="f" uri="http://www.slim3.org/functions"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="Generator" content="GMapCreator,http://www.geekpage.jp/">
    <title>Google Map</title>
    <script src="http://maps.google.com/maps?file=api&v=2&key=ABQIAAAAyqjs7U6D5gEXk-MlJuhNDRTXTUUTZfsq7fo4pM2M5PJTkNv47RSnaJVk9Ngpr5qDr_ZVyS6JIB3INQ"
        type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
    //<![CDATA[
    var map;
    function onLoad() {
      map = new GMap2(document.getElementById("map"));
      map.setCenter(new GLatLng(37,139),4);
      map.addControl(new GLargeMapControl());
      map.addControl(new GMapTypeControl());
      map.addControl(new GOverviewMapControl());
      map.setMapType(G_NORMAL_MAP);
    }
    //]]>
    </script>
  </head>
  <body onload="onLoad()" style="margin:0px; padding:0px;">
  	<form>
  		E-mail: <input type="text" name="email">
  		<input type="submit" value="表示">
  	</form>
    <div id="map" style="width:500px; height:500px; margin:0px; padding:0px;"></div>
  </body>
</html>
