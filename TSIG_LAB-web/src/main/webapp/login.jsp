<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Iniciar sesión</title>
</head>
<body>
    <h1>Iniciar sesión</h1>
    <%-- Mostrar mensaje de inicio de sesión --%>
    <% String mensaje = (String) session.getAttribute("message"); %>
    <% if (mensaje != null && !mensaje.isEmpty()) { %>
        <p><%= mensaje %></p>
    <% } %>
    <form action="LoginAdmin" method="post">
        <label for="username">Nombre de usuario:</label>
        <input type="text" name="username" id="username" required><br>
        <label for="password">Contraseña:</label>
        <input type="password" name="password" id="password" required><br>
        <input type="submit" value="Iniciar sesión">
    </form>
</body>
</html>
