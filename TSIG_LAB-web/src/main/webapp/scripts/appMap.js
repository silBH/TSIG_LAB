//Llama a todos los metodos y arma el mapa

function CargarMapa(){
    var map =new GeoMap();
    var layers = new GeoLayers();
   
    map.CrearMapa('map',[layers.ObtenerLayersBase(), layers.ObtenerLayersSobrepuestos()],null,16);
    map.CrearControlBarra();
    map.CrearControlBarraDibujo();
	map.CrearBarraBusquedaCalle();
    map.CrearBarraBusquedaGeoJson(layers.vectorGeoJson);
}