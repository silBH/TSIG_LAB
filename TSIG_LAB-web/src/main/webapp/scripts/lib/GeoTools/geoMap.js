proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs");
proj4.defs("EPSG:32721", "+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs");


var sourceCoords = [-6256081.2225, -4133147.1273437506]; // Coordenadas en EPSG:3857
var targetCoords = proj4('EPSG:3857', 'EPSG:32721', sourceCoords);

console.log('Coordenadas en EPSG:32721:', targetCoords);

function GeoMap(){
    this.map=null;
    this.mainBarCustom  =null;
    this.vector = null;
}

GeoMap.prototype.CrearMapa= function(target,layers,center,zoom){
    var _target = target || 'map',
    _layers = layers || [],	
    _center = center || [-56.1645, -34.8339],
    _zoom = zoom || 10;

    this.map = new ol.Map({
        target: _target,
        layers: _layers,
        view : new ol.View({
            center: ol.proj.fromLonLat(_center),
            zoom:_zoom
        })
    });

    
    var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Leyenda', 
        groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
    });

    this.map.addControl(layerSwitcher);
	
    map = this.map;
};

GeoMap.prototype.CrearControlBarra= function(){
    var mainBar = new ol.control.Bar();
    this.map.addControl(mainBar);

    mainBar.addControl(new ol.control.FullScreen());
    mainBar.addControl(new ol.control.Rotate());	
    mainBar.addControl(new ol.control.ZoomToExtent({extent:[-6276100,-4132519, -6241733,-4132218]}));
    mainBar.setPosition('top-left');
}

GeoMap.prototype.CrearBarraBusquedaCalle = function () {
  var self = this;

  if (!this.mainBarCustom) {
    this.mainBarCustom = new ol.control.Bar();
    this.map.addControl(this.mainBarCustom);
    this.mainBarCustom.setPosition('top');
  }

  var controlBusquedaCalle = new ol.control.SearchNominatim({
	title:'Busqueda',
    provider: 'osm',
    property: 'street',
    placeholder: 'Buscar por calle en Montevideo',
    countryCode: 'UY',
    limit: 5,
    bounded: true,
    viewbox: [-56.414795, -34.954466, -56.059239, -34.815044], // Coordenadas del área de Montevideo
    excludePlaceIds: [23424769], // Excluir el área metropolitana de Montevideo
    showButton: true, // Mostrar el botón de búsqueda
  });

  controlBusquedaCalle.on('select', function (e) {
    var p = e.coordinate;
    self.map.getView().animate({ center: p, zoom: 19 });
  });

  // Limpiar el historial de búsqueda al cargar la página
  controlBusquedaCalle.clearHistory();

  this.mainBarCustom.addControl(controlBusquedaCalle);
};

GeoMap.prototype.CrearControlBarraDibujo=function(){
    
    var self = this;
    
    if(!this.mainBarCustom){
        this.mainBarCustom = new ol.control.Bar();
        this.map.addControl(this.mainBarCustom);
        this.mainBarCustom.setPosition('top');
    }

    
    var estiloDibujo = new ol.style.Style({
        fill: new ol.style.Fill({
            color:'rgba(35, 163, 12, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            color:'#23a30c',
            width: 5
        }),
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color:'#23a30c'
            }),
            stroke: new ol.style.Stroke({
                color:'rgba(35, 163, 12, 0.5)',
                width: 8
            }),
        })
    });

    if(!this.vector){
        this.vector = new ol.layer.Vector({
            title:'Capa de dibujo',
            displayInLayerSwitcher: false,
            source: new ol.source.Vector(),
            style:estiloDibujo
        });
        this.map.addLayer(this.vector);
    }

    var barraDibujo = new ol.control.Bar({
        group:true,
        toggleOne:true
    });
    this.mainBarCustom.addControl(barraDibujo);


    var controlModificar = new ol.interaction.Modify({source:this.vector.getSource()});
    this.map.addInteraction(controlModificar);
	
	

    var controlPunto =  new ol.control.Toggle({
        title:'Dibujar punto',
        html:'<i class="fa fa-map-marker"></i>',
        interaction: new ol.interaction.Draw({
            type:'Point',
            source:this.vector.getSource()
        })
    });
	//////////////////////////////////////////////////
	controlPunto.getInteraction().on('drawend', function(event) {
		var feature = event.feature;
		var coords3857 = feature.getGeometry().getCoordinates();
	  
		// Convertir las coordenadas de EPSG:3857 a EPSG:32721
		var coords32721 = proj4('EPSG:3857', 'EPSG:32721', coords3857);

		console.log(coords3857);
	  
		// Mostrar ventana de diálogo para ingresar el valor del nombre
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

		  // Crear la geometría de punto
		  var geometry = new ol.geom.Point(coords3857);

		  // Crear la característica con la geometría y el nombre
		  var feature = new ol.Feature({
			nombre: nombre,
			ubicacion: geometry
		  });

		  // Asignar cualquier otro atributo a la característica si es necesario
		  feature.setProperties({
			name: 'Nuevo Punto'
		  });

		  // Crear una transacción WFS para insertar la característica
		  var wfs = new ol.format.WFS();
		  var insertRequest = wfs.writeTransaction([feature], null, null, {
			featureType: 'hospital',
			featureNS: 'tsig2023',
			srsName: 'EPSG:3857',
			version: '1.1.0'
		  });

		  // Enviar la solicitud WFS al servidor
		  fetch('http://localhost:8586/geoserver/tsig2023/wfs', {
			method: 'POST',
			headers: {
			  'Content-Type': 'text/xml'
			},
			body: new XMLSerializer().serializeToString(insertRequest)
		  })
			.then(response => response.text())
			.then(data => {
			  console.log('Respuesta del servidor:', data);
			  // Procesar la respuesta del servidor aquí
			  // Formatear las coordenadas en un texto legible
			  var formattedCoords = coords32721.join(', ');
			  // Mostrar las coordenadas en un cuadro de diálogo personalizado
			  Swal.fire({
				title: 'Coordenadas en EPSG:32721',
				text: formattedCoords,
				showConfirmButton: true
			  });
			})
			.catch(error => {
			  console.error('Error al realizar la solicitud WFS:', error);
			});
		}
	  });	
	});
	
    barraDibujo.addControl(controlPunto);

    var controlLinea =  new ol.control.Toggle({
        title:'Dibujar línea',
        html:'<i class="fa fa-share-alt"></i>',
        interaction: new ol.interaction.Draw({
            type:'LineString',
            source:this.vector.getSource()
        }),
        bar: new ol.control.Bar({
            controls:[
                new ol.control.TextButton({
                    title:'Deshacer ultimo punto',
                    html:'Deshacer',
                    handleClick:function(){
                        controlLinea.getInteraction().removeLastPoint()
                    }
                }),
                new ol.control.TextButton({
                    title:'Finalizar dibujo',
                    html:'Finalizar',
                    handleClick:function(){
                        controlLinea.getInteraction().finishDrawing();
                    }

                })
            ]
        })
    });
	
	controlLinea.getInteraction().on('drawend', function(event) {
	  var feature = event.feature;
	  var coords3857 = feature.getGeometry().getCoordinates();
	  console.log(coords3857);
	  // Convertir las coordenadas de EPSG:3857 a EPSG:32721
	  var coords32721 = coords3857.map(function(coord) {
		return proj4('EPSG:3857', 'EPSG:32721', coord);
	  });

	  // Mostrar ventana de diálogo para ingresar el valor del nombre
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

		  // Crear la geometría de línea
		  var geometry = new ol.geom.LineString(coords3857);

		  // Crear la característica con la geometría y el nombre
		  var feature = new ol.Feature({
			recorrido: nombre,
			ubicacion: geometry
		  });

		  // Asignar cualquier otro atributo a la característica si es necesario
		  feature.setProperties({
			name: 'Nueva Línea'
		  });

		  // Crear una transacción WFS para insertar la característica
		  var wfs = new ol.format.WFS();
		  var insertRequest = wfs.writeTransaction([feature], null, null, {
			featureType: 'recorridos',
			featureNS: 'tsig2023',
			srsName: 'EPSG:3857',
			version: '1.1.0'
		  });

		  // Enviar la solicitud WFS al servidor
		  fetch('http://localhost:8586/geoserver/tsig2023/wfs', {
			method: 'POST',
			headers: {
			  'Content-Type': 'text/xml'
			},
			body: new XMLSerializer().serializeToString(insertRequest)
		  })
		  .then(response => response.text())
		  .then(data => {
			console.log('Respuesta del servidor:', data);
			// Procesar la respuesta del servidor aquí
			// Formatear las coordenadas en un texto legible
			var formattedCoords = coords32721.map(function(coord) {
			  return coord.join(', ');
			}).join('\n\n');
			// Mostrar las coordenadas en un cuadro de diálogo personalizado
			Swal.fire({
			  title: 'Coordenadas en EPSG:32721',
			  text: formattedCoords,
			  showConfirmButton: true
			});
		  })
		  .catch(error => {
			console.error('Error al realizar la solicitud WFS:', error);
		  });
		}
	  });
	});

	barraDibujo.addControl(controlLinea);

    var controlPoligono =  new ol.control.Toggle({
        title:'Dibujar polígono',
        html:'<i class="fa fa-bookmark-o fa-rotate-270"></i>',
        interaction: new ol.interaction.Draw({
            type:'Polygon',
            source:this.vector.getSource()
        }),
        bar: new ol.control.Bar({
            controls:[
                new ol.control.TextButton({
                    title:'Deshacer ultimo punto',
                    html:'Deshacer',
                    handleClick:function(){
                        controlPoligono.getInteraction().removeLastPoint()
                    }
                }),
                new ol.control.TextButton({
                    title:'Finalizar dibujo',
                    html:'Finalizar',
                    handleClick:function(){
                        controlPoligono.getInteraction().finishDrawing();
                    }

                })
            ]
        })

    });
	
	controlPoligono.getInteraction().on('drawend', function(event) {
	  var feature = event.feature;
	  var coords3857 = feature.getGeometry().getCoordinates();
	  console.log(coords3857);
	  
	  // Mostrar ventana de diálogo para ingresar el valor del nombre
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

		  // Crear la geometría de Zona
		  var geometry = new ol.geom.Polygon(coords3857);

		  // Crear la característica con la geometría y el nombre
		  var feature = new ol.Feature({
			zona: nombre,
			ubicacion: geometry
		  });

		  // Asignar cualquier otro atributo a la característica si es necesario
		  feature.setProperties({
			name: 'Nueva Zona'
		  });

		  // Crear una transacción WFS para insertar la característica
		  var wfs = new ol.format.WFS();
		  var insertRequest = wfs.writeTransaction([feature], null, null, {
			featureType: 'zonas',
			featureNS: 'tsig2023',
			srsName: 'EPSG:3857',
			version: '1.1.0'
		  });

		  // Enviar la solicitud WFS al servidor
		  fetch('http://localhost:8586/geoserver/tsig2023/wfs', {
			method: 'POST',
			headers: {
			  'Content-Type': 'text/xml'
			},
			body: new XMLSerializer().serializeToString(insertRequest)
		  })
		  .then(response => response.text())
		  .then(data => {
			console.log('Respuesta del servidor:', data);
			// Procesar la respuesta del servidor aquí
		  })
		  .catch(error => {
			console.error('Error al realizar la solicitud WFS:', error);
		  });
		}
	  });
	  
	  
	  
	  
	  
	  
	  
	  
	});
	
    barraDibujo.addControl(controlPoligono);

    var controlSelect = new ol.control.Toggle({
		title: 'Seleccionar dibujo',
		html: '<i class="fa fa-hand-pointer-o"></i>',
		interaction: new ol.interaction.Select(),
		bar: new ol.control.Bar({
			controls: [
				new ol.control.TextButton({
					title: 'Eliminar dibujo',
					html: 'Eliminar',
					handleClick: function () {
						var features = controlSelect.getInteraction().getFeatures();
						if (!features.getLength()) {
							alert('Debe seleccionar primero un dibujo.');
						} else {
							for (var i = 0, f; (f = features.item(i)); i++) {
								self.vector.getSource().removeFeature(f);
							}
							controlSelect.getInteraction().getFeatures().clear();
						}
					}
				}),
				new ol.control.TextButton({
					title: 'Coordenadas',
					html: 'Coordenadas',
					handleClick: function () {
						var features = controlSelect.getInteraction().getFeatures();
						if (!features.getLength()) {
							alert('Debe seleccionar primero un dibujo.');
						} else {
							var selectedFeature = features.item(0); // Obtener la primera característica seleccionada
							var coords = selectedFeature.getGeometry().getCoordinates(); // Obtener las coordenadas de la geometría
							var message = 'Coordenadas: ' + coords;
							alert(message);
						}
					}
				})
			]
		})
	});
    barraDibujo.addControl(controlSelect);




}

GeoMap.prototype.CrearBarraBusquedaGeoJson= function(vectorLayerGeoJson){

    var self = this;

    if(!this.mainBarCustom){
        this.mainBarCustom = new ol.control.Bar();
        this.map.addControl(this.mainBarCustom);
        this.mainBarCustom.setPosition('top');  
    }

    var select = new ol.interaction.Select({});
    this.map.addInteraction(select);

    if(vectorLayerGeoJson){
        var controlBusqueda = new ol.control.SearchFeature({
            source:vectorLayerGeoJson,
            property:'descripcion'
        });
        this.map.addControl(controlBusqueda);

        controlBusqueda.on('select', function(e){
            select.getFeatures().clear();
            select.getFeatures().push(e.search);
            var p = e.search.getGeometry().getFirstCoordinate();
            self.map.getView().animate({center: p, zoom:19});            
        });


    }
    
}