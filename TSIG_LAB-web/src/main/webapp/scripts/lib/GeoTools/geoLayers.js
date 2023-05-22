//Layers a utilizar

function GeoLayers(){
    this.vectorGeoJson=null;
}

GeoLayers.prototype.ObtenerLayersBase = function(){
    var listaLayers = [];
    
    var lyrOSM = new ol.layer.Tile({
        title:'Open Street Map',
        visible: true,
        baseLayer:true,
        source: new ol.source.OSM()
    });
    listaLayers.push(lyrOSM);

	var lyrDepartamentos = new ol.layer.Tile({
        title:'ft_00_departamento',
        visible: false,
        baseLayer:true,
        source: new ol.source.TileWMS({
            url: 'http://localhost:8585/geoserver/tsig/wms?', //'http://localhost:8585/geoserver/tsig/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS: 'tsig:ft_00departamento'  //'tsig2023:ft_00_departamento'
            }
        })
    });
    listaLayers.push(lyrDepartamentos);

    return new ol.layer.Group({
        title:'Capas Base',
        layers:listaLayers
    });
};

GeoLayers.prototype.ObtenerLayersSobrepuestos=function(){
    var listaLayers = [];
    
	var lyrLinea = new ol.layer.Tile({
        title:'Recorrido',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8585/geoserver/tsig/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS: 'tsig:recorridos' //'tsig2023:recorridos'
            }
        })
    })
    listaLayers.push(lyrLinea);

    var lyrPunto = new ol.layer.Tile({
        title:'Hospital',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8585/geoserver/tsig/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                //STYLES:'puntoGeneral',
                LAYERS: 'tsig:hospital2' //tsig2023:hospital'
            }
        })
    })
    listaLayers.push(lyrPunto);
	
	var lyrZonas = new ol.layer.Tile({
        title:'zonas',
        visible: true,
		opacity: 0.4,
        source: new ol.source.TileWMS({
            url:'http://localhost:8585/geoserver/tsig/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS: 'tsig:zonas' //'tsig2023:zonas'
            }
        })
    });
    listaLayers.push(lyrZonas);
	
	var lyrEjes = new ol.layer.Tile({
        title:'ft_01_ejes',
        visible: false,
        source: new ol.source.TileWMS({
            url:'http://localhost:8585/geoserver/tsig/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS: 'tsig:ft_01ejes' //'tsig2023:ft_01_ejes'
            }
        })
    });
    listaLayers.push(lyrEjes);

    return new ol.layer.Group({
        title:'Capas Sopbrepuestas',
        layers:listaLayers
    });
}