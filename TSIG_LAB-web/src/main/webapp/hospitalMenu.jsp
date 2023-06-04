<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="datatype.DtHospital"%>
<!DOCTYPE html>
<html>
<head>
<title>Gestionar hospitales</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
	<div class="container">
		<br>
		<h1>Gestionar hospitales</h1>
		<br> 
		<div class="form-group row">
		<!-- LISTAR -->
		<form class="form-horizontal" action="HospitalServlet?action=/listar" method="POST">			
				<button type="submit" class="btn btn-primary m-1">Listar hospitales</button>			
		</form>
		<!-- CREAR -->
		<a href="hospitalCrear.jsp" class="btn btn-primary m-1 ">Crear hospital</a>
		<!-- EDITAR -->
		<a href="hospitalBuscar.jsp" class="btn btn-primary m-1 ">Editar hospital</a>
		<!-- ELIMINAR -->
		<a href="hospitalBuscar.jsp" class="btn btn-primary m-1 ">Eliminar hospital</a>
		</div>		
		<!-- OBTENER POR ID -->
		<form class="form-horizontal"
			action="HospitalServlet?action=/obtenerPorId" method="POST">
			<div class="form-group row">
				<label class="col-sm-2 col-form-label">Id:</label>
				<div class="col-sm-10 form-inline">
					<input type="text" class="form-control" name="id" placeholder="">
					<button type="submit" class="btn btn-primary m-1">Obtener hospital</button>
				</div>
				
			</div>
		</form>
		<!-- OBTENER POR NOMBRE -->
		<form class="form-horizontal"
			action="HospitalServlet?action=/obtenerPorNombre" method="POST">
			<div class="form-group row">
				<label class="col-sm-2 col-form-label">Nombre:</label>
				<div class="col-sm-10 form-inline">
					<input type="text" class="form-control" name="nombre" placeholder="">
					<button type="submit" class="btn btn-primary m-1">Obtener hospital</button>
				</div>				
			</div>
		</form>
		
	</div>
</body>
</html>