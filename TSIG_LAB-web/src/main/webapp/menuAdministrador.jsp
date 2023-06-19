<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="scripts/lib/ol-v6.13.0/ol.css">
    <link rel="stylesheet" href="http://raw.githack.com/walkermatt/ol-layerswitcher/master/dist/ol-layerswitcher.css"  type="text/css">
    <link rel="stylesheet" href="scripts/lib/ol-ext-v3.2.23/ol-ext.css">
    <script src="scripts/lib/ol-v6.13.0/ol.js"></script>
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.7.2/proj4.js"></script>
    <script src="http://raw.githack.com/walkermatt/ol-layerswitcher/master/dist/ol-layerswitcher.js"></script>
    <script src="scripts/lib/ol-ext-v3.2.23/ol-ext.js"></script>
	<script src="scripts/appMap.js"></script>
	<script src="scripts/lib/GeoTools/geoMap.js"></script>
	<script src="scripts/lib/GeoTools/geoLayers.js"></script>
	<link rel="stylesheet" href="scripts/lib/ol-ext-v3.2.23/font-awesome.min.css">   	
    <style>
        #map{
            width: 100%;
            height: 400px;;
        }
    </style>

</head>
<body>	
	<h3>Gestión del sistema</h3>
	<div id="map"></div>
    <div id="mouse-position"></div>    
    <script>
    	CargarMapaAdministrador();
    </script>
</body>
</html>