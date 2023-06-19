//Layers a utilizar

function GeoLayersAdmin(){
    this.vectorGeoJson=null;
}

GeoLayersAdmin.prototype.ObtenerLayersBase = function(){
    var listaLayers = [];
    
    var lyrOSM = new ol.layer.Tile({
        title:'Open Street Map',
        visible: true,
        baseLayer:true,
        source: new ol.source.OSM()
    });
    listaLayers.push(lyrOSM);

    return new ol.layer.Group({
        title:'Capas Base',
        layers:listaLayers
    });
};

GeoLayersAdmin.prototype.ObtenerLayersSobrepuestos=function(){
    var listaLayers = [];
    
	var lyrLinea = new ol.layer.Tile({
        title:'Recorrido',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/tsig2023/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS: 'tsig2023:recorridos' //'tsig2023:recorridos'
            }
        })
    })
    listaLayers.push(lyrLinea);

    var lyrPunto = new ol.layer.Tile({
        title:'Hospital',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/tsig2023/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                //STYLES:'puntoGeneral',
                LAYERS: 'tsig2023:servicioemergencia'
            }
        })
    })
    listaLayers.push(lyrPunto);
	
	var lyrZonas = new ol.layer.Tile({
        title:'zonas',
        visible: true,
		opacity: 0.4,
        source: new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/tsig2023/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS: 'tsig2023:zonas' //'tsig2023:zonas'
            }
        })
    });
    listaLayers.push(lyrZonas);
	
	var lyrEjes = new ol.layer.Tile({
        title:'ft_01_ejes',
        visible: false,
        source: new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/tsig2023/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS: 'tsig2023:ft_01ejes' //'tsig2023:ft_01_ejes'
            }
        })
    });
    listaLayers.push(lyrEjes);
	
	var lyrUsuario = new ol.layer.Tile({
        title:'Usuario',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS:'tsig2023:usuario'
            }
        })
    })
    listaLayers.push(lyrUsuario);
	
	var lyrConsulta = new ol.layer.Tile({
		title:'Consulta',
		visible:false,
		source : new ol.source.TileWMS({
			url : 'http://localhost:8586/geoserver/tsig2023/wms?',
			params : {
				'LAYERS' : 'tsig2023:hospital', //'LAYERS' : 'tsig2023:hospital2',
				'TILED' : true
			},
			serverType : 'geoserver'
		})
	});
	listaLayers.push(lyrConsulta);

    return new ol.layer.Group({
        title:'Capas Sopbrepuestas',
        layers:listaLayers
    });
}