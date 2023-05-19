<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<!-- para usar leaflet -->
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<!--  Leaflet.draw -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
<title>Insert title here</title>
</head>
<body>
<h1>Leaflet</h1>
<div id="map" style="width: 100%; height: 60%;"></div>
<script>
  // Inicializar el mapa de Leaflet
  var map = L.map('map').setView([-34.9011, -56.1645], 13); // Coordenadas y nivel de zoom inicial
  
  // Agregar una capa base de OpenStreetMap
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
  // Agregar una capa de Geoserver
  var geoserverLayer = L.tileLayer.wms('http://localhost:8585/geoserver/tsig/wms?', {
    layers: '',
    format: 'image/png',
    transparent: true
  }).addTo(map);

  L.marker([-34.9011, -56.1645]).addTo(map)
  .bindPopup('A pretty CSS popup.<br> Easily customizable.')
  .openPopup();

  //Habilitar herramienta de dibujo
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  
  var drawControl = new L.Control.Draw({
//     draw: {
//       marker: true,
//       polyline: false,
//       polygon: false,
//       circle: false,
//       circlemarker: false
//     },
    edit: {
      featureGroup: drawnItems,
      edit: true
    }
  });
  map.addControl(drawControl);
 
  //agrego toolbar
  var toolbar = L.Toolbar();
  toolbar.addToolbar(map);
  
  // Manejar evento de selección de punto
  map.on(L.Draw.Event.CREATED, function(event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
    
    // Obtener las coordenadas del punto seleccionado
    var latLng = layer.getLatLng();
    var lat = latLng.lat;
    var lng = latLng.lng;
    
    // Realizar cualquier acción adicional con las coordenadas
    console.log('Punto seleccionado - Latitud: ' + lat + ', Longitud: ' + lng);
  });
      
</script>
<script src="draw.js"></script>
</body>
</html>