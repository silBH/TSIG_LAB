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
	
var lyrLinea2 = new ol.layer.Tile({
        title:'Recorrido',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS:'tsig2023:recorridos2'
            }
        })
})

var lyrPunto2 = new ol.layer.Tile({
        title:'Hospital',
        visible:true,
        source:new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                STYLES:'puntoGeneral',
                LAYERS:'tsig2023:hospital2'
            }
        })
})

var lyrZonas2 = new ol.layer.Tile({
        title:'zonas',
        visible: true,
		opacity: 0.4,
        source: new ol.source.TileWMS({
            url:'http://localhost:8586/geoserver/wms?',
            params:{
                VERSION:'1.1.1',
                FORMAT:'image/png',
                TRANSPARENT:true,
                LAYERS:'tsig2023:zonas2'
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
        layers: [lyrOSM,lyrLinea2,lyrPunto2,lyrZonas2,lyrUsuario,lyrEjes],
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

GeoMap.prototype.updateGeoserverLayer = function(cqlFilter) {
  lyrPunto2.getSource().updateParams({
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

GeoMap.prototype.CrearBarraBusqueda = function () {
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
  
  var multiLineStringLayer = new ol.layer.Vector({
	  source: new ol.source.Vector(),
	  style: new ol.style.Style({
		stroke: new ol.style.Stroke({
		  color: 'red',
		  width: 2,
		}),
	  }),
	});

	this.map.addLayer(multiLineStringLayer);

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
				//var coords32721 = proj4('EPSG:3857', 'EPSG:32721', coords3857);

				// Mostrar las coordenadas transformadas en la consola
				console.log('Coordenadas 3857:', coords3857);
				//console.log('Coordenadas 32721:', coords32721);

				// Construir el filtro CQL utilizando las coordenadas transformadas
				var cqlFilter = "DWITHIN(ubicacion, POINT(" + coords3857[0] + " " + coords3857[1] + "), 1000, meters)";
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

  
	var buscarCalleDibujarLinea = function () {
	  Swal.fire({
		title: 'Ingresa los nombres de las calles',
		html:
		  '<input id="calle1-input" class="swal2-input" placeholder="Calle 1">' +
		  '<input id="calle2-input" class="swal2-input" placeholder="Calle 2">',
		focusConfirm: false,
		preConfirm: function () {
		  var calle1 = document.getElementById('calle1-input').value;
		  var calle2 = document.getElementById('calle2-input').value;
		  
		  if (calle1 && calle2) {
			// Realizar la solicitud WFS para obtener la información de las calles
			var wfsUrl = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tsig2023%3Aft_01_ejes&CQL_FILTER=(nom_calle%20ilike%20%27%25' + encodeURIComponent(calle1) + '%25%27)%20or%20(nom_calle%20ilike%20%27%25' + encodeURIComponent(calle2) + '%25%27)&outputFormat=application/json';
			fetch(wfsUrl)
			  .then(function (response) {
				return response.json();
			  })
			  .then(function (data) {
					// Obtener las coordenadas del MultiLineString
					var features = data.features;
					var coordinates = [];
					for (var i = 0; i < features.length; i++) {
					  var geometry = features[i].geometry;
					  if (geometry && geometry.type === 'MultiLineString') {
						coordinates = coordinates.concat(geometry.coordinates);
					  }
					}	
					
					// Transformar las coordenadas de CRS 32721 a CRS 3857
					var transformedCoordinates = [];
					for (var i = 0; i < coordinates.length; i++) {
					  var subCoordinates = coordinates[i];
					  var transformedSubCoordinates = [];
					  for (var j = 0; j < subCoordinates.length; j++) {
						var coordinate = subCoordinates[j];
						var transformedCoordinate = proj4("EPSG:32721", "EPSG:3857", coordinate);
						
						transformedSubCoordinates.push(transformedCoordinate);
					  }
					  transformedCoordinates.push(transformedSubCoordinates);
					}
					// Crear el MultiLineString
					var multiLineString = new ol.geom.MultiLineString(transformedCoordinates);
					
					// Crear una nueva feature con el MultiLineString
					var feature = new ol.Feature(multiLineString);

					// Añadir la feature a la fuente de datos de la capa multiLineStringLayer
					multiLineStringLayer.getSource().addFeature(feature);

					var pointCount = {}; // Objeto para realizar un seguimiento de la cantidad de linestrings en los que aparece cada punto

					// Recorrer las coordenadas del MultiLineString y contar la cantidad de apariciones de cada punto
					multiLineString.getCoordinates().forEach(function(lineStringCoordinates) {
					  lineStringCoordinates.forEach(function(coordinate) {
						var coordinateKey = coordinate.toString();
						pointCount[coordinateKey] = (pointCount[coordinateKey] || 0) + 1;
					  });
					});
					var lastPointCoordinates = null;
					var point;
					// Recorrer las coordenadas y crear los puntos para aquellos que cruzan con 3 o más linestrings
					multiLineString.getCoordinates().forEach(function(lineStringCoordinates) {
					  lineStringCoordinates.forEach(function(coordinate) {
						var coordinateKey = coordinate.toString();
						if (pointCount[coordinateKey] >= 3) {
						  point = new ol.Feature({
							geometry: new ol.geom.Point(coordinate)
						  });
						  vectorLayer.getSource().addFeature(point);
						  lastPointCoordinates = coordinate;
						}
					  });
					});

					if (lastPointCoordinates) {
					  self.map.getView().setCenter(lastPointCoordinates);
					  self.map.getView().setZoom(19);
					}
					var coords3857 = point.getGeometry().getCoordinates();
					console.log('coordenada:',coords3857);


				})
				  .catch(function (error) {
					console.log('Error en la solicitud WFS:', error);
				  });
			  } else {
				alert('Por favor, ingresa los nombres de las calles.');
			  }
			},
		});
	};
	
	var drawInteraction;
	var dibujo;
	var finalizarButtonCreated = false;

	var buscarAmbulancias = function () {
	  if (!finalizarButtonCreated) {
		agregarBotonFinalizar(); // Agregar el botón "Finalizar" solo si no ha sido creado previamente
		finalizarButtonCreated = true;
	  }

	  if (drawInteraction) {
		self.map.removeInteraction(drawInteraction);
		drawInteraction = null; // Establecer drawInteraction como null para indicar que no hay interacción activa
	  } else {
		if (!dibujo) {
		  dibujo = new ol.layer.Vector({
			source: new ol.source.Vector(),
			style: new ol.style.Style({
			  fill: new ol.style.Fill({
				color: 'rgba(0, 0, 255, 0.2)' // Color de relleno del polígono
			  }),
			  stroke: new ol.style.Stroke({
				color: 'blue', // Color del borde del polígono
				width: 2 // Grosor del borde del polígono
			  })
			})
		  });
		  self.map.addLayer(dibujo);
		}

		drawInteraction = new ol.interaction.Draw({
		  type: 'Polygon',
		  // Configuraciones adicionales para la interacción de dibujo si es necesario
		  source: dibujo.getSource() // Utilizar la fuente de la capa vectorial para almacenar los polígonos dibujados
		});

		drawInteraction.on('drawend', function (event) {
		  var geometry = event.feature.getGeometry();
		  var coordinates = geometry.getCoordinates();
			//console.log(coordinates);
			
			 // Convertir las coordenadas en una cadena de texto separada por comas
		  var coordenadasTexto = coordinates[0].map(function(coordinate) {
			return coordinate.join(' ');
		  }).join(', ');
		  //console.log(coordenadasTexto);

		var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Arecorridos2&' +
		  'CQL_FILTER=INTERSECTS(ubicacion, POLYGON((' + coordenadasTexto + ')))&outputFormat=application/json';
		  // Realizar la consulta utilizando fetch
		  fetch(url)
			.then(function (response) {
			  if (response.ok) {
				return response.json();
			  } else {
				throw new Error('Error al realizar la consulta WFS');
			  }
			})
			.then(function (data) {
			  // Obtener las características resultantes de la respuesta
			  var features = data.features;
				
				  if (features.length > 0) {
					// Crear el contenido del Swal.fire con los atributos de las características
					var contenido = '<strong>Ambulancias Encontradas:</strong><br><br>';
					features.forEach(function (feature) {
					  var id = feature.id;
					  var nombre = feature.properties.nombre;
					  contenido += 'ID: ' + id + ', Nombre: ' + nombre + '<br><br>';
					});
				  }
				  // Mostrar el Swal.fire
				Swal.fire({
				  title: 'Ambulancias Encontradas:',
				  html: contenido,
				  icon: 'info',
				  confirmButtonText: 'Aceptar'
				});	  
			})
			.catch(function (error) {
			  console.error('Error al realizar la consulta WFS:', error);
			});
		});

		self.map.addInteraction(drawInteraction);
	  }
	};

	var agregarBotonFinalizar = function () {
	  var buttonElementFinalizar = document.createElement('button');
	  buttonElementFinalizar.textContent = 'Finalizar';
	  buttonElementFinalizar.addEventListener('click', function () {
		self.map.removeInteraction(drawInteraction);
		dibujo.getSource().clear();
		drawInteraction = null; // Establecer drawInteraction como null para indicar que no hay interacción activa
		this.remove(); // Remover el botón "Finalizar"
		finalizarButtonCreated = false; // Restablecer el estado del botón a no creado
	  });
	  buttonElementFinalizar.style.width = '100%';
	  buttonElementFinalizar.style.padding = '6px';

	  self.mainBarCustom.element.appendChild(buttonElementFinalizar); // Utilizar self en lugar de this para referirse a mainBarCustom
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
  
  var buttonElement2 = document.createElement('button');
	buttonElement2.textContent = 'Dibujar Calles';
	buttonElement2.addEventListener('click', buscarCalleDibujarLinea);
	buttonElement2.style.width = '100%';
	buttonElement2.style.padding = '6px';

	this.mainBarCustom.element.appendChild(buttonElement2);
	
	var buttonElement3 = document.createElement('button');
	buttonElement3.textContent = 'Buscar Ambulancias';
	buttonElement3.addEventListener('click', buscarAmbulancias);
	buttonElement3.style.width = '100%';
	buttonElement3.style.padding = '6px';

	this.mainBarCustom.element.appendChild(buttonElement3);
  
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
    function insertarFeature(nombreFeatureType, nombreFeature, nombreLayer, tipoGeometria, coords3857) {
	  console.log('Coordenadas en SRID 3857:', coords3857);

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

		  // Crear la geometría correspondiente
		  var geometry;
		  if (tipoGeometria === 'Point') {
			geometry = new ol.geom.Point(coords3857);
		  } else if (tipoGeometria === 'LineString') {
			geometry = new ol.geom.LineString(coords3857);
		  } else if (tipoGeometria === 'Polygon') {
			geometry = new ol.geom.Polygon(coords3857);
		  }

		  // Crear la característica con la geometría y el nombre
		  var feature = new ol.Feature({
			nombre: nombre,
			ubicacion: geometry
		  });

		  // Asignar cualquier otro atributo a la característica si es necesario
		  feature.setProperties({
			name: nombreFeature
		  });

		  // Crear una transacción WFS para insertar la característica
		  var wfs = new ol.format.WFS();
		  var insertRequest = wfs.writeTransaction([feature], null, null, {
			featureType: nombreFeatureType,
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
	}

	var controlPunto = new ol.control.Toggle({
	  title: 'Dibujar punto',
	  html: '<i class="fa fa-map-marker"></i>',
	  interaction: new ol.interaction.Draw({
		type: 'Point',
		source: this.vector.getSource()
	  })
	});

	controlPunto.getInteraction().on('drawend', function(event) {
	  var feature = event.feature;
	  var coords3857 = feature.getGeometry().getCoordinates();
	  insertarFeature('hospital2', 'Nuevo Punto', 'tsig2023', 'Point', coords3857);
	});

	barraDibujo.addControl(controlPunto);

	var controlLinea = new ol.control.Toggle({
	  title: 'Dibujar línea',
	  html: '<i class="fa fa-share-alt"></i>',
	  interaction: new ol.interaction.Draw({
		type: 'LineString',
		source: this.vector.getSource()
	  }),
	  bar: new ol.control.Bar({
		controls: [
		  new ol.control.TextButton({
			title: 'Deshacer ultimo punto',
			html: 'Deshacer',
			handleClick: function() {
			  controlLinea.getInteraction().removeLastPoint()
			}
		  }),
		  new ol.control.TextButton({
			title: 'Finalizar dibujo',
			html: 'Finalizar',
			handleClick: function() {
			  controlLinea.getInteraction().finishDrawing();
			}
		  })
		]
	  })
	});

	controlLinea.getInteraction().on('drawend', function(event) {
	  var feature = event.feature;
	  var coords3857 = feature.getGeometry().getCoordinates();
	  insertarFeature('recorridos2', 'Nueva Línea', 'tsig2023', 'LineString', coords3857);
	});

	barraDibujo.addControl(controlLinea);

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
				var selectedFeatures = controlSeleccionar.getInteraction().getFeatures();
				if (selectedFeatures.getLength() > 0) {
				  var selectedFeature = selectedFeatures.item(0);
				   var id = selectedFeature.getId();
					var nombre = selectedFeature.get('nombre');
					var tipo = selectedFeature.getGeometry().getType();
					 // Establecer los valores de los atributos en la característica seleccionada
					selectedFeature.set('id', id);
					selectedFeature.set('tipo', tipo);
					selectedFeature.set('nombree', nombre);
				
				  // Crear el Popup de OpenLayers si no existe
				  if (!popup) {
					popup = new ol.Overlay.PopupFeature({
					  popupClass: 'default anim',
					  select: controlSeleccionar.getInteraction(),
					  template: {
						attributes: {
							'id': { title: 'ID: ' },
							'nombree': { title: 'Nombre: ' },
							'tipo': { title: 'Tipo: ' }
						}
					  }
					});
					map.addOverlay(popup);
				  }
				  
				  // Mostrar el Popup en la posición de la característica seleccionada
				  popup.show(selectedFeature);
				}
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
				 var geometry = selectedFeature.getGeometry();
    
					// Determinar el valor de layerName según el tipo de geometría
					var layerName;
					if (geometry instanceof ol.geom.Point) {
					  layerName = 'hospital2';
					} else if (geometry instanceof ol.geom.LineString) {
					  layerName = 'recorridos2';
					} else if (geometry instanceof ol.geom.Polygon) {
					  layerName = 'zonas2';
					}
				  
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
					  eliminarEntidad(selectedFeature, layerName);
					}
				  });
				}
			  }
		  }),
			new ol.control.TextButton({
			  title: 'Editar',
			  html: 'Editar',
			  handleClick: function() {
				var selectedFeatures = controlSeleccionar.getInteraction().getFeatures();
				if (selectedFeatures.getLength() > 0) {
				  var selectedFeature = selectedFeatures.item(0);
				  console.log('Coordenadas antes de la modificación:', selectedFeature.getGeometry().getCoordinates());

				  // Crea la interacción de modificación y asigna la capa vectorial
				  var modifyInteraction = new ol.interaction.Modify({
					features: selectedFeatures,
				  });

				  // Agrega la interacción de modificación al mapa
				  map.addInteraction(modifyInteraction);

				  // Al finalizar la edición
				  modifyInteraction.on('modifyend', function(event) {
					// Obtén la geometría modificada
				  var modifiedGeometry = event.features.item(0).getGeometry();
				  var modifiedCoordinates = modifiedGeometry.getCoordinates();

				  // Mostrar las coordenadas antes y después de la modificación

				  // Actualiza la geometría de la característica
				  selectedFeature.getGeometry().setCoordinates(modifiedCoordinates);
				  console.log('Coordenadas después de la modificación:', selectedFeature.getGeometry().getCoordinates());

				  // Determinar el valor de layerName según el tipo de geometría
				  var layerName;
				  if (modifiedGeometry instanceof ol.geom.Point) {
					layerName = 'hospital2';
				  } else if (modifiedGeometry instanceof ol.geom.LineString) {
					layerName = 'recorridos2';
				  } else if (modifiedGeometry instanceof ol.geom.Polygon) {
					layerName = 'zonas2';
				  }

				  // Guarda los cambios en la base de datos
				  guardarCambios(selectedFeature, layerName);
				  });
				}
			  }
			})
		]
	  })
	});
	
	controlSeleccionar.on('change:active', function(evt) {
	  if (evt.active) {
		//crearBufferDistancia();  
		obtenerDatosCapas(); 
	  } else {
		eliminarVectorSource();
		desactivarPopup();	
		eliminarCapaDistancia();
	  }
	});
	
	var popup;
	
	function desactivarPopup() {
	  if (popup) {
		map.removeOverlay(popup);
		popup = null;
	  }
	}
	
	function guardarCambios(feature, nombrecapa) {
	  // Crear una transacción WFS para actualizar la característica
	  var wfs = new ol.format.WFS();
	  var updateRequest = wfs.writeTransaction(null, [feature], null, {
		featureType: nombrecapa,
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
		body: new XMLSerializer().serializeToString(updateRequest)
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

	// Función para eliminar una entidad
	function eliminarEntidad(feature, layerName) {
	  // Crear una transacción WFS para eliminar 
	  var wfs = new ol.format.WFS();
	  var deleteRequest = wfs.writeTransaction(null, null, [feature], {
		featureType: layerName,
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
	
	function obtenerDatosCapas() {
	  // Obtén los datos de las capas como GML
	  var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Ahospital2,tsig2023%3Arecorridos2,tsig2023%3Azonas2';

	  fetch(url)
		.then(function(response) {
		  return response.text();
		})
		.then(function(data) {
		  // Crea la fuente de vector con los datos obtenidos
		  var vectorSource = new ol.source.Vector({
			features: new ol.format.WFS().readFeatures(data)
		  });
		  
		  vectorSource.forEachFeature(function(feature) {
			var geometry = feature.getGeometry();
			var coordinates = geometry.getCoordinates();
			geometry.setCoordinates(coordinates);
		  });

		  // Agrega la fuente de vector a la capa vectorial existente
		  if (self.vector) {
			self.vector.setSource(vectorSource);
		  }
		  
		})
		.catch(function(error) {
		  console.error('Error al obtener los datos de las capas:', error);
		});
	}
	
	function eliminarVectorSource() {
	  // Elimina la fuente de vector de la capa vectorial existente
	  if (self.vector) {
		self.vector.setSource(null);
	  }
	}

	barraDibujo.addControl(controlSeleccionar);
	/*
	function crearBufferDistancia(){
		if (!controlSeleccionar.getActive()) {
			return; // Si la opción de selección no está activa, no se ejecuta el resto del código
		}
		// Obtén los datos de la capa "recorridos2" como JSON
		var url = 'http://localhost:8586/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023:recorridos2&outputFormat=application/json';

		fetch(url)
		  .then(function(response) {
			return response.json();
		  })
		  .then(function(data) {
			// Crea la fuente de vector con los datos obtenidos
			var vectorSource = new ol.source.Vector({
			  features: new ol.format.GeoJSON().readFeatures(data)
			});

			// Crea el polígono alrededor de cada feature
			vectorSource.forEachFeature(function(feature) {
			  var geometry = feature.getGeometry();
			  var extent = geometry.getExtent();
			  var polygonGeometry = ol.geom.Polygon.fromExtent(extent);
			  feature.setGeometry(polygonGeometry);
			});

			// Crea la capa de polígonos
			var capaDistancia = new ol.layer.Vector({
			  title: 'Distancia Desvio',
			  visible:false,
			  source: vectorSource,
			  style: new ol.style.Style({
				fill: new ol.style.Fill({
				  color: 'rgba(0, 0, 255, 0.5)'
				}),
				stroke: new ol.style.Stroke({
				  color: 'rgba(0, 0, 255, 1)',
				  width: 2
				})
			  })
			});

			// Agrega la capa de polígonos al mapa existente
			map.addLayer(capaDistancia);
		  })
		  .catch(function(error) {
			console.error('Error al obtener los datos de la capa de líneas:', error);
		  });
	}

	function eliminarCapaDistancia() {
	  var layers = map.getLayers().getArray();
	  var index = layers.findIndex(function(layer) {
		return layer.get('title') === 'Distancia Desvio';
	  });

	  if (index !== -1) {
		map.removeLayer(layers[index]);
	  }
	}
	*/
}
function crearCapaMapaCalor(){
		// Obtén los datos de la capa Hospital como JSON
		var url = 'http://localhost:8586/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023:hospital2&outputFormat=application/json';

		fetch(url)
		  .then(function(response) {
			return response.json();
		  })
		  .then(function(data) {
			// Crea la fuente de vector con los datos obtenidos
			var vectorSource = new ol.source.Vector({
			  features: new ol.format.GeoJSON().readFeatures(data)
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
			map.addLayer(heatmapLayer);
		  });
	}
crearCapaMapaCalor();