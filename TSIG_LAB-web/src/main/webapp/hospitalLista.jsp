<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Listado de hospitales</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
	<div class="container mt-5">
    <h1>Listado de hospitales</h1>
    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach items="${hospitales}" var="hospital">
        	<tr>
            	<td>${hospital.id}</td>
            	<td>${hospital.nombre}</td>
            	<td>${hospital.tipo}</td>            	         	
        	</tr>
    		</c:forEach>
        </tbody>
    </table>
    <a href="hospitalMenu.jsp" class="btn btn-primary">Atrás</a>
    <br><br>
    <p style="color:red">${mensaje}</p>		
</div>

</body>
</html>