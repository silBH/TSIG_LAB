//Llama a todos los metodos y arma el mapa

function CargarMapa(){
    var map =new GeoMap();
    var layers = new GeoLayers();
   
    map.CrearMapa('map',[layers.ObtenerLayersBase(), layers.ObtenerLayersSobrepuestos()],null,16);
    map.CrearControlBarra();
    map.CrearControlBarraDibujo();
	map.CrearBarraBusquedaCalle();
    map.CrearBarraBusquedaGeoJson(layers.vectorGeoJson);
    
    var hospitalLayer = new ol.layer.Tile({
	    title: 'Capa de Hospitales',
	    source: new ol.source.TileWMS({
	        url: 'http://localhost:8585/geoserver/tsig/wms?',
	        params: {
	            'LAYERS': 'tsig:hospital',
	            'TILED': true
	        },
	        serverType: 'geoserver'
	    })
	});
	var map = new ol.Map({
	    target: 'map',
	    layers: [
	        hospitalLayer
	    ],
	    view: new ol.View({
	        center: [0, 0],
	        zoom: 2
	    })
	});
}