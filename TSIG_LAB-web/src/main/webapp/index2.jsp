<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<title>Mapa OpenLayers</title>
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/ol3/3.20.1/ol.css"
	type="text/css">
<style>
#map {
	width: 100%;
	height: 400px;
}
</style>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/ol3/3.20.1/ol.js"></script>    
</head>
<body>
	<h1>Hospitales</h1>
	<div id="map"></div>

	<script>
		//Coordenadas de Montevideo, Uruguay
		var montevideoCoordinates = ol.proj.fromLonLat([ -56.1917, -34.9011 ]);

		//Crear capa con mapa base
		var osmLayer = new ol.layer.Tile({
				source : new ol.source.OSM()
		}); 
		
		// Crea una capa de GeoServer
        var geoserverLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'http://localhost:8585/geoserver/tsig/wms?',
                params: {
                    'LAYERS': 'tsig:hospital',
                    'TILED': true
                },
                serverType: 'geoserver'
            })
        });
		
		// Crear la vista
		var map = new ol.Map({
			target : 'map',
			layers : [ osmLayer , geoserverLayer ], //se muestran las capas
			view : new ol.View({
				center : montevideoCoordinates,
				zoom : 12
			})
		});
	</script>
</body>
</html>