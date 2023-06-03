<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Crear Administrador</title>
</head>
<body>
    <h1>Crear Administrador</h1>
    
    <%-- Formulario para crear un nuevo administrador --%>
    <form action="CrearAdmin" method="post">
        <label for="nombre">Nombre:</label>
        <input type="text" name="nombre" required><br>
        
        <label for="apellido">Apellido:</label>
        <input type="text" name="apellido" required><br>
        
        <label for="username">Username:</label>
        <input type="text" name="username" required><br>
        
        <label for="password">Contraseña:</label>
        <input type="password" name="password" required><br>
        
        <input type="submit" value="Crear">
    </form>
</body>
</html>
