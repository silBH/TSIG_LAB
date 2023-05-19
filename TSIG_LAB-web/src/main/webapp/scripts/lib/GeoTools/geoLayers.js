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
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS:'tsig2023:ft_00_departamento'
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
        title:'Linea',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS:'tsig2023:lineas'
            }
        })
    })
    listaLayers.push(lyrLinea);

    var lyrPunto = new ol.layer.Tile({
        title:'Punto',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                STYLES:'puntoGeneral',
                LAYERS:'tsig2023:p'
            }
        })
    })
    listaLayers.push(lyrPunto);

    return new ol.layer.Group({
        title:'Capas Sopbrepuestas',
        layers:listaLayers
    });
}