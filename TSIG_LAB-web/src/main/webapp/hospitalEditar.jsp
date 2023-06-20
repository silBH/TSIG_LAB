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
	<title>Editar hospital</title>
</head>
<body>

	<div class="container mt-5">
		<h2>Editar hospital</h2>
		<br>
		<form class="form-horizontal" action="HospitalServlet?action=/editar" method="post">
		    <div class="form-group row">
		        <label class="col-sm-2 col-form-label">Id:</label>
		        <div class="col-sm-10 border">
		            <p class="form-control-plaintext">${hospital.id}</p>
		            <input type="hidden" name="id" value="${hospital.id}">
		        </div>
		    </div>
		    <div class="form-group row">
		        <label class="col-sm-2 col-form-label">Nombre:</label>
		        <div class="col-sm-10">
		        	<input type="text" class="form-control" name="nombre" value="${hospital.nombre}">		        			            
		        </div>
		    </div>		    
		    <div class="form-group row">
		        <label class="col-sm-2 col-form-label">Tipo:</label>
		        <div class="form-group">
					<select class="form-control" id="tipo" name="tipo">
						<option>Mutualista</option>
						<option>Seguro Privado</option>
						<option>Servicio Estatal</option>
					</select>
				</div>
		    </div>
		    <div class="form-group row">
		    	<button type="submit" name="action" value="/editar" class="btn btn-primary m-1">Modificar</button>
                <a href="hospitalMenu.jsp" class="btn btn-info m-1">Atr�s</a>
		    </div>         
		</form>
		<br><br>
		<p style="color:red">${mensaje}</p>
	</div>
</body>
</html>