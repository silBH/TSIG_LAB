package servlets;

import javax.ejb.EJB;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import business.AdministradorBusinessLocal;
import datatype.DtAdministrador;

@WebServlet("/LoginAdmin")
public class LoginAdmin extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @EJB
    private AdministradorBusinessLocal administradorBusiness;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        try {
            // Crear un objeto DtAdministrador con los datos proporcionados
            DtAdministrador administrador = new DtAdministrador();
            administrador.setUsername(username);
            administrador.setPassword(password);

            // Llamar al método de inicio de sesión de AdministradorBusiness
            DtAdministrador loggedInAdmin = administradorBusiness.login(administrador);

            if (loggedInAdmin != null) {
                // Inicio de sesión exitoso
                request.getSession().setAttribute("loggedInAdmin", loggedInAdmin);
                request.getSession().setAttribute("nombre", loggedInAdmin.getNombre()); // Almacena el nombre del administrador
                request.getSession().setAttribute("message", "Inicio de sesión exitoso");
                response.sendRedirect("menuAdministrador.jsp"); // Redirecciona a menuAdministrador.jsp en caso de éxito
            } else {
                // Inicio de sesión fallido
                request.getSession().setAttribute("message", "Nombre de usuario o contraseña incorrectos");
                response.sendRedirect("index.jsp?loginError=true");
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Error en el inicio de sesión
            request.getSession().setAttribute("message", "Error en el inicio de sesión");
            response.sendRedirect("index.jsp?loginError=true");
        }
    }
}