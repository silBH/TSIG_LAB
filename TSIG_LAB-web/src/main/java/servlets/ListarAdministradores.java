package servlets;
import javax.ejb.EJB;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import business.AdministradorBusinessLocal;
import datatype.DtAdministrador;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/ListarAdministradores")
public class ListarAdministradores extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @EJB
    private AdministradorBusinessLocal administradorBusiness;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        out.println("<html><body>");
        out.println("<h1>Lista de Administradores</h1>");

        try {
            List<DtAdministrador> administradores = administradorBusiness.listar();

            if (administradores != null && !administradores.isEmpty()) {
                out.println("<table>");
                out.println("<tr><th>Nombre</th><th>Apellido</th><th>Usuario</th><th>Contraseña</th></tr>");

                for (DtAdministrador administrador : administradores) {
                    out.println("<tr>");
                    //out.println("<td>" + administrador.getId() + "</td>");
                    out.println("<td>" + administrador.getNombre() + "</td>");
                    out.println("<td>" + administrador.getApellido() + "</td>");
                    out.println("<td>" + administrador.getUsername() + "</td>");
                    out.println("<td>" + administrador.getPassword() + "</td>");
                    out.println("</tr>");
                }

                out.println("</table>");
            } else {
                out.println("<p>No se encontraron administradores.</p>");
            }
        } catch (Exception e) {
            out.println("<p>Ocurrió un error al obtener la lista de administradores.</p>");
            e.printStackTrace();
        }

        out.println("</body></html>");
    }
}
