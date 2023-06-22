<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
</head>

<header class="p-3 mb-3 border-bottom">
    <div class="container">
        <div class="d-flex align-items-center justify-content-between">
            <img src="amb.png" alt="Logo">
            <div class="d-flex flex-row align-items-center">
                <form class="form-inline" action="LoginAdmin" method="post">
                    <input type="text"  class="form-control mr-2" placeholder="Usuario" name="username" id="username" required>
                    <input type="password"  class="form-control mr-2" placeholder="Password" name="password" id="password" required>
                    <input type="submit" class="btn btn-outline-primary" value="Iniciar sesion">
                </form>
            </div>
        </div>
    </div>
</header>
