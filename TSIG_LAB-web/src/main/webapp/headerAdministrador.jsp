<%@ page import="javax.servlet.http.HttpSession" %>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
</head>

<header class="p-3 mb-3 border-bottom">
    <div class="container">
        <div class="d-flex align-items-center justify-content-between">
            <img src="amb.png" alt="Logo">
            <div class="d-flex flex-row align-items-center">
                <div class="mr-3">Bienvenido, <%= request.getSession().getAttribute("nombre") %></div>
                <a href="crearAdmin.jsp" class="btn btn-outline-info mr-2">Crear Admin</a>
                <a href="#" class="btn btn-outline-danger" onclick="confirmarCerrarSesion()">Cerrar sesion</a>
            </div>
        </div>
    </div>

    <script>
        function confirmarCerrarSesion() {
            if (confirm('Desea cerrar sesion?')) {
                window.location.href = "index.jsp";
            }
        }
    </script>
</header>