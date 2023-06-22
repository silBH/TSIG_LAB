// Carga las definiciones de proyección EPSG:32721 y EPSG:3857
proj4.defs("EPSG:32721", "+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs");

// Registra las definiciones de proyección en OpenLayers
ol.proj.proj4.register(proj4);

const ubiUsuario = [-6253611.066855117, -4141044.3788586617];
console.log('Ubicacion del Usuario: ', ubiUsuario);

function GeoMap() {
	this.map = null;
	this.mainBarCustom = null;
	this.vector = null;
}
////CAPAS//////////
var lyrOSM = new ol.layer.Tile({
	title: 'Open Street Map',
	visible: true,
	baseLayer: true,
	source: new ol.source.OSM()
});

var lyrEjes = new ol.layer.Tile({
	title: 'ft_01_ejes',
	visible: false,
	source: new ol.source.TileWMS({
		url: 'http://localhost:8586/geoserver/wms?',
		params: {
			VERSION: '1.1.1',
			FORMAT: 'image/png',
			TRANSPARENT: true,
			LAYERS: 'tsig2023:ft_01_ejes'
		}
	})
});

var lyrLinea2 = new ol.layer.Tile({
	title: 'Recorrido',
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://localhost:8586/geoserver/wms?',
		params: {
			VERSION: '1.1.1',
			FORMAT: 'image/png',
			TRANSPARENT: true,
			LAYERS: 'tsig2023:ambulancia'
		}
	})
})

var lyrPunto2 = new ol.layer.Tile({
	title: 'Hospital',
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://localhost:8586/geoserver/wms?',
		params: {
			VERSION: '1.1.1',
			FORMAT: 'image/png',
			TRANSPARENT: true,
			STYLES: 'puntoGeneral',
			LAYERS: 'tsig2023:servicioemergencia'
		}
	})
})

var lyrUsuario2 = new ol.layer.Tile({
	title: 'Usuario',
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://localhost:8586/geoserver/wms?',
		params: {
			VERSION: '1.1.1',
			FORMAT: 'image/png',
			TRANSPARENT: true,
			LAYERS: 'tsig2023:usuario2'
		}
	})
})

var lyrServicios = new ol.layer.Tile({
	title: 'Servicios Emergencia',
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://localhost:8586/geoserver/wms?',
		params: {
			VERSION: '1.1.1',
			FORMAT: 'image/png',
			TRANSPARENT: true,
			LAYERS: 'tsig2023:servicioemergencia'
		}
	})
});

var lyrAmbulancias = new ol.layer.Tile({
	title: 'Ambulancias',
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://localhost:8586/geoserver/wms?',
		params: {
			VERSION: '1.1.1',
			FORMAT: 'image/png',
			TRANSPARENT: true,
			LAYERS: 'tsig2023:ambulancia'
		}
	})
});

var lyrZonas = new ol.layer.Tile({
	title: 'zonas',
	visible: true,
	opacity: 0.4,
	source: new ol.source.TileWMS({
		url: 'http://localhost:8586/geoserver/wms?',
		params: {
			VERSION: '1.1.1',
			FORMAT: 'image/png',
			TRANSPARENT: true,
			LAYERS: 'tsig2023:zona'
		}
	})
});

////CAPAS//////////
GeoMap.prototype.CrearMapa = function (target, center, zoom) {
	var _target = target || 'map',
		_center = center || [-6253611.066855117, -4141044.3788586617],
		_zoom = zoom || 10;

	this.map = new ol.Map({
		target: _target,
		layers: [lyrOSM, lyrLinea2, lyrPunto2, lyrzona, lyrUsuario2, lyrEjes],
		view: new ol.View({
			center: (_center),
			zoom: _zoom
		})
	});
	/*
	  var layerSwitcher = new ol.control.LayerSwitcher({
		  tipLabel: 'Leyenda', 
		  groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
	  });
  
	  this.map.addControl(layerSwitcher);
	  */
	map = this.map;
};

GeoMap.prototype.CrearMapaAdmin = function (target, center, zoom) {
	var _target = target || 'map',
		_center = center || [-6253611.066855117, -4141044.3788586617],
		_zoom = zoom || 30;

	this.map = new ol.Map({
		target: _target,
		layers: [lyrOSM, lyrServicios, lyrAmbulancias, lyrZonas],
		view: new ol.View({
			center: (_center),
			zoom: _zoom
		})
	});

	var layerSwitcher = new ol.control.LayerSwitcher({
		tipLabel: 'Leyenda',
		groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
	});
	this.map.addControl(layerSwitcher);
	map = this.map;
};

GeoMap.prototype.updateGeoserverLayer = function (cqlFilter) {
	lyrPunto2.getSource().updateParams({
		'CQL_FILTER': cqlFilter
	});

	lyrzona.getSource().updateParams({
		'CQL_FILTER': cqlFilter
	});

	lyrLinea2.getSource().updateParams({
		'CQL_FILTER': cqlFilter
	});
};

GeoMap.prototype.CrearControlBarra = function () {
	var mainBar = new ol.control.Bar();
	this.map.addControl(mainBar);
	//mainBar.addControl(new ol.control.FullScreen());
	//mainBar.addControl(new ol.control.Rotate());	
	//mainBar.addControl(new ol.control.ZoomToExtent({extent:[-6276100,-4132519, -6241733,-4132218]}));
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
		title: 'Punto Interseccion',
		visible: true,
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
		title: 'Calles Interseccion',
		visible: false,
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
		var nombreCalleInput = document.getElementById('nombre-calle-input').value;
		var numeroPuertaInput = document.getElementById('numero-puerta-input').value;

		var nombreCalle = nombreCalleInput.trim();
		var numeroPuerta = numeroPuertaInput.trim();

		if (nombreCalle && numeroPuerta) {
			// Realizar la solicitud de geocodificación
			var direccionGeocodificada = nombreCalle + ' ' + numeroPuerta;
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
						self.map.getView().setZoom(15);

						// Crear el marcador en la ubicación encontrada
						var marker = new ol.Feature({
							geometry: new ol.geom.Point(ol.proj.fromLonLat([longitud, latitud])),
						});

						vectorLayer.getSource().clear();
						vectorLayer.getSource().addFeature(marker);

						// Obtener las coordenadas del marcador
						var coords3857 = marker.getGeometry().getCoordinates();

						// Convertir las coordenadas de EPSG:3857 a EPSG:32721 utilizando proj4
						// var coords32721 = proj4('EPSG:3857', 'EPSG:32721', coords3857);

						// Mostrar las coordenadas transformadas en la consola
						console.log('Coordenadas 3857:', coords3857);
						// console.log('Coordenadas 32721:', coords32721);
						var coordenadasTexto = coords3857.join(' ');
						console.log(coordenadasTexto);
						emergenciaFueraZona(coordenadasTexto)
							.then(resultado => {
								if (resultado.codigoRetorno === 0) {
									ambulanciasCercana(coords3857);
								}
							})
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
			alert('Por favor, ingresa la calle y el número.');
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
							multiLineString.getCoordinates().forEach(function (lineStringCoordinates) {
								lineStringCoordinates.forEach(function (coordinate) {
									var coordinateKey = coordinate.toString();
									pointCount[coordinateKey] = (pointCount[coordinateKey] || 0) + 1;
								});
							});
							var lastPointCoordinates = null;
							var point;
							// Recorrer las coordenadas y crear los puntos para aquellos que cruzan con 3 o más linestrings
							multiLineString.getCoordinates().forEach(function (lineStringCoordinates) {
								lineStringCoordinates.forEach(function (coordinate) {
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
							console.log('coordenada:', coords3857);
							var coordenadasTexto = coords3857.join(' ');
							console.log(coordenadasTexto);
							emergenciaFueraZona(coordenadasTexto)
								.then(resultado => {
									if (resultado.codigoRetorno === 0) {
										ambulanciasCercana(coords3857);
									}
								})
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

	var buscarAmbulancias = function () {
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
				source: dibujo.getSource() // Utilizar la fuente de la capa vectorial para almacenar los polígonos dibujados
			});

			drawInteraction.on('drawend', function (event) {
				var geometry = event.feature.getGeometry();
				var coordinates = geometry.getCoordinates();
				//console.log(coordinates);

				// Convertir las coordenadas en una cadena de texto separada por comas
				var coordenadasTexto = coordinates[0].map(function (coordinate) {
					return coordinate.join(' ');
				}).join(', ');
				//console.log(coordenadasTexto);

				var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Aambulancia&' +
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
						var features = data.features;
						var contenido = '';
						var titulo;

						if (features.length > 0) {
							var titulo1 = '<strong>Ambulancias Encontradas:</strong><br><br>';
							features.forEach(function (feature) {
								var id = feature.id;
								var nombre = feature.properties.nombre;
								contenido += 'ID: ' + id + ', Nombre: ' + nombre + '<br><br>';
							});
							titulo = titulo1;
						} else {
							var titulo2 = 'No se encontraron ambulancias.';
							titulo = titulo2;
						}

						Swal.fire({
							title: titulo,
							html: contenido,
							icon: 'info',
							confirmButtonText: 'Aceptar'
						}).then(function () {
							dibujo.getSource().clear();
							self.map.removeInteraction(drawInteraction);
							drawInteraction = null;
						});
					})
					.catch(function (error) {
						console.error('Error al realizar la consulta WFS:', error);
					});
			});

			self.map.addInteraction(drawInteraction);
		}
	};

	function ambulanciasCercana(coords3857) {
		// Realizar la consulta WFS
		fetch('http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Aambulancia&outputFormat=application/json')
			.then(response => response.json())
			.then(data => {
				// Ordenar las features por distancia ascendente desde el punto de referencia
				data.features.sort((a, b) => {
					const distA = getDistance(coords3857[0], coords3857[1], a.geometry.coordinates[0][0], a.geometry.coordinates[0][1]);
					const distB = getDistance(coords3857[0], coords3857[1], b.geometry.coordinates[0][0], b.geometry.coordinates[0][1]);
					return distA - distB;
				});

				// Obtener la feature más cercana (primera feature después de la ordenación)
				const closestFeature = data.features[0];

				// Obtener el atributo 'nombre' de la feature más cercana
				const nombre = closestFeature.properties.nombre;
				console.log(nombre);

				Swal.fire({
					title: 'Ambulancia solicitada correctamente',
					text: 'Ambulancia ' + nombre + ' solicitada correctamente',
					icon: 'success',
					showCancelButton: false,
					confirmButtonColor: '#3085d6',
					confirmButtonText: 'Aceptar'
				});
			})
			.catch(error => {
				console.error('Error al realizar la consulta WFS:', error);
			});

		// Función para calcular la distancia entre dos puntos en coordenadas EPSG:3857
		function getDistance(x1, y1, x2, y2) {
			return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		}
	}

	function buscarAmbulanciasYServiciosEmergencia() {
		var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Azona&outputFormat=application/json&CQL_FILTER=INTERSECTS(ubicacion, POINT(' + ubiUsuario[0] + ' ' + ubiUsuario[1] + '))';

		fetch(url)
			.then(response => response.json())
			.then(data => {
				var features = data.features;

				if (features.length === 0) {
					// No se encontraron features
					Swal.fire({
						icon: 'info',
						title: 'Sin cobertura',
						text: 'No hay ambulancias ni servicios de emergencia con cobertura en tu ubicación.'
					});
				} else {
					var promises = features.map(feature => {
						var nombreA = feature.properties.nombre;
						console.log('Ambulancia: ', nombreA);
						var coordenadasTexto = feature.geometry.coordinates[0]
							.map(coordinate => coordinate.join(' '))
							.join(', ');

						return emergenciaDentroZona(coordenadasTexto)
							.then(resultado => {
								if (resultado.codigoRetorno === 0) {
									var nombreObtenido = resultado.nombre;
									console.log('Servicio de Emergencia: ', nombreObtenido);

									return nombreObtenido;
								}
							})
							.catch(error => {
								console.error('Error en la función emergenciaDentroZona:', error);
							});
					});

					Promise.all(promises)
						.then(nombresObtenidos => {
							var cqlFilter = 'IN(' + features.map(feature => "'" + feature.id + "'").join(',') + ')';

							lyrzona.getSource().updateParams({
								'CQL_FILTER': cqlFilter
							});

							var contenido = 'Ambulancias en tu ubicación:<br><ul>';
							for (var i = 0; i < features.length; i++) {
								contenido += '<li>' + features[i].properties.nombre + '</li>';
							}
							contenido += '</ul><br>Servicios de Emergencia en tu ubicación:<br><ul>';
							for (var j = 0; j < nombresObtenidos.length; j++) {
								contenido += '<li>' + nombresObtenidos[j] + '</li>';
							}
							contenido += '</ul>';

							Swal.fire({
								icon: 'success',
								title: 'Ambulancias y Servicios de Emergencia en tu ubicación',
								html: contenido
							});
						})
						.catch(error => {
							console.error('Error en Promise.all:', error);
						});
				}
			})
			.catch(error => {
				console.error('Error al realizar la consulta WFS:', error);
			});
	}

	var nombreCalleInputElement = document.createElement('input');
	nombreCalleInputElement.setAttribute('id', 'nombre-calle-input');
	nombreCalleInputElement.setAttribute('placeholder', 'Nombre de la calle');
	nombreCalleInputElement.setAttribute('type', 'text');

	var numeroPuertaInputElement = document.createElement('input');
	numeroPuertaInputElement.setAttribute('id', 'numero-puerta-input');
	numeroPuertaInputElement.setAttribute('placeholder', 'Numero de puerta');
	numeroPuertaInputElement.setAttribute('type', 'text');

	var buttonElement = document.createElement('button');
	buttonElement.textContent = 'Solicitar';
	buttonElement.addEventListener('click', buscarDireccion);
	buttonElement.style.width = '100%'; // Ajusta el ancho del botón al 100%
	buttonElement.style.padding = '6px'; // Ajusta el relleno del botón

	this.mainBarCustom.element.appendChild(nombreCalleInputElement);
	this.mainBarCustom.element.appendChild(numeroPuertaInputElement);
	this.mainBarCustom.element.appendChild(buttonElement);

	var buttonElement2 = document.createElement('button');
	buttonElement2.textContent = 'Solicitar Ambulancia en un cruce';
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

	var buttonElement4 = document.createElement('button');
	buttonElement4.textContent = 'Buscar Ambulancias y S. Emergencia cerca';
	buttonElement4.addEventListener('click', buscarAmbulanciasYServiciosEmergencia);
	buttonElement4.style.width = '100%';
	buttonElement4.style.padding = '6px';

	this.mainBarCustom.element.appendChild(buttonElement4);

	var buttonElement5 = document.createElement('button');
	buttonElement5.textContent = 'Servicio de Emergencia con más ambulancias';
	buttonElement5.addEventListener('click', emergenciaConMayorAmbulancias);
	buttonElement5.style.width = '100%';
	buttonElement5.style.padding = '6px';

	this.mainBarCustom.element.appendChild(buttonElement5);
};

GeoMap.prototype.CrearControlBarraDibujo = function () {
	var self = this;

	if (!this.mainBarCustom) {
		this.mainBarCustom = new ol.control.Bar();
		this.map.addControl(this.mainBarCustom);
		this.mainBarCustom.setPosition('top');
	}

	var estiloDibujo = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(35, 163, 12, 0.5)'
		}),
		stroke: new ol.style.Stroke({
			color: '#23a30c',
			width: 5
		}),
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
				color: '#23a30c'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(35, 163, 12, 0.5)',
				width: 8
			}),
		})
	});

	if (!this.vector) {
		this.vector = new ol.layer.Vector({
			title: 'Capa de dibujo',
			displayInLayerSwitcher: false,
			source: new ol.source.Vector(),
			style: estiloDibujo
		});
		this.map.addLayer(this.vector);
	}

	var barraDibujo = new ol.control.Bar({
		group: true,
		toggleOne: true
	});
	this.mainBarCustom.addControl(barraDibujo);


	var controlModificar = new ol.interaction.Modify({ source: this.vector.getSource() });
	this.map.addInteraction(controlModificar);

	//////////////////////////////////////////////////
	function actualizarFeature() {
		if (lyrLinea2.getSource()) {
			var sourceLinea2 = new ol.source.TileWMS({
				url: 'http://localhost:8586/geoserver/wms?',
				params: {
					VERSION: '1.1.1',
					FORMAT: 'image/png',
					TRANSPARENT: true,
					LAYERS: 'tsig2023:ambulancia',
					_ts: Date.now() // Agregar un sello de tiempo único
				}
			});
			lyrLinea2.setSource(sourceLinea2);
		}

		if (lyrPunto2.getSource()) {
			var sourcePunto2 = new ol.source.TileWMS({
				url: 'http://localhost:8586/geoserver/wms?',
				params: {
					VERSION: '1.1.1',
					FORMAT: 'image/png',
					TRANSPARENT: true,
					STYLES: 'puntoGeneral',
					LAYERS: 'tsig2023:servicioemergencia',
					_ts: Date.now() // Agregar un sello de tiempo único
				}
			});
			lyrPunto2.setSource(sourcePunto2);
		}

		if (lyrzona.getSource()) {
			var sourcezona = new ol.source.TileWMS({
				url: 'http://localhost:8586/geoserver/wms?',
				params: {
					VERSION: '1.1.1',
					FORMAT: 'image/png',
					TRANSPARENT: true,
					LAYERS: 'tsig2023:zona',
					_ts: Date.now() // Agregar un sello de tiempo único
				}
			});
			lyrzona.setSource(sourcezona);
		}
	}

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
				var wfs = new ol.format.WFS();
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

				// Si el tipo de geometría es LineString, crear una característica de tipo polígono (zona de cobertura)
				if (tipoGeometria === 'LineString') {
					// Crear el buffer alrededor de la geometría LineString basado en la distancia máxima de desvío
					var buffer = ol.extent.buffer(geometry.getExtent(), 100); // Reemplaza 100 con la distancia máxima de desvío deseada
					// Crear la geometría de polígono para la zona de cobertura
					var polygonGeometry = new ol.geom.Polygon.fromExtent(buffer);
					console.log(polygonGeometry.getCoordinates());
					// Crear la característica de la zona de cobertura
					var zonaCoberturaFeature = new ol.Feature({
						nombre: nombre,
						ubicacion: polygonGeometry
					});

					// Asignar cualquier otra propiedad necesaria a la característica de la zona de cobertura
					zonaCoberturaFeature.setProperties({
						name: nombreFeature
					});

					// Crear una transacción WFS para insertar la característica de la zona de cobertura
					var zonaCoberturaInsertRequest = wfs.writeTransaction([zonaCoberturaFeature], null, null, {
						featureType: 'zona',
						featureNS: 'tsig2023',
						srsName: 'EPSG:3857',
						version: '1.1.0'
					});

					// Enviar la solicitud WFS al servidor para insertar la característica de la zona de cobertura
					fetch('http://localhost:8586/geoserver/tsig2023/wfs', {
						method: 'POST',
						headers: {
							'Content-Type': 'text/xml'
						},
						body: new XMLSerializer().serializeToString(zonaCoberturaInsertRequest)
					})
						.then(response => response.text())
						.then(data => {
							console.log('Respuesta del servidor (zona de cobertura):', data);
						})
						.catch(error => {
							console.error('Error al realizar la solicitud WFS (zona de cobertura):', error);
						});
				}

				// Crear una transacción WFS para insertar la característica principal
				var insertRequest = wfs.writeTransaction([feature], null, null, {
					featureType: nombreFeatureType,
					featureNS: 'tsig2023',
					srsName: 'EPSG:3857',
					version: '1.1.0'
				});

				// Enviar la solicitud WFS al servidor para insertar la característica principal
				fetch('http://localhost:8586/geoserver/tsig2023/wfs', {
					method: 'POST',
					headers: {
						'Content-Type': 'text/xml'
					},
					body: new XMLSerializer().serializeToString(insertRequest)
				})
					.then(response => response.text())
					.then(data => {
						console.log('Respuesta del servidor (característica principal):', data);
						actualizarFeature();
					})
					.catch(error => {
						console.error('Error al realizar la solicitud WFS (característica principal):', error);
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

	controlPunto.getInteraction().on('drawend', function (event) {
		var feature = event.feature;
		var coords3857 = feature.getGeometry().getCoordinates();
		insertarFeature('servicioemergencia', 'Nuevo Punto', 'tsig2023', 'Point', coords3857);
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
					handleClick: function () {
						controlLinea.getInteraction().removeLastPoint()
					}
				}),
				new ol.control.TextButton({
					title: 'Finalizar dibujo',
					html: 'Finalizar',
					handleClick: function () {
						controlLinea.getInteraction().finishDrawing();
					}
				})
			]
		})
	});

	controlLinea.getInteraction().on('drawend', function (event) {
		var feature = event.feature;
		var coords3857 = feature.getGeometry().getCoordinates();
		geometry = new ol.geom.LineString(coords3857);
		var buffer = ol.extent.buffer(geometry.getExtent(), 100);
		var polygonGeometry = new ol.geom.Polygon.fromExtent(buffer);
		//console.log(polygonGeometry.getCoordinates());
		var coords = polygonGeometry.getCoordinates();
		var coordenadasTexto = coords[0].map(function (coordinate) {
			return coordinate.join(' ');
		}).join(', ');
		//console.log(coordenadasTexto);
		emergenciaDentroZona(coordenadasTexto);
		insertarFeature('ambulancia', 'Nueva Línea', 'tsig2023', 'LineString', coords3857);
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
					handleClick: function () {
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
					handleClick: function () {
						var selectedFeatures = controlSeleccionar.getInteraction().getFeatures();
						if (selectedFeatures.getLength() > 0) {
							var selectedFeature = selectedFeatures.item(0);
							var nombre = selectedFeature.get('nombre');
							var id = selectedFeature.getId();
							var geometry = selectedFeature.getGeometry();

							// Determinar el valor de layerName según el tipo de geometría
							var layerName;
							if (geometry instanceof ol.geom.Point) {
								layerName = 'servicioemergencia';
								var coords = selectedFeature.getGeometry().getCoordinates();
								var modifiedCoordsText = coords.slice(0, 2).join(' ');
								console.log(modifiedCoordsText);
								emergenciaFueraZona(modifiedCoordsText)
									.then(resultado => {
										if (resultado.codigoRetorno === 0) {
											Swal.fire({
												icon: 'error',
												title: 'No es posible eliminar',
												text: 'La ambulancia tiene que tener un Servicio de Emergencia dentro de su zona'
											});
										} else {
											Swal.fire({
												title: 'Eliminar',
												html: '¿Eliminar ID: ' + id + ' y nombre: ' + nombre + '?',
												icon: 'question',
												showCancelButton: true,
												confirmButtonText: 'Eliminar',
												cancelButtonText: 'Cancelar'
											}).then(function (result) {
												if (result.isConfirmed) {
													eliminarEntidad(selectedFeature, layerName);
													actualizarFeature();
													selectedFeature = null;
												}
											});
										}
									})
									.catch(error => {
										console.error('Error en la función emergenciaDentroZona:', error);
									});
							} else if (geometry instanceof ol.geom.LineString) {
								layerName = 'ambulancia';
								Swal.fire({
									title: 'Eliminar',
									html: '¿Eliminar ID: ' + id + ' y nombre: ' + nombre + '?',
									icon: 'question',
									showCancelButton: true,
									confirmButtonText: 'Eliminar',
									cancelButtonText: 'Cancelar'
								}).then(function (result) {
									if (result.isConfirmed) {
										var getFeatureUrl = 'http://localhost:8586/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023:zona&CQL_FILTER=nombre%20%3D%20%27' + nombre + '%27&outputFormat=application/json';
										fetch(getFeatureUrl)
											.then(function (response) {
												return response.json();
											})
											.then(function (data) {
												var features = data.features;
												if (features.length > 0) {
													var featureId = features[0].id; // Obtener el ID de la feature
													console.log(featureId);

													var deleteFeatureUrl = 'http://localhost:8586/geoserver/wfs';
													var typeName = 'tsig2023:zona';
													var xmlData = '<wfs:Transaction xmlns:wfs="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Delete typeName="' + typeName + '"><ogc:Filter><ogc:FeatureId fid="' + featureId + '"/></ogc:Filter></wfs:Delete></wfs:Transaction>';

													var deleteFeatureRequest = fetch(deleteFeatureUrl, {
														method: 'POST',
														headers: {
															'Content-Type': 'text/xml'
														},
														body: xmlData
													});
													Promise.all([deleteFeatureRequest])
														.then(function (responses) {
															// Verificar si todas las respuestas son exitosas
															var allSuccessful = responses.every(function (response) {
																return response.ok;
															});

															if (allSuccessful) {
																console.log('Todas las operaciones se completaron correctamente');
																// Realizar otras acciones después de eliminar la feature
																actualizarFeature();
																selectedFeature = null;
																eliminarVectorSource();
															} else {
																console.error('Al menos una operación falló');
															}
														})
														.catch(function (error) {
															console.error('Error al enviar la solicitud WFS:', error);
														});
												} else {
													console.log('No se encontró ninguna feature con el nombre especificado');
												}
											})
											.catch(function (error) {
												console.error('Error al obtener la feature de Polygon:', error);
											});
										eliminarEntidad(selectedFeature, layerName);
										actualizarFeature();
										selectedFeature = null;
									}
								});
							}
						}
					}
				}),
				new ol.control.TextButton({
					title: 'Editar',
					html: 'Editar',
					handleClick: function () {
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
							modifyInteraction.on('modifyend', function (event) {
								// Obtén la geometría modificada
								var modifiedGeometry = event.features.item(0).getGeometry();
								var modifiedCoordinates = modifiedGeometry.getCoordinates();

								// Actualiza la geometría de la característica
								selectedFeature.getGeometry().setCoordinates(modifiedCoordinates);
								console.log('Coordenadas después de la modificación:', selectedFeature.getGeometry().getCoordinates());

								// Determinar el valor de layerName según el tipo de geometría
								var layerName;
								if (modifiedGeometry instanceof ol.geom.Point) {
									layerName = 'servicioemergencia';
									var coords = selectedFeature.getGeometry().getCoordinates();
									var modifiedCoordsText = coords.slice(0, 2).join(' ');
									console.log(modifiedCoordsText);

									emergenciaFueraZona(modifiedCoordsText)
										.then(resultado => {
											if (resultado.codigoRetorno === 0) {
												guardarCambios(selectedFeature, layerName);
												actualizarFeature();
												selectedFeatures.clear();
											} else {
												actualizarFeature();
												selectedFeatures.clear();
												eliminarVectorSource();
											}
										})
										.catch(error => {
											console.error('Error en la función emergenciaDentroZona:', error);
										});
								} else if (modifiedGeometry instanceof ol.geom.LineString) {
									layerName = 'ambulancia';
									guardarCambios(selectedFeature, layerName);
									actualizarFeature();
									selectedFeatures.clear();
								} else if (modifiedGeometry instanceof ol.geom.Polygon) {
									layerName = 'zona';
									var coords = selectedFeature.getGeometry().getCoordinates();
									var coordenadasTexto = coords[0].map(function (coordinate) {
										return coordinate.join(' ');
									}).join(', ');
									var coordenadas = coordenadasTexto.replace(/\s\d/g, '');
									//console.log(coordenadas);
									emergenciaDentroZona(coordenadas)
										.then(resultado => {
											if (resultado.codigoRetorno === 1) {
												//modificar
											}
											guardarCambios(selectedFeature, layerName);
											actualizarFeature();
											selectedFeatures.clear();
										})
										.catch(error => {
											console.error('Error en la función emergenciaDentroZona:', error);
										});
								}
							});
						}
					}
				}),
			]
		})
	});
	controlSeleccionar.on('change:active', function (evt) {
		if (evt.active) {
			obtenerDatosCapas();
		} else {
			eliminarVectorSource();
			desactivarPopup();
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
		return new Promise(function (resolve, reject) {
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
				.then(function (response) {
					return response.text();
				})
				.then(function (data) {
					console.log('Respuesta del servidor:', data);
					// Procesar la respuesta del servidor aquí
					resolve();
				})
				.catch(function (error) {
					console.error('Error al realizar la solicitud WFS:', error);
					reject(error);
				});
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
		var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Aservicioemergencia,tsig2023%3Aambulancia,tsig2023%3Azona';

		fetch(url)
			.then(function (response) {
				return response.text();
			})
			.then(function (data) {
				// Crea la fuente de vector con los datos obtenidos
				var vectorSource = new ol.source.Vector({
					features: new ol.format.WFS().readFeatures(data)
				});

				vectorSource.forEachFeature(function (feature) {
					var geometry = feature.getGeometry();
					var coordinates = geometry.getCoordinates();
					geometry.setCoordinates(coordinates);
				});

				// Agrega la fuente de vector a la capa vectorial existente
				if (self.vector) {
					self.vector.setSource(vectorSource);
				}
			})
			.catch(function (error) {
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
}

GeoMap.prototype.CrearBarraBusquedaCalleNumeroSeparado = function () {
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
				radius: 10,
				fill: new ol.style.Fill({
					color: 'red',
				}),
			}),
		}),
	});

	this.map.addLayer(vectorLayer);

	var buscarDireccion = function () {
		var nombreCalleInput = document.getElementById('nombre-calle-input').value;
		var numeroPuertaInput = document.getElementById('numero-puerta-input').value;

		var nombreCalle = nombreCalleInput.trim();
		var numeroPuerta = numeroPuertaInput.trim();

		if (nombreCalle && numeroPuerta) {
			// Realizar la solicitud de geocodificación
			var direccionGeocodificada = nombreCalle + ' ' + numeroPuerta;
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
						self.map.getView().setZoom(10);

						// Crear el marcador en la ubicación encontrada
						var marker = new ol.Feature({
							geometry: new ol.geom.Point(ol.proj.fromLonLat([longitud, latitud])),
						});

						vectorLayer.getSource().clear();
						vectorLayer.getSource().addFeature(marker);

						// Obtener las coordenadas del marcador
						var coords3857 = marker.getGeometry().getCoordinates();

						// Convertir las coordenadas de EPSG:3857 a EPSG:32721 utilizando proj4
						// var coords32721 = proj4('EPSG:3857', 'EPSG:32721', coords3857);

						// Mostrar las coordenadas transformadas en la consola
						console.log('Coordenadas 3857:', coords3857);
						// console.log('Coordenadas 32721:', coords32721);

						// Construir el filtro CQL utilizando las coordenadas transformadas
						//var cqlFilter = "DWITHIN(ubicacion, POINT(" + coords3857[0] + " " + coords3857[1] + "), 1000, meters)";
						//self.updateGeoserverLayer(cqlFilter);
					} else {
						alert('No se pudo encontrar la dirección.');
					}
				})
				.catch(function (error) {
					console.error('Error al realizar la solicitud de geocodificación:', error);
					alert('Error al buscar la dirección.');
				});
		} else {
			alert('Por favor, ingresa la calle y el número.');
		}
	};

	var nombreCalleInputElement = document.createElement('input');
	nombreCalleInputElement.setAttribute('id', 'nombre-calle-input');
	nombreCalleInputElement.setAttribute('placeholder', 'Nombre de la calle');
	nombreCalleInputElement.setAttribute('type', 'text');

	var numeroPuertaInputElement = document.createElement('input');
	numeroPuertaInputElement.setAttribute('id', 'numero-puerta-input');
	numeroPuertaInputElement.setAttribute('placeholder', 'Numero de puerta');
	numeroPuertaInputElement.setAttribute('type', 'text');

	var buttonElement = document.createElement('button');
	buttonElement.textContent = 'Buscar';
	buttonElement.addEventListener('click', buscarDireccion);
	buttonElement.style.width = '100%'; // Ajusta el ancho del botón al 100%
	buttonElement.style.padding = '6px'; // Ajusta el relleno del botón

	this.mainBarCustom.element.appendChild(nombreCalleInputElement);
	this.mainBarCustom.element.appendChild(numeroPuertaInputElement);
	this.mainBarCustom.element.appendChild(buttonElement);
};

GeoMap.prototype.CrearControlBarraDibujoAdmin = function () {
	var self = this;

	if (!this.mainBarCustom) {
		this.mainBarCustom = new ol.control.Bar();
		this.map.addControl(this.mainBarCustom);
		this.mainBarCustom.setPosition('top');
	}

	var estiloDibujo = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(35, 163, 12, 0.5)'
		}),
		stroke: new ol.style.Stroke({
			color: '#23a30c',
			width: 5
		}),
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
				color: '#23a30c'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(35, 163, 12, 0.5)',
				width: 8
			}),
		})
	});

	if (!this.vector) {
		this.vector = new ol.layer.Vector({
			title: 'Capa de dibujo',
			displayInLayerSwitcher: false,
			source: new ol.source.Vector(),
			style: estiloDibujo
		});
		this.map.addLayer(this.vector);
	}

	var barraDibujo = new ol.control.Bar({
		group: true,
		toggleOne: true
	});
	this.mainBarCustom.addControl(barraDibujo);


	var controlModificar = new ol.interaction.Modify({ source: this.vector.getSource() });
	this.map.addInteraction(controlModificar);

	let hospitalesArray = [];
	function obtenerHospitales() {
		return new Promise((resolve, reject) => {
			fetch('http://localhost:8080/TSIG_LAB-web/HospitalServlet?action=/listar')
				.then(response => response.json())
				.then(data => {
					hospitalesArray = data;
					console.log(hospitalesArray);
					resolve(hospitalesArray);
				})
				.catch(error => {
					console.error('Error:', error);
					reject(error);
				});
		});
	}

	function actualizarFeature() {
		if (lyrAmbulancias.getSource()) {
			var sourceLinea2 = new ol.source.TileWMS({
				url: 'http://localhost:8586/geoserver/wms?',
				params: {
					VERSION: '1.1.1',
					FORMAT: 'image/png',
					TRANSPARENT: true,
					LAYERS: 'tsig2023:ambulancia',
					_ts: Date.now() // Agregar un sello de tiempo único
				}
			});
			lyrAmbulancias.setSource(sourceLinea2);
		}

		if (lyrServicios.getSource()) {
			var sourcePunto2 = new ol.source.TileWMS({
				url: 'http://localhost:8586/geoserver/wms?',
				params: {
					VERSION: '1.1.1',
					FORMAT: 'image/png',
					TRANSPARENT: true,
					STYLES: 'puntoGeneral',
					LAYERS: 'tsig2023:servicioemergencia',
					_ts: Date.now() // Agregar un sello de tiempo único
				}
			});
			lyrServicios.setSource(sourcePunto2);
		}

		if (lyrZonas.getSource()) {
			var sourcezona = new ol.source.TileWMS({
				url: 'http://localhost:8586/geoserver/wms?',
				params: {
					VERSION: '1.1.1',
					FORMAT: 'image/png',
					TRANSPARENT: true,
					LAYERS: 'tsig2023:zona',
					_ts: Date.now() // Agregar un sello de tiempo único
				}
			});
			lyrZonas.setSource(sourcezona);
		}
	}

	//////////////////////////////////////////////////
	function insertarFeature(nombreFeatureType, nombreFeature, nombreLayer, tipoGeometria, coords3857) {
		console.log('Coordenadas en SRID 3857:', coords3857);
		//Lista hospitales
		obtenerHospitales().then(hospitalesArray => {
			console.log(hospitalesArray);

			// Crear la geometría correspondiente
			var geometry;
			if (tipoGeometria === 'Point') { //-------------------------------nuevo servicio de emergencia
				geometry = new ol.geom.Point(coords3857);
				Swal.fire({
					title: 'Nuevo Servicio de Emergencia',
					html: `
					<select id="inputHospital" class="swal2-select" placeholder="Seleccione un hospital">
						${hospitalesArray.map(hospital => `<option value="${hospital.id}">${hospital.nombre}</option>`).join('')}
				  	</select>
					<input id="inputTotalCamas" class="swal2-input" placeholder="Camas totales" type="text">
					<input id="inputCamasDisponibles" class="swal2-input" placeholder="Cantidad disponibles" type="text">  `,
					showCancelButton: true,
					confirmButtonText: 'Guardar',
					cancelButtonText: 'Cancelar',
					preConfirm: () => {
						const inputHospital = document.getElementById('inputHospital').value;
						const inputTotalCamas = document.getElementById('inputTotalCamas').value;
						const inputCamasDisponibles = document.getElementById('inputCamasDisponibles').value;

						if (!inputHospital || !inputTotalCamas || !inputCamasDisponibles) {
							Swal.showValidationMessage('Debe ingresar todos los campos');
						}
						return {
							inputHospital: inputHospital,
							inputTotalCamas: inputTotalCamas,
							inputCamasDisponibles: inputCamasDisponibles
						};
					}
				}).then((result) => {
					if (result.isConfirmed) {
						// Obtener el valor del nombre ingresado por el usuario
						const { inputHospital, inputTotalCamas, inputCamasDisponibles } = result.value;
						console.log('ID hospital:', inputHospital);
						console.log('Cantidad de camas totales:', inputTotalCamas);
						console.log('Cantidad de camas disponibles:', inputCamasDisponibles);

						// Validar si son numeros
						if (isNaN(inputHospital)) {
							Swal.showValidationMessage('El ID del hospital debe ser un número válido');
							return; // Detener la ejecución si no es válido
						}
						if (isNaN(inputTotalCamas)) {
							Swal.showValidationMessage('El total de camas debe ser un número');
							return; // Detener la ejecución si no es válido
						}
						if (isNaN(inputCamasDisponibles)) {
							Swal.showValidationMessage('Las camas diponibles debe ser un número');
							return; // Detener la ejecución si no es válido
						}

						const hospitalId = BigInt(inputHospital);

						// Crear la característica con la geometría y el nombre
						var feature = new ol.Feature({
							camasdisponibles: inputCamasDisponibles,
							totalcamas: inputTotalCamas,
							ubicacion: geometry,
							hospital_id: hospitalId
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
								// Parsear la respuesta XML												
								const parser = new DOMParser();
								const xmlDoc = parser.parseFromString(data, 'text/xml');
								const featureIds = xmlDoc.getElementsByTagName("ogc:FeatureId");
								if (featureIds.length > 0) {
									const sId = featureIds[0].getAttribute("fid");
									const puntoIndex = sId.indexOf(".");
									const serviceId = sId.substring(puntoIndex + 1);
									console.log("ID del servicio de emergencia:", serviceId);
									// fetch para llamar a la función del servlet de hospital
									fetch('http://localhost:8080/TSIG_LAB-web/HospitalServlet?action=/agregarServicio' + '&id=' + serviceId + '&hospitalId=' + hospitalId, { //fetch('http://localhost:8080/TSIG_LAB-web/HospitalServlet2?id=' + serviceId + '&hospitalId=' + hospitalId, {
										method: 'GET'
									})
										.then(response => {
											if (response.ok) {
												console.log('Llamada al servlet de hospital exitosa');
											} else {
												console.error('Error al llamar al servlet de hospital');
											}
										})
								}
							})
							.catch(error => {
								console.error('Error al realizar la solicitud WFS:', error);
							});
					}
				});
			} else if (tipoGeometria === 'LineString') { //-------------------------------nueva ambulancia
				geometry = new ol.geom.LineString(coords3857);
				//------------- COMPLETAR
				Swal.fire({
					title: 'Nueva Ambulancia',
					html: `
					<select id="inputHospital" class="swal2-select" placeholder="Seleccione un hospital">
						${hospitalesArray.map(hospital => `<option value="${hospital.id}">${hospital.nombre}</option>`).join('')}
				  	</select>
					<input id="inputCodigo" class="swal2-input" placeholder="Codigo" type="text">
					<input id="inputDistancia" class="swal2-input" placeholder="Distancia" type="text">  `,
					showCancelButton: true,
					confirmButtonText: 'Guardar',
					cancelButtonText: 'Cancelar',
					preConfirm: () => {
						const inputHospital = document.getElementById('inputHospital').value;
						const inputCodigo = document.getElementById('inputCodigo').value;
						const inputDistancia = document.getElementById('inputDistancia').value;

						if (!inputHospital || !inputCodigo || !inputDistancia) {
							Swal.showValidationMessage('Debe ingresar todos los campos');
						}
						return {
							inputHospital: inputHospital,
							inputCodigo: inputCodigo,
							inputDistancia: inputDistancia
						};
					}
				}).then((result) => {
					if (result.isConfirmed) {
						// Obtener el valor del nombre ingresado por el usuario
						const { inputHospital, inputCodigo, inputDistancia } = result.value;
						console.log('ID hospital:', inputHospital);
						console.log('Cantidad de camas totales:', inputCodigo);
						console.log('Cantidad de camas disponibles:', inputDistancia);

						// Validar si son numeros
						if (isNaN(inputHospital)) {
							Swal.showValidationMessage('El ID del hospital debe ser un número válido');
							return; // Detener la ejecución si no es válido
						}
						if (isNaN(inputDistancia)) {
							Swal.showValidationMessage('Las camas diponibles debe ser un número');
							return; // Detener la ejecución si no es válido
						}

						const hospitalId = BigInt(inputHospital);

						// Crear el buffer alrededor de la geometría LineString basado en la distancia máxima de desvío
						var buffer = ol.extent.buffer(geometry.getExtent(), inputDistancia); // Reemplaza 100 con la distancia máxima de desvío deseada
						// Crear la geometría de polígono para la zona de cobertura
						var polygonGeometry = new ol.geom.Polygon.fromExtent(buffer);
						console.log(polygonGeometry.getCoordinates());

						var coords = polygonGeometry.getCoordinates();
						var coordenadasTexto = coords[0].map(function (coordinate) {
							return coordinate.join(' ');
						}).join(', ');
						//console.log(coordenadasTexto);
						emergenciaDentroZona(coordenadasTexto).then(resultado => {
							if (resultado.codigoRetorno === 1) {
								//no hace nada tira popup
							} else {

								var ambulanciaFeature = new ol.Feature({
									nombre: inputCodigo,
									ubicacion: geometry,
									distancia: inputDistancia,
									hospital_id: hospitalId
								});

								var wfs1 = new ol.format.WFS();
								var ambulanciaInsertFeature = wfs1.writeTransaction([ambulanciaFeature], null, null, {
									featureType: 'ambulancia',
									featureNS: 'tsig2023',
									srsName: 'EPSG:3857',
									version: '1.1.0'
								});

								// Enviar la solicitud WFS al servidor para insertar la característica de la zona de cobertura
								fetch('http://localhost:8586/geoserver/tsig2023/wfs', {
									method: 'POST',
									headers: {
										'Content-Type': 'text/xml'
									},
									body: new XMLSerializer().serializeToString(ambulanciaInsertFeature)
								})
									.then(response => response.text())
									.then(data => {
										console.log('Respuesta del servidor (ambulancia):', data);
										console.log('FALTA funcion sevlet para tabla hospital_ambulancia', data);
										//FALTA------------------------------------------------
									})
									.catch(error => {
										console.error('Error al realizar la solicitud WFS (ambulancia):', error);
									})
									.catch(error => {
										console.error('Error al realizar la solicitud WFS:', error);
									});

								// Crear la característica de la zona de cobertura
								var zonaCoberturaFeature = new ol.Feature({
									nombre: inputCodigo,
									ubicacion: polygonGeometry
								});

								// Asignar cualquier otra propiedad necesaria a la característica de la zona de cobertura
								zonaCoberturaFeature.setProperties({
									name: nombreFeature
								});

								// Crear una transacción WFS para insertar la característica de la zona de cobertura
								var wfs = new ol.format.WFS();
								var zonaCoberturaInsertRequest = wfs.writeTransaction([zonaCoberturaFeature], null, null, {
									featureType: 'zona',
									featureNS: 'tsig2023',
									srsName: 'EPSG:3857',
									version: '1.1.0'
								});

								// Enviar la solicitud WFS al servidor para insertar la característica de la zona de cobertura
								fetch('http://localhost:8586/geoserver/tsig2023/wfs', {
									method: 'POST',
									headers: {
										'Content-Type': 'text/xml'
									},
									body: new XMLSerializer().serializeToString(zonaCoberturaInsertRequest)
								})
									.then(response => response.text())
									.then(data => {
										console.log('Respuesta del servidor (zona de cobertura):', data);
									})
									.catch(error => {
										console.error('Error al realizar la solicitud WFS (zona de cobertura):', error);
									})
									.catch(error => {
										console.error('Error al realizar la solicitud WFS:', error);
									});
								//guardarCambios(selectedFeature, 'ambulancia');
								//actualizarFeature();
								//selectedFeatures.clear();
							}
						})
							.catch(error => {
								console.error('Error en la función emergenciaDentroZona:', error);
							});

					}
				});
			} else if (tipoGeometria === 'Polygon') {
				geometry = new ol.geom.Polygon(coords3857);
				//------------- COMPLETAR
			}
		}).catch(error => {
			console.error('Error al obtener los hospitales:', error);
		});
	}

	var controlPunto = new ol.control.Toggle({
		title: 'Registrar Servicio',
		html: '<i class="fa fa-map-marker"></i>',
		interaction: new ol.interaction.Draw({
			type: 'Point',
			source: this.vector.getSource()
		})
	});

	controlPunto.getInteraction().on('drawend', function (event) {
		var feature = event.feature;
		var coords3857 = feature.getGeometry().getCoordinates();
		insertarFeature('servicioemergencia', 'Nuevo Punto', 'tsig2023', 'Point', coords3857);
	});

	barraDibujo.addControl(controlPunto);

	var controlLinea = new ol.control.Toggle({
		title: 'Registrar Ambulancia',
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
					handleClick: function () {
						controlLinea.getInteraction().removeLastPoint()
					}
				}),
				new ol.control.TextButton({
					title: 'Finalizar dibujo',
					html: 'Finalizar',
					handleClick: function () {
						controlLinea.getInteraction().finishDrawing();
					}
				})
			]
		})
	});

	controlLinea.getInteraction().on('drawend', function (event) {
		var feature = event.feature;
		var coords3857 = feature.getGeometry().getCoordinates();
		insertarFeature('ambulancia', 'Nueva Línea', 'tsig2023', 'LineString', coords3857);
	});

	barraDibujo.addControl(controlLinea);
	/*
		var controlPoligono = new ol.control.Toggle({
			title: 'Dibujar polígono',
			html: '<i class="fa fa-bookmark-o fa-rotate-270"></i>',
			interaction: new ol.interaction.Draw({
				type: 'Polygon',
				source: this.vector.getSource()
			}),
			bar: new ol.control.Bar({
				controls: [
					new ol.control.TextButton({
						title: 'Deshacer ultimo punto',
						html: 'Deshacer',
						handleClick: function () {
							controlPoligono.getInteraction().removeLastPoint()
						}
					}),
					new ol.control.TextButton({
						title: 'Finalizar dibujo',
						html: 'Finalizar',
						handleClick: function () {
							controlPoligono.getInteraction().finishDrawing();
						}
					})
				]
			})
		});
		
		controlPoligono.getInteraction().on('drawend', function (event) {
			var feature = event.feature;
			var coords3857 = feature.getGeometry().getCoordinates();
			insertarFeature('zona', 'Nueva Zona', 'tsig2023', 'Polygon', coords3857);
		});
		
		barraDibujo.addControl(controlPoligono);
	*/
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
					handleClick: function () {
						var selectedFeatures = controlSeleccionar.getInteraction().getFeatures();
						if (selectedFeatures.getLength() > 0) {
							var selectedFeature = selectedFeatures.item(0);
							var id = selectedFeature.getId();
							var geometry = selectedFeature.getGeometry();

							obtenerHospitales()
								.then(() => {
									var hospId = Number(selectedFeature.get('hospital_id'));
									function obtenerNombrePorId(hospId) {
										for (var i = 0; i < hospitalesArray.length; i++) {
											if (hospitalesArray[i].id === hospId) {
												return hospitalesArray[i].nombre;
											}
										}
										return null;
									}
									var hospName = obtenerNombrePorId(hospId);

									if (geometry instanceof ol.geom.Point) {
										var totalCamas = Number(selectedFeature.get('totalcamas'));
										var camasDispo = Number(selectedFeature.get('camasdisponibles'));
										// Establecer los valores de los atributos en la característica seleccionada
										selectedFeature.set('id', id);
										selectedFeature.set('hospital', hospName);
										selectedFeature.set('totalCamas', totalCamas);
										selectedFeature.set('camasDispo', camasDispo);

										// Crear el Popup de OpenLayers si no existe
										if (!popup) {
											popup = new ol.Overlay.PopupFeature({
												popupClass: 'default anim',
												select: controlSeleccionar.getInteraction(),
												template: {
													attributes: {
														'id': { title: 'Servicio ID: ' },
														'hospital': { title: 'Hospital: ' },
														'totalCamas': { title: 'Total de camas: ' },
														'camasDispo': { title: 'Camas disponibles: ' }
													}
												}
											});
											map.addOverlay(popup);
										}
									} else if (geometry instanceof ol.geom.LineString) {

									} else if (geometry instanceof ol.geom.Polygon) {

									}
									// Mostrar el Popup en la posición de la característica seleccionada
									popup.show(selectedFeature);
								})

						}
					}
				}),
				new ol.control.TextButton({
					title: 'Eliminar',
					html: 'Eliminar',
					handleClick: function () {
						var selectedFeatures = controlSeleccionar.getInteraction().getFeatures();
						if (selectedFeatures.getLength() > 0) {
							var selectedFeature = selectedFeatures.item(0);
							var id = selectedFeature.getId();
							var geometry = selectedFeature.getGeometry();

							// Determinar el valor de layerName según el tipo de geometría
							var layerName;
							if (geometry instanceof ol.geom.Point) {
								layerName = 'servicioemergencia';
								var hospId = Number(selectedFeature.get('hospital_id'));
								var coords = selectedFeature.getGeometry().getCoordinates();
								var modifiedCoordsText = coords.slice(0, 2).join(' ');
								console.log(modifiedCoordsText);
								emergenciaFueraZona(modifiedCoordsText)
									.then(resultado => {
										if (resultado.codigoRetorno === 0) {
											Swal.fire({
												icon: 'error',
												title: 'No es posible eliminar',
												text: 'La ambulancia tiene que tener un Servicio de Emergencia dentro de su zona'
											});
										} else {
											obtenerHospitales()
												.then(() => {
													// Buscar el hospital por su id
													function obtenerNombrePorId(hospId) {
														for (var i = 0; i < hospitalesArray.length; i++) {
															if (hospitalesArray[i].id === hospId) {
																return hospitalesArray[i].nombre;
															}
														}
														return null;
													}

													var hospName = obtenerNombrePorId(hospId);
													Swal.fire({
														title: 'Eliminar',
														html: 'Servicio de Emergencia del hospital <br>' + hospName,
														icon: 'question',
														showCancelButton: true,
														confirmButtonText: 'Eliminar',
														cancelButtonText: 'Cancelar'
													}).then(function (result) {
														if (result.isConfirmed) {
															eliminarEntidad(selectedFeature, layerName);
															actualizarFeature();
															selectedFeature = null;
														}
													});
												})
										}
									})
									.catch(error => {
										console.error('Error en la función emergenciaDentroZona:', error);
									});
							} else if (geometry instanceof ol.geom.LineString) {
								layerName = 'ambulancia';
								Swal.fire({
									title: 'Eliminar',
									html: '¿Eliminar ID: ' + id + ' y nombre: ' + nombre + '?',
									icon: 'question',
									showCancelButton: true,
									confirmButtonText: 'Eliminar',
									cancelButtonText: 'Cancelar'
								}).then(function (result) {
									if (result.isConfirmed) {
										var getFeatureUrl = 'http://localhost:8586/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023:zona&CQL_FILTER=nombre%20%3D%20%27' + nombre + '%27&outputFormat=application/json';
										fetch(getFeatureUrl)
											.then(function (response) {
												return response.json();
											})
											.then(function (data) {
												var features = data.features;
												if (features.length > 0) {
													var featureId = features[0].id; // Obtener el ID de la feature
													console.log(featureId);

													var deleteFeatureUrl = 'http://localhost:8586/geoserver/wfs';
													var typeName = 'tsig2023:zona';
													var xmlData = '<wfs:Transaction xmlns:wfs="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Delete typeName="' + typeName + '"><ogc:Filter><ogc:FeatureId fid="' + featureId + '"/></ogc:Filter></wfs:Delete></wfs:Transaction>';

													var deleteFeatureRequest = fetch(deleteFeatureUrl, {
														method: 'POST',
														headers: {
															'Content-Type': 'text/xml'
														},
														body: xmlData
													});
													Promise.all([deleteFeatureRequest])
														.then(function (responses) {
															// Verificar si todas las respuestas son exitosas
															var allSuccessful = responses.every(function (response) {
																return response.ok;
															});

															if (allSuccessful) {
																console.log('Todas las operaciones se completaron correctamente');
																// Realizar otras acciones después de eliminar la feature
																actualizarFeature();
																selectedFeature = null;
																eliminarVectorSource();
															} else {
																console.error('Al menos una operación falló');
															}
														})
														.catch(function (error) {
															console.error('Error al enviar la solicitud WFS:', error);
														});
												} else {
													console.log('No se encontró ninguna feature con el nombre especificado');
												}
											})
											.catch(function (error) {
												console.error('Error al obtener la feature de Polygon:', error);
											});
										eliminarEntidad(selectedFeature, layerName);
										actualizarFeature();
										selectedFeature = null;
									}
								});
							}
						}
					}
				}),
				new ol.control.TextButton({
					title: 'Editar',
					html: 'Editar',
					handleClick: function () {
						var selectedFeatures = controlSeleccionar.getInteraction().getFeatures();
						if (selectedFeatures.getLength() > 0) {
							var selectedFeature = selectedFeatures.item(0);
							var geometry = selectedFeature.getGeometry();

							if (geometry instanceof ol.geom.Point) {
								modificarAtributosServicios(selectedFeatures);
							} else if (geometry instanceof ol.geom.LineString) {
								modificarUbicacion(selectedFeatures);
							} else if (geometry instanceof ol.geom.Polygon) {
								modificarUbicacion(selectedFeatures);
							}
						}
					}
				}),
			]
		})
	});

	controlSeleccionar.on('change:active', function (evt) {
		if (evt.active) {
			obtenerDatosCapas();
		} else {
			eliminarVectorSource();
			desactivarPopup();
		}
	});

	var popup;

	function desactivarPopup() {
		if (popup) {
			map.removeOverlay(popup);
			popup = null;
		}
	}

	function modificarAtributosServicios(selectedFeatures) {
		if (selectedFeatures.getLength() > 0) {
			obtenerHospitales()
				.then(() => {
					var selectedFeature = selectedFeatures.item(0);
					var totalCamas = Number(selectedFeature.get('totalcamas'));
					var hospIdOri = Number(selectedFeature.get('hospital_id'));
					var servicio_id = selectedFeature.getId();
					console.log("servicio seleccionado id " + servicio_id);
					console.log("servicio seleccionado total camas " + totalCamas);
					console.log("servicio seleccionado id hospital" + hospIdOri);
					//${hospitalesArray.map(hospital => `<option value="${hospital.id}">${hospital.nombre}</option>`).join('')}
					Swal.fire({
						title: 'Modificar Servicio de Emergencia',
						html: `<p>ID Servicio seleccionado: ${servicio_id}</p>
							<label for="inputHospital">Hospital:</label>	
							<select id="inputHospital" class="swal2-select" placeholder="Seleccione un hospital">        		
								${hospitalesArray.map(hospital => `<option value="${hospital.id}" ${hospital.id === hospIdOri ? 'selected' : ''}>${hospital.nombre}</option>`).join('')}
      						</select><br>
							<label for="inputTotalCamas">Camas:</label>							  
							<input id="inputTotalCamas" class="swal2-input" placeholder="Camas totales" type="text" value="${totalCamas}">`,
						showCancelButton: true,
						confirmButtonText: 'Guardar',
						preConfirm: () => {
							const inputHospital = document.getElementById('inputHospital').value;
							const inputTotalCamas = document.getElementById('inputTotalCamas').value;

							if (!inputHospital || !inputTotalCamas) {
								Swal.showValidationMessage('Debe ingresar todos los campos');
							}
							return {
								inputHospital: inputHospital,
								inputTotalCamas: inputTotalCamas
							};
						}
					}).then((result) => {
						if (result.isConfirmed) {
							// Mostrar el segundo popup para confirmar la modificación de la ubicación
							const { inputHospital, inputTotalCamas } = result.value;
							console.log('ID hospital:', inputHospital);
							console.log('Cantidad de camas totales:', inputTotalCamas);

							// Validar si son numeros
							if (isNaN(inputHospital)) {
								Swal.showValidationMessage('El ID del hospital debe ser un número válido');
								return; // Detener la ejecución si no es válido
							}
							if (isNaN(inputTotalCamas)) {
								Swal.showValidationMessage('El total de camas debe ser un número');
								return; // Detener la ejecución si no es válido
							}
							const hospitalId = BigInt(inputHospital);

							selectedFeature.set('totalcamas', inputTotalCamas);
							selectedFeature.set('hospital_id', hospitalId);

							guardarCambios(selectedFeature, 'servicioemergencia');

							console.log('Falta actulizar la lista hospital_servicioemergencia');//////////////////////////////////////////////////// falta

							const puntoIndex = servicio_id.indexOf(".");
							const serviceId = servicio_id.substring(puntoIndex + 1);
							console.log("ID del servicio de emergencia:", serviceId);

							fetch('http://localhost:8080/TSIG_LAB-web/HospitalServlet?action=/actualizarServicio' + '&servicioId=' + serviceId + '&hospIdNuevo=' + hospitalId + '&hospIdViejo=' + hospIdOri, {
								method: 'GET'
							})
								.then(response => {
									if (response.ok) {
										console.log('Llamada al servlet de hospital exitosa');
									} else {
										console.error('Error al llamar al servlet de hospital');
									}
								})
						}
						modificarUbicacion(selectedFeatures);
					});
				})
		}
	}

	function modificarUbicacion(selectedFeatures) {
		Swal.fire({
			title: 'Modificar la ubicacion',
			html: 'A continuacion modifique la ubicacion.',
			showCancelButton: true,
			confirmButtonText: 'Siguiente',
		}).then((result) => {
			if (result.isConfirmed) {
				if (selectedFeatures.getLength() > 0) {

					var selectedFeature = selectedFeatures.item(0);
					console.log('Coordenadas antes de la modificación:', selectedFeature.getGeometry().getCoordinates());

					// Crea la interacción de modificación y asigna la capa vectorial
					var modifyInteraction = new ol.interaction.Modify({
						features: selectedFeatures,
					});

					// Agrega la interacción de modificación al mapa
					map.addInteraction(modifyInteraction);
					console.log('A:');
					// Al finalizar la edición
					modifyInteraction.on('modifyend', function (event) {
						// Obtén la geometría modificada
						console.log('B:');
						var modifiedGeometry = event.features.item(0).getGeometry();
						var modifiedCoordinates = modifiedGeometry.getCoordinates();
						console.log('C:');
						// Actualiza la geometría de la característica
						selectedFeature.getGeometry().setCoordinates(modifiedCoordinates);
						console.log('Coordenadas después de la modificación:', selectedFeature.getGeometry().getCoordinates());

						// Determinar el valor de layerName según el tipo de geometría
						var layerName;
						if (modifiedGeometry instanceof ol.geom.Point) {
							layerName = 'servicioemergencia';
							var coords = selectedFeature.getGeometry().getCoordinates();
							var modifiedCoordsText = coords.slice(0, 2).join(' ');
							console.log(modifiedCoordsText);

							//emergenciaFueraZona(modifiedCoordsText)
							//	.then(resultado => {
							//			if (resultado.codigoRetorno === 0) {
							guardarCambios(selectedFeature, layerName);
							actualizarFeature();
							selectedFeatures.clear();
							//			} else {
							//				actualizarFeature();
							//				selectedFeatures.clear();
							//				eliminarVectorSource();
							//}
							//		})
							//		.catch(error => {
							//			console.error('Error en la función emergenciaDentroZona:', error);
							//});
						} else if (modifiedGeometry instanceof ol.geom.LineString) {
							layerName = 'ambulancia';
							guardarCambios(selectedFeature, layerName);
							actualizarFeature();
							selectedFeatures.clear();
						} else if (modifiedGeometry instanceof ol.geom.Polygon) {
							layerName = 'zona';
							var coords = selectedFeature.getGeometry().getCoordinates();
							var coordenadasTexto = coords[0].map(function (coordinate) {
								return coordinate.join(' ');
							}).join(', ');
							var coordenadas = coordenadasTexto.replace(/\s\d/g, '');
							//console.log(coordenadas);
							emergenciaDentroZona(coordenadas)
								.then(resultado => {
									if (resultado.codigoRetorno === 1) {
										//modificar
									}
									guardarCambios(selectedFeature, layerName);
									actualizarFeature();
									selectedFeatures.clear();
								})
								.catch(error => {
									console.error('Error en la función emergenciaDentroZona:', error);
								});
						}
					});
				}
			}
		});
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
		var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Aservicioemergencia';

		fetch(url)
			.then(function (response) {
				return response.text();
			})
			.then(function (data) {
				// Crea la fuente de vector con los datos obtenidos
				var vectorSource = new ol.source.Vector({
					features: new ol.format.WFS().readFeatures(data)
				});

				vectorSource.forEachFeature(function (feature) {
					var geometry = feature.getGeometry();
					var coordinates = geometry.getCoordinates();
					geometry.setCoordinates(coordinates);
				});

				// Agrega la fuente de vector a la capa vectorial existente
				if (self.vector) {
					self.vector.setSource(vectorSource);
				}

			})
			.catch(function (error) {
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
}

GeoMap.prototype.CrearControlHospital = function () {
	var self = this;

	if (!this.mainBarCustom) {
		this.mainBarCustom = new ol.control.Bar();
		this.map.addControl(this.mainBarCustom);
		this.mainBarCustom.setPosition('top');
	}

	function crearHospital() {
		var inputNombre;
		var inputTipo;

		Swal.fire({
			title: 'Ingrese los datos del nuevo Hospital',
			html: `<input id="inputNombre" class="swal2-input" placeholder="Nombre" type="text">
				<select id="inputTipo" class="swal2-select" placeholder="Seleccione el tipo">
					<option value="Mutualista">Mutualista</option>
					<option value="Seguro Privado">Seguro Privado</option>
					<option value="Servicio Estatal">Servicio Estatal</option>
			  	</select>   
    			`,
			showCancelButton: true,
			confirmButtonText: 'Guardar',
			cancelButtonText: 'Cancelar',
			preConfirm: () => {
				inputNombre = document.getElementById('inputNombre').value;
				inputTipo = document.getElementById('inputTipo').value;

				if (!inputNombre || !inputTipo) {
					Swal.showValidationMessage('Debe ingresar todos los campos');
				}
				return {
					inputNombre: inputNombre,
					inputTipo: inputTipo,
				};
			}
		}).then((result) => {
			if (result.isConfirmed) {
				// Obtener el valor del nombre ingresado por el usuario					
				if (result.isConfirmed) {
					const { inputNombre, inputTipo } = result.value;
					console.log('Nombre hospital:', inputNombre);
					console.log('Tipo:', inputTipo);
				}

				// parametros a enviar
				const requestBody = new URLSearchParams();
				requestBody.append('nombre', inputNombre);
				requestBody.append('tipo', inputTipo);

				// fetch para llamar a la función del servlet de hospital
				fetch('http://localhost:8080/TSIG_LAB-web/HospitalServlet?action=/crear', {
					method: 'POST',
					body: requestBody,
				})
					.then(response => {
						if (response.ok) {
							console.log('Llamada al servlet de hospital exitosa');
						} else {
							console.error('Error al llamar al servlet de hospital');
						}
					})

					.catch(error => {
						console.error('Error al realizar la solicitud WFS:', error);
					});
			}
		});

	}

	var buttonElement = document.createElement('button');
	buttonElement.textContent = 'Registrar Hospital';
	buttonElement.addEventListener('click', crearHospital);
	buttonElement.style.width = '100%'; // Ajusta el ancho del botón al 100%
	buttonElement.style.padding = '6px'; // Ajusta el relleno del botón	
	this.mainBarCustom.element.appendChild(buttonElement);
};


function crearCapaMapaCalor() {
	// Obtén los datos de la capa Recorridos como JSON
	var url = 'http://localhost:8586/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023:ambulancia&outputFormat=application/json';

	fetch(url)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			// Crea la fuente de vector con los datos obtenidos
			var vectorSource = new ol.source.Vector({
				features: new ol.format.GeoJSON().readFeatures(data, {
				})
			});

			// Calcula el punto medio de cada linestring y agrega un nuevo punto a la fuente de vector
			vectorSource.getFeatures().forEach(function (feature) {
				var geometry = feature.getGeometry();
				if (geometry.getType() === 'LineString') {
					var lineString = geometry.clone();
					var midpoint = lineString.getCoordinateAt(0.5);
					var midpointFeature = new ol.Feature(new ol.geom.Point(midpoint));
					vectorSource.addFeature(midpointFeature);
				}
			});

			// Crea la capa de mapa de calor utilizando los puntos medios como fuente
			var heatmapLayer = new ol.layer.Heatmap({
				title: 'Mapa de Calor',
				visible: false,
				source: vectorSource,
				blur: 15,
				radius: 10,
				weight: 'weight',
				gradient: [
					'rgba(0, 0, 255, 0)',  // Azul transparente (valor mínimo)
					'rgba(0, 0, 255, 1)',  // Azul opaco
					'rgba(255, 0, 0, 1)'   // Rojo opaco (valor máximo)
				],
				minOpacity: 0.05,  // Opacidad mínima para los puntos más leves
				maxOpacity: 1.0,   // Opacidad máxima para los puntos más densos
				opacity: 0.8       // Opacidad general de la capa de calor
			});

			// Agrega la capa de mapa de calor al mapa existente
			map.addLayer(heatmapLayer);
		});
}
crearCapaMapaCalor();

function emergenciaDentroZona(coordenadasTexto) {
	var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Aservicioemergencia&outputFormat=application/json&CQL_FILTER=INTERSECTS(ubicacion, POLYGON((' + coordenadasTexto + ')))';
	console.log(coordenadasTexto);

	return fetch(url)
		.then(response => response.json())
		.then(data => {
			var features = data.features;
			var resultado = {};

			if (features.length === 0) {
				// No se encontraron features
				Swal.fire({
					icon: 'info',
					title: 'Sin servicio de Emergencia',
					text: 'La ambulancia no tiene un Servicio de Emergencia en su zona. Intente nuevamente'
				});
				resultado.nombre = null;
				resultado.codigoRetorno = 1;
			} else {
				features.forEach(feature => {
					resultado.nombre = feature.properties.nombre;
					//console.log(resultado.nombre);
				});
				resultado.codigoRetorno = 0;
			}

			return resultado;
		})
		.catch(error => {
			console.error('Error al realizar la consulta WFS:', error);
			throw error;
		});
}

function emergenciaFueraZona(coordenadasTexto) {
	var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Azona&outputFormat=application/json&CQL_FILTER=INTERSECTS(ubicacion, POINT(' + coordenadasTexto + '))';

	return fetch(url)
		.then(response => response.json())
		.then(data => {
			var features = data.features;
			var resultado = {};

			if (features.length === 0) {
				// No se encontraron features
				Swal.fire({
					icon: 'info',
					title: 'Sin servicio de Emergencia',
					text: 'La ambulancia no tiene un Servicio de Emergencia en su zona. Intente nuevamente'
				});
				resultado.nombre = null;
				resultado.codigoRetorno = 1;
			} else {
				features.forEach(feature => {
					resultado.nombre = feature.properties.nombre;
					//console.log(resultado.nombre);
				});
				resultado.codigoRetorno = 0;
			}

			return resultado;
		})
		.catch(error => {
			console.error('Error al realizar la consulta WFS:', error);
			throw error;
		});
}

GeoMap.prototype.CrearControlBarraSeleccionar = function () {
	var self = this;

	if (!this.mainBarCustom) {
		this.mainBarCustom = new ol.control.Bar();
		this.map.addControl(this.mainBarCustom);
		this.mainBarCustom.setPosition('top');
	}

	var estiloDibujo = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(35, 163, 12, 0.5)'
		}),
		stroke: new ol.style.Stroke({
			color: '#23a30c',
			width: 5
		}),
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
				color: '#23a30c'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(35, 163, 12, 0.5)',
				width: 8
			}),
		})
	});

	if (!this.vector) {
		this.vector = new ol.layer.Vector({
			title: 'Capa de dibujo',
			displayInLayerSwitcher: false,
			source: new ol.source.Vector(),
			style: estiloDibujo
		});
		this.map.addLayer(this.vector);
	}

	var barraSeleccionar = new ol.control.Bar({
		group: true,
		toggleOne: true
	});
	this.mainBarCustom.addControl(barraSeleccionar);

	var controlModificar = new ol.interaction.Modify({ source: this.vector.getSource() });
	this.map.addInteraction(controlModificar);

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
					handleClick: function () {
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
								self.map.addOverlay(popup);
							}

							// Mostrar el Popup en la posición de la característica seleccionada
							popup.show(selectedFeature);
						}
					}
				})
			]
		})
	});

	controlSeleccionar.on('change:active', function (evt) {
		if (evt.active) {
			obtenerDatosCapas();
		} else {
			eliminarVectorSource();
			desactivarPopup();
		}
	});

	var popup;

	function desactivarPopup() {
		if (popup) {
			self.map.removeOverlay(popup);
			popup = null;
		}
	}

	function obtenerDatosCapas() {
		// Obtén los datos de las capas como GML
		var url = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Aservicioemergencia,tsig2023%3Aambulancia,tsig2023%3Azona';

		fetch(url)
			.then(function (response) {
				return response.text();
			})
			.then(function (data) {
				// Crea la fuente de vector con los datos obtenidos
				var vectorSource = new ol.source.Vector({
					features: new ol.format.WFS().readFeatures(data)
				});

				vectorSource.forEachFeature(function (feature) {
					var geometry = feature.getGeometry();
					var coordinates = geometry.getCoordinates();
					geometry.setCoordinates(coordinates);
				});

				// Agrega la fuente de vector a la capa vectorial existente
				if (self.vector) {
					self.vector.setSource(vectorSource);
				}
			})
			.catch(function (error) {
				console.error('Error al obtener los datos de las capas:', error);
			});
	}

	function eliminarVectorSource() {
		// Elimina la fuente de vector de la capa vectorial existente
		if (self.vector) {
			self.vector.setSource(null);
		}
	}

	barraSeleccionar.addControl(controlSeleccionar);
};

function emergenciaConMayorAmbulancias() {
	var urlPuntos = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Aservicioemergencia&outputFormat=application/json';

	fetch(urlPuntos)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			if (data.features.length === 0) {
				Swal.fire('No existen servicios de emergencia');
				return;
			}

			var fetchPromises = [];

			data.features.forEach(function (feature) {
				var nombre = feature.properties.nombre;
				var coordinates = feature.geometry.coordinates;
				var coordenadasTexto = coordinates.join(' ');

				var urlPoligonos = 'http://localhost:8586/geoserver/tsig2023/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=tsig2023%3Azona&outputFormat=application/json&CQL_FILTER=INTERSECTS(ubicacion, POINT(' + coordenadasTexto + '))';

				var fetchPromise = fetch(urlPoligonos)
					.then(function (response) {
						return response.json();
					})
					.then(function (data) {
						return data.features.length;
					});

				fetchPromises.push(fetchPromise);
			});

			return Promise.all(fetchPromises)
				.then(function (featuresCounts) {
					var maxFeaturesCount = 0;
					var puntoConMayorFeatures = null;

					featuresCounts.forEach(function (count, index) {
						var feature = data.features[index];
						var nombre = feature.properties.nombre;

						if (count > maxFeaturesCount) {
							maxFeaturesCount = count;
							puntoConMayorFeatures = {
								nombre: nombre,
								coordinates: feature.geometry.coordinates
							};
						}
					});

					if (puntoConMayorFeatures) {
						Swal.fire('El servicio de Emergencia con mayor cantidad de ambulancias asociadas es "' + puntoConMayorFeatures.nombre + '"');

						var cqlFilter = "nombre = '" + puntoConMayorFeatures.nombre + "'";
						lyrPunto2.getSource().updateParams({ CQL_FILTER: cqlFilter });

						map.getView().setCenter(puntoConMayorFeatures.coordinates);

						var zoomLevel = 18;
						map.getView().setZoom(zoomLevel);
					} else {
						Swal.fire('No existen ambulancias');
					}
				});
		});
}