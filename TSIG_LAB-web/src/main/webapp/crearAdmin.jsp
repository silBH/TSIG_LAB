<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Crear Administrador</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">

</head>

<body>
    <section class="vh-100 gradient-custom" style="height: 100vh;">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5 h-80">
            <div class="card bg-dark text-white" style="border-radius: 1rem;">
              <div class="card-body p-5 text-center">
  
                <form action="CrearAdmin" method="post" class="mb-md-5 mt-md-4 pb-2">
                  <h2 class="fw-bold mb-4 text-uppercase">Crear administrador</h2>  
                  <div class="form-outline form-white mb-4">
                    <input type="text" name="nombre" required placeholder="Nombre" class="form-control form-control-lg" />
                  </div>
  
                  <div class="form-outline form-white mb-4">
                    <input type="text" name="apellido" required placeholder="Apellido" class="form-control form-control-lg" />
                  </div>
  
                  <div class="form-outline form-white mb-4">
                    <input type="text" name="username" required placeholder="Username" class="form-control form-control-lg" />
                  </div>
    
                  <div class="form-outline form-white mb-4">
                    <input type="password" name="password" required placeholder="Password" class="form-control form-control-lg" />
                  </div>
                  <button class="btn btn-outline-light btn-lg px-5" type="submit">Crear</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </body>
  
  <style>
      .gradient-custom {
          /* Chrome 10-25, Safari 5.1-6 */
          background: -webkit-linear-gradient(to right, rgb(142, 195, 248), rgb(158, 158, 158));
          /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          background: linear-gradient(to right, rgb(142, 195, 248), rgb(158, 158, 158))
          }
  </style>
