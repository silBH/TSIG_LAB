Necesario para ejecutar la aplicacion localmente:
- JDK v11 
- PostgreSQL v14 con extensión PostGIS
- Wildfly v26.1.0
- Geoserver asignandole el puerto 8586
- Eclipse IDE 2023
- Maven
- PgAdmin 4

Crear la base de datos con nombre tsig:2023 puerto:5432

Configuracion Eclipse con Wildfly:
- Asignarle el puerto 8080
- Agregar a la configuracion de Wildfly la Base de Datos.

Una vez creada la base de datos se debe ejecutar la aplicacion para crear las tablas correspondientes a:
-administrador
-servicioemergencia
-ambulancia
-zona
-hospital
-hospital_ambulancia
-hospital_servicioemergencia

Luego cargamos sus scripts correspondientes a cada tabla para tener los datos de prueba.

A traves de shp2pgsql-gui importar los shapefiles de las siguientes tablas (utilizando como SRID 32721):
-ft_01_ejes
-ft_00_departamento

A continuación, publicaremos las capas necesarias a Geoserver para su correcto funcionamiento. Pasos a seguir:
-Crear un nuevo Almacen de datos y Espacio de Trabajo con los datos de la Base de Datos
- En la sección Capas agregaremos las siguientes de nuestra BD: 
	-servicioemergencia
	-ambulancia
	-zona
	-ft_01_ejes
	-ft_00_departamento
- A cada capa es necesario permitir el acceso a cualquier rol dentro de la seccion 'Seguridad'.

-Para lograr tener el icono de los servicios de emergencia sera necesario tener el icono 'siren.png' ubicado en 'C:\ProgramData\GeoServer\styles\icons'
-Cargar el archivo SLD en la seccion de crear un nuevo estilo, a continuación aplicarle el estilo a la capa servicioemergencia.