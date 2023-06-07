// Carga las definiciones de proyección EPSG:32721 y EPSG:3857
proj4.defs("EPSG:32721", "+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs");

// Registra las definiciones de proyección en OpenLayers
ol.proj.proj4.register(proj4);

function GeoMap(){
    this.map=null;
    this.mainBarCustom  =null;
    this.vector = null;
}
////CAPAS//////////
var lyrOSM = new ol.layer.Tile({
        title:'Open Street Map',
        visible: true,
        baseLayer:true,
        source: new ol.source.OSM()
    });

var lyrEjes = new ol.layer.Tile({
        title:'ft_01_ejes',
        visible: false,
        source: new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS:'tsig2023:ft_01_ejes'
            }
        })
    });
	
var lyrLinea = new ol.layer.Tile({
        title:'Recorrido',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS:'tsig2023:recorridos'
            }
        })
})
var lyrPunto = new ol.layer.Tile({
        title:'Hospital',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                STYLES:'puntoGeneral',
                LAYERS:'tsig2023:hospital'
            }
        })
})
var lyrZonas = new ol.layer.Tile({
        title:'zonas',
        visible: true,
		opacity: 0.4,
        source: new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS:'tsig2023:zonas'
            }
        })
});
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
////CAPAS//////////
GeoMap.prototype.CrearMapa= function(target,center,zoom){
    var _target = target || 'map',
    _center = center || [-56.1645, -34.8339],
    _zoom = zoom || 10;

    this.map = new ol.Map({
        target: _target,
        layers: [lyrOSM,lyrLinea,lyrPunto,lyrZonas,lyrUsuario,lyrEjes],
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
	
	// Obtén los datos de la capa Hospital como JSON
	var url = 'http://localhost:8586/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023:hospital&outputFormat=application/json';

	fetch(url)
	  .then(function(response) {
		return response.json();
	  })
	  .then(function(data) {
		// Crea la fuente de vector con los datos obtenidos
		var vectorSource = new ol.source.Vector({
		  features: new ol.format.GeoJSON().readFeatures(data)
		});

		// Transforma las coordenadas de EPSG:32721 a EPSG:3857 para poder visualizarlas correctamente
		vectorSource.forEachFeature(function(feature) {
		  var geometry = feature.getGeometry();
		  var coordinates = geometry.getCoordinates();
		  var transformedCoordinates = ol.proj.transform(coordinates, 'EPSG:32721', 'EPSG:3857');
		  geometry.setCoordinates(transformedCoordinates);
		});

		// Crea la capa de mapa de calor
		var heatmapLayer = new ol.layer.Heatmap({
		  title:'Mapa de Calor',
		  visible:false,
		  source: vectorSource,
		  blur: 15,
		  radius: 10,
		  weight: 'weight',
		  gradient: ['rgba(0, 0, 255, 0)', 'rgba(0, 0, 255, 1)']
		});

		// Agrega la capa de mapa de calor al mapa existente
		this.map.addLayer(heatmapLayer);
	  });
	map = this.map;
};

GeoMap.prototype.updateGeoserverLayer = function(cqlFilter) {
  lyrPunto.getSource().updateParams({
    'CQL_FILTER': cqlFilter
  });
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

  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
          color: 'red',
        }),
      }),
    }),
  });

  this.map.addLayer(vectorLayer);

  var buscarDireccion = function () {
    var direccionInput = document.getElementById('direccion-input').value;
    if (direccionInput) {
      var direccion = direccionInput.trim();

      // Validar el formato de la dirección
      var direccionRegExp = /^([\w\s]+),\s*(\d+)$/;
      var match = direccion.match(direccionRegExp);
      if (match) {
        var nombreCalle = match[1].trim();
        var numeroPuerta = match[2].trim();

        // Realizar la solicitud de geocodificación
        var direccionGeocodificada = nombreCalle + ', ' + numeroPuerta;
        var url = 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(direccionGeocodificada) + '&format=json&addressdetails=1';
        fetch(url)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data.length > 0) {
              var latitud = parseFloat(data[0].lat);
              var longitud = parseFloat(data[0].lon);

              // Centrar el mapa en la ubicación encontrada
              self.map.getView().setCenter(ol.proj.fromLonLat([longitud, latitud]));
              self.map.getView().setZoom(19);

              // Crear el marcador en la ubicación encontrada
              var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([longitud, latitud])),
              });

              vectorLayer.getSource().clear();
              vectorLayer.getSource().addFeature(marker);
			 // Obtener las coordenadas del marcador
				// Obtener las coordenadas del marcador en EPSG:3857
				var coords3857 = marker.getGeometry().getCoordinates();
				
				// Convertir las coordenadas de EPSG:3857 a EPSG:32721 utilizando proj4
				var coords32721 = proj4('EPSG:3857', 'EPSG:32721', coords3857);

				// Mostrar las coordenadas transformadas en la consola
				console.log('Coordenadas transformadas:', coords32721);

				// Construir el filtro CQL utilizando las coordenadas transformadas
				var cqlFilter = "DWITHIN(ubicacion, POINT(" + coords32721[0] + " " + coords32721[1] + "), 1000, meters)";
				self.updateGeoserverLayer(cqlFilter);
			  
            } else {
              alert('No se pudo encontrar la dirección.');
            }
          })
          .catch(function (error) {
            console.error('Error al realizar la solicitud de geocodificación:', error);
            alert('Error al buscar la dirección.');
          });
      } else {
        alert('El formato de la dirección no es válido. Utiliza el formato "nombre de calle, número de puerta".');
      }
    }
  };

  var inputElement = document.createElement('input');
  inputElement.setAttribute('id', 'direccion-input');
  inputElement.setAttribute('placeholder', 'Buscar por calle y número (nombreCalle, numeroPuerta)');
  inputElement.setAttribute('type', 'text');

  var buttonElement = document.createElement('button');
  buttonElement.textContent = 'Buscar';
  buttonElement.addEventListener('click', buscarDireccion);
  buttonElement.style.width = '100%'; // Ajusta el ancho del botón al 100%
  buttonElement.style.padding = '6px'; // Ajusta el relleno del botón

  this.mainBarCustom.element.appendChild(inputElement);
  this.mainBarCustom.element.appendChild(buttonElement);
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
	
//////////////////////////////////////////////////
    var controlPunto =  new ol.control.Toggle({
        title:'Dibujar punto',
        html:'<i class="fa fa-map-marker"></i>',
        interaction: new ol.interaction.Draw({
            type:'Point',
            source:this.vector.getSource()
        }),			
    });
	controlPunto.getInteraction().on('drawend', function(event) {
		var feature = event.feature;
		var coords3857 = feature.getGeometry().getCoordinates();

		// Convertir las coordenadas de EPSG:3857 a EPSG:32721
		var coords32721 = proj4('EPSG:3857', 'EPSG:32721', coords3857);

		console.log('Coordenadas en SRID 3857:',coords3857);

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
			  console.log('Coordenadas en SRID 32721:',formattedCoords);
			})
			.catch(error => {
			  console.error('Error al realizar la solicitud WFS:', error);
			});
		}
	  });	
	});

    barraDibujo.addControl(controlPunto);
//////////////////////////////////////////////////////////
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


	var controlSeleccionar = new ol.control.Toggle({
	  title: 'Seleccionar',
	  html: '<i class="fa fa-mouse-pointer"></i>',
	  interaction: new ol.interaction.Select({
		layers: [this.vector]
	  }),
	  bar: new ol.control.Bar({
		controls: [
		  new ol.control.TextButton({
			title: 'Ver Información',
			html: 'Info',
			handleClick: function() {
				// Obtén los datos de la capa Hospital como GML
				var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tsig2023%3Ahospital';

				fetch(url)
				  .then(function(response) {
					return response.text(); // Utiliza response.text() en lugar de response.json()
				  })
				  .then(function(data) {
					// Crea la fuente de vector con los datos obtenidos
					vectorSource = new ol.source.Vector({
					  features: new ol.format.WFS().readFeatures(data) // Utiliza ol.format.WFS() para leer los datos en formato GML
					});

					// Transforma las coordenadas de EPSG:32721 a EPSG:3857 para poder visualizarlas correctamente
					vectorSource.forEachFeature(function(feature) {
					  var geometry = feature.getGeometry();
					  var coordinates = geometry.getCoordinates();
					  var transformedCoordinates = ol.proj.transform(coordinates, 'EPSG:32721', 'EPSG:3857');
					  geometry.setCoordinates(transformedCoordinates);
					});

					// Agrega la fuente de vector a la capa vectorial existente
					if (self.vector) {
					  self.vector.setSource(vectorSource);
					}
				  })
				  .catch(function(error) {
					console.error('Error al obtener los datos de la capa Hospital:', error);
				  });	
			}
		  }),
		  new ol.control.TextButton({
			title: 'Eliminar',
			  html: 'Eliminar',
			  handleClick: function() {
				var selectedFeatures = controlSeleccionar.getInteraction().getFeatures();
				if (selectedFeatures.getLength() > 0) {
				  var selectedFeature = selectedFeatures.item(0);
				  var nombre = selectedFeature.get('nombre');
				  var id = selectedFeature.getId();

				  // Mostrar el mensaje de confirmación
				  Swal.fire({
					title: 'Eliminar',
					html: '¿Eliminar ID: ' + id + ' y nombre: ' + nombre + '?',
					icon: 'question',
					showCancelButton: true,
					confirmButtonText: 'Eliminar',
					cancelButtonText: 'Cancelar'
				  }).then(function(result) {
					if (result.isConfirmed) {
					  eliminarEntidad(selectedFeature);
					}
				  });
				}
			  }
		  })
		]
	  })
	});

	// Función para eliminar una entidad
	function eliminarEntidad(feature) {
	  // Crear una transacción WFS para eliminar 
	  var wfs = new ol.format.WFS();
	  var deleteRequest = wfs.writeTransaction(null, null, [feature], {
		featureType: 'hospital',
		featureNS: 'tsig2023',
		srsName: 'EPSG:3857',
		version: '1.1.0',
		handle: 'Delete'
	  });

	  // Enviar la solicitud WFS al servidor
	  fetch('http://localhost:8586/geoserver/tsig2023/ows', {
		method: 'POST',
		headers: {
		  'Content-Type': 'text/xml'
		},
		body: new XMLSerializer().serializeToString(deleteRequest)
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

	barraDibujo.addControl(controlSeleccionar);

}