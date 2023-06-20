<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1" %>
<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ol3/3.20.1/ol.css" type="text/css">
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
	</head>

	<body>
		<h1>Hospitales</h1>
		<div id="map"></div>

		<script>
			//Coordenadas de Montevideo, Uruguay
			var montevideoCoordinates = ol.proj.fromLonLat([-56.1917, -34.9011]);

			//Crear capa con mapa base
			var osmLayer = new ol.layer.Tile({
				source: new ol.source.OSM()
			});

			// Crea una capa de GeoServer
			var geoserverLayer = new ol.layer.Tile({
				source: new ol.source.TileWMS({
					url: 'http://localhost:8585/geoserver/tsig/wms?',
					params: {
						'LAYERS': 'tsig:hospitales', //'LAYERS' : 'tsig:hospital2',
						'TILED': true
					},
					serverType: 'geoserver'
				})
			});

			// Crear un vector source y layer para los marcadores
			var markerSource = new ol.source.Vector();
			var markerLayer = new ol.layer.Vector({
				source: markerSource
			});

			// Crear la vista
			var map = new ol.Map({
				target: 'map',
				layers: [osmLayer, geoserverLayer], //se muestran las capas
				view: new ol.View({
					center: montevideoCoordinates,
					zoom: 12
				})
			});

			// Crear una interacci�n de dibujo de puntos
			var drawInteraction = new ol.interaction.Draw({
				type: 'Point',
				source: markerSource
			});

			// Definir las proyecciones para transformar coordenadas
			//		proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
			proj4.defs("EPSG:32721", "+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs");


			// Funci�n para transformar las coordenadas
			function transformCoordinates(coordinates) {
				return proj4('EPSG:3857', 'EPSG:32721', coordinates);
			}

			// Manejar el evento de finalizaci�n del dibujo para obtener las coordenadas del punto marcado
			drawInteraction.on('drawend', function (event) {
				var feature = event.feature;
				var coordinates = feature.getGeometry().getCoordinates();
				console.log('Coordenadas del punto marcado:', coordinates);

				// Transformar las coordenadas de EPSG:3857 a EPSG:32721
				var transformedCoordinates = transformCoordinates(coordinates);
				console.log('Coordenadas del punto marcado en SRS 32721:', transformedCoordinates);

				// Enviar las coordenadas a GeoServer para guardarlas en la capa
				//savePointToGeoServer(coordinates);				
				hospitalesCercanos(coordinates);
			});

			// Agregar la interacci�n de dibujo al mapa
			map.addInteraction(drawInteraction);

			// Funci�n para enviar las coordenadas a GeoServer
			function savePointToGeoServer(coordinates) {
				// Mostrar ventana de di�logo para ingresar el valor del nombre
				Swal.fire({
					title: 'Ingresar nombre',
					input: 'text',
					inputPlaceholder: 'Ingrese el nombre',
					showCancelButton: true,
					confirmButtonText: 'Guardar',
					cancelButtonText: 'Cancelar',
					inputValidator: (value) => {
						if (!value) {
							return 'Debe ingresar un nombre';
						}
					}
				}).then((result) => {
					if (result.isConfirmed) {
						// Obtener el valor del nombre ingresado por el usuario
						var nombre = result.value;

						//nueva insersion del punto
						//var geometry = new ol.geom.Point(coordinates);
						var geometry = new ol.geom.Point(coordinates);
						var feature = new ol.Feature({
							ubicacion: geometry,
							nombre: nombre
						});

						feature.setProperties({
							// nombre: 'Nuevo Punto'
						});

						var wfs = new ol.format.WFS();

						var insertRequest = wfs.writeTransaction([feature], null, null, {

							featureType: 'hospital2',
							featureNS: 'tsig',
							srsName: 'EPSG:3857',
							version: '1.1.0'
						});

						fetch('http://localhost:8585/geoserver/tsig/wfs', {
							method: 'POST',
							headers: {
								'Content-Type': 'text/xml'
							},
							body: new XMLSerializer().serializeToString(insertRequest)
						})
							.then(response => response.text())
							.then(data => {
								console.log('Respuesta del servidor:', data);
								// Procesar la respuesta del servidor aqu�
							})
							.catch(error => {
								console.error('Error al realizar la solicitud WFS:', error);
							});
					}
				});
			}

			function hospitalesCercanos(coordinates) {
				  console.log("0 - " + coordinates[0]);					
				  console.log("1 - " + coordinates[1]);

				  var cqlFilter = "DWITHIN(ubicacion, POINT(" + coordinates[0] + " " + coordinates[1] + "), 1000, meters)";
				  //var cqlFilter = "DWITHIN(ubicacion, POINT(-56.195653 -34.906141), 1000, meters)";
				  updateGeoserverLayer(cqlFilter);
			}
			function updateGeoserverLayer(cqlFilter) {
				  geoserverLayer.getSource().updateParams({
				    'CQL_FILTER': cqlFilter
				  });
		    }
		</script>
	</body>

	</html>