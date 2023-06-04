<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
    
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
	<head>
    	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	</head>
	<title>Datos hospital</title>
</head>
<body>
	<div class="container mt-5">
		<h2>Datos de hospital</h2>
		<br>
		<form class="form-horizontal" action="HospitalServlet" method="post">
		    <div class="form-group row">
		        <label class="col-sm-2 col-form-label">Id:</label>
		        <div class="col-sm-10 border">
		            <p class="form-control-plaintext">${hospital.id}</p>
		            <input type="hidden" name="id" value="${hospital.id}">
		        </div>
		    </div>
		    <div class="form-group row">
		        <label class="col-sm-2 col-form-label">Nombre:</label>
		        <div class="col-sm-10 border">
		            <!-- <p class="form-control-plaintext">${hospital.nombre}</p> -->
		            <input type="text" class="form-control-plaintext" name="nombre" value="${hospital.nombre}">
		        </div>
		    </div>
		    <div class="form-group row">		        
		        <div class="form-group">
		        <label class="col-sm-2 col-form-label">Tipo:</label>
					<div class="form-group">						
					    <select class="form-control" id="tipo" name="tipo">
					    	<% String hospitalTipo = request.getAttribute("hospitalTipo").toString(); %>
					        <option <%= "MUTUALISTA".equals(hospitalTipo) ? "selected" : "" %>>Mutualista</option>
                			<option <%= "SEGURO_PRIVADO".equals(hospitalTipo) ? "selected" : "" %>>Seguro Privado</option>
                			<option <%= "SERVICIO_ESTATAL".equals(hospitalTipo) ? "selected" : "" %>>Servicio Estatal</option>
					    </select>
					</div>					
				</div>
		    </div>
		    <div class="form-group row">
		    	<button type="submit" name="action" value="/editar" class="btn btn-danger m-1">Modificar</button>
                <button type="submit" name="action" value="/eliminar" class="btn btn-danger m-1">Eliminar</button>
                <button type="submit" name="action" value="/agregarServicioEmergencia" class="btn btn-primary m-1">Agregar Servicio</button>    
                <button type="submit" name="action" value="/agregarAmbulancia" class="btn btn-primary m-1">Agregar Ambulancia</button>
		        <a href="hospitalMenu.jsp" class="btn btn-info m-1">Atrás</a>
		    </div>         
		</form>

		<br><br>
		<p style="color:red">${mensaje}</p>
	</div>
</body>
</html>