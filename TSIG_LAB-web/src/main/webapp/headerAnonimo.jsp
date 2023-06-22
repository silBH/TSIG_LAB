<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
</head>

<header class="p-3 mb-3 border-bottom">
    <div class="container">
        <div class="d-flex align-items-center justify-content-between">
            <div style="font-weight: bolder">LOGO</div>
            <div class="d-flex flex-row align-items-center">
                <form class="form-inline" action="LoginAdmin" method="post">
                    <input type="text"  class="form-control mr-2" placeholder="Usuario" name="username" id="username" required>
                    <input type="password"  class="form-control mr-2" placeholder="Contraseña" name="password" id="password" required>
                    <input type="submit" class="btn btn-primary" value="Iniciar sesión">
                </form>
            </div>
        </div>
    </div>
</header>
