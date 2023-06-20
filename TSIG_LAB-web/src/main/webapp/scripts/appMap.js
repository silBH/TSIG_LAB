//Llama a todos los metodos y arma el mapa

function CargarMapa(){ //original para pruebas
    var map =new GeoMap();
    var layers = new GeoLayers();
   
    map.CrearMapa('map',null,16);
    map.CrearControlBarra();
    map.CrearControlBarraDibujo();
	map.CrearBarraBusquedaCalle();
	
}

function CargarMapaAdministrador(){
    var map =new GeoMap();
    var layers = new GeoLayers();
   
    map.CrearMapaAdmin('map',null,12);
    map.CrearControlBarra();
    map.CrearControlBarraDibujoAdmin();
	map.CrearBarraBusquedaCalleNumeroSeparado();
	map.CrearControlHospital();	
}
