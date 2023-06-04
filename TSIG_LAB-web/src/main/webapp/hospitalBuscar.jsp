<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.ArrayList"%>
<%@page import="datatype.DtHospital"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<meta charset="UTF-8">
<link rel="stylesheet"
	href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
<title>Buscar hospital</title>
</head>
<body>
	<div class="container mt-5">
		<h1>Buscar hospital</h1>
		<form action="HospitalServlet?action=/obtenerPorId" method="post">
			<div class="form-group row">
				<label class="col-sm-2 col-form-label" for="input">Id:</label>
				<div class="col-sm-10 form-inline">
					<input type="text" class="form-control" id="id" name="id">
					<button type="submit" class="btn btn-primary m-1">Buscar</button>
				</div>
			</div>
		</form>
		<form action="HospitalServlet?action=/obtenerPorNombre" method="post">
			<div class="form-group row">
				<label class="col-sm-2 col-form-label" for="input">Nombre:</label>
				<div class="col-sm-10 form-inline">
					<input type="text" class="form-control" id="nombre" name="nombre">
					<button type="submit" class="btn btn-primary m-1">Buscar</button>
				</div>
			</div>
		</form>
<%
	List<DtHospital> listado = (List<DtHospital>) request.getAttribute("hospitales");
%>
		<form action="HospitalServlet?action=/obtenerPorNombre" method="post">
			<input type="hidden" name="hidden" value="nombre">

			<div class="row">
				<label for="nombre" class="col-sm-2 col-form-label">Nombre:</label>
				<div class="col-sm-10 form-inline">
					<select class="form-select p-2" aria-label="nombre" id="nombre"	name="nombre" style="width: 80%">
						<%		if (listado != null) {%>
						<%			for (DtHospital hospital : listado) {  %>
										<option value="<%=hospital.getNombre()%>"><%=hospital.getNombre()%></option>
						<%			}	%>
						<%		} 	%>
					</select>
					<button type="submit" class="btn btn-primary m-1">Buscar</button>
				</div>
			</div>			
		</form>
		<br> <br> <a href="hospitalMenu.jsp"
			class="btn btn-primary">Atrás</a>
		<p style="color: red">${mensaje}</p>
	</div>
</body>
</html>