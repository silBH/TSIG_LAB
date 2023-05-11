<%@page import="business.HospitalBusinessLocal"%>
<%@page import="javax.naming.Context"%>
<%@page import="javax.naming.InitialContext"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>


<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<meta name="viewport" content="initial-scale=1.0, width=device-width">
<link rel="stylesheet" href="https://openlayers.org/en/latest/css/ol.css" type="text/css" />
<script src="https://openlayers.org/en/v6.5.0/build/ol.js"></script>
<title>Hospital</title>
</head>
<body>
	<div id="map" style="width: 100%; height: 500px;"></div>

    <script type="text/javascript">
      // Creamos el mapa
      var map = new ol.Map({
        target: 'map',
        layers: [
          // Agregamos la capa de GeoServer
          new ol.layer.Tile({
            source: new ol.source.TileWMS({
              url: 'http://localhost:8585/geoserver/tsig/wms?',
              params: {
                'LAYERS': 'tsig:ft_01parcelas',
                'TILED': true
              },
              serverType: 'geoserver'
            })
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([-72.69, -45.38]),
          zoom: 12
        })
      });
    </script>
</body>
</html>