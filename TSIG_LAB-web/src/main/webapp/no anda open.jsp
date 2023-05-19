<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
  <title>Mapa OpenLayers</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ol3/3.20.1/ol.css" type="text/css">
  <style>
    #map {
      width: 100%;
      height: 400px;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ol3/3.20.1/ol.js"></script>
</head>
<body>
  <h1>OpenLayers</h1>
  <div id="map"></div>

  <script>
	//Coordenadas de Montevideo, Uruguay
  	var montevideoCoordinates = ol.proj.fromLonLat([-56.1917, -34.9011]);
  
    // Crear un mapa y establecer la vista
    var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
          center: montevideoCoordinates,
          zoom: 12
      })
    });

 	// Capa y fuente del marcador
    var vectorSource = new ol.source.Vector();
    var vectorLayer = new ol.layer.Vector({
      source: vectorSource
    });
    map.addLayer(vectorLayer);

    // seleccion de ubicacion
    var draw;
    function addInteraction() {
      draw = new ol.interaction.Draw({
        source: vectorSource,
        type: 'Point'
      });
      map.addInteraction(draw);

      draw.on('drawend', function(event) {
        var marker = new ol.Feature({
          geometry: event.feature.getGeometry()
        });

        var markerStyle = new ol.style.Style({
          image: new ol.style.Icon({
            src: 'https://openlayers.org/en/latest/examples/data/icon.png'
          })
        });

        marker.setStyle(markerStyle);
        vectorSource.addFeature(marker);

        map.removeInteraction(draw);
      });
    }

    // evento click
    map.on('click', function(event) {
      addInteraction();
      var lat = event.latlng.lat;
      var lng = event.latlng.lng;
      console.log('Latitud: ' + lat + ', Longitud: ' + lng);
    });
  </script>
</body>
</html>
