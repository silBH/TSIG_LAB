<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/ol3/3.20.1/ol.css"
	type="text/css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/ol3/3.20.1/ol.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.6.1/proj4.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<!-- para ajax -->

<style>
#map {
	width: 100%;
	height: 400px;
}
</style>



<title>Insert title here</title>
</head>
<body>
	<h1>Hospitales</h1>
	<div id="map"></div>
	<button id="miBoton">Generar consulta</button>
</body>
<script>
	//Coordenadas de Montevideo, Uruguay
	var montevideoCoordinates = ol.proj.fromLonLat([ -56.1917, -34.9011 ]);

	//Crear capa con mapa base
	var osmLayer = new ol.layer.Tile({
		source : new ol.source.OSM()
	});

	// Crea una capa de GeoServer
	var geoserverLayer = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			url : 'http://localhost:8082/geoserver/tsig/wms?',
			params : {
				'LAYERS' : 'tsig2023:hospital', //'LAYERS' : 'tsig:hospital2',
				'TILED' : true
			},
			serverType : 'geoserver'
		})
	});

	// Crear la vista
	var map = new ol.Map({
		target : 'map',
		layers : [ osmLayer, geoserverLayer ], //se muestran las capas
		view : new ol.View({
			center : montevideoCoordinates,
			zoom : 12
		})
	});

	// Función para cargar y actualizar la capa de GeoServer con el filtro CQL
	function updateGeoserverLayer(cqlFilter) {
	  geoserverLayer.getSource().updateParams({
	    'CQL_FILTER': cqlFilter
	  });
	}

	// Manejo del evento de clic en el botón
	$('#miBoton').click(function() {
	  var cqlFilter = "DWITHIN(ubicacion, POINT(-56.195653 -34.906141), 1000, meters)";
	  updateGeoserverLayer(cqlFilter);
	});
		
</script>
</html>