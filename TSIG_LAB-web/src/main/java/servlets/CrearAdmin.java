package servlets;

import javax.ejb.EJB;
import entity.Administrador;
import dao.AdministradorDAOLocal;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 * Servlet implementation class CrearAdmin
 */
@WebServlet("/CrearAdmin")
public class CrearAdmin extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CrearAdmin() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	
	@EJB
    private AdministradorDAOLocal administradorDAO;
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		 // Obtener los parámetros del formulario
        String nombre = request.getParameter("nombre");
        String apellido = request.getParameter("apellido");
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        // Crear un nuevo administrador
        Administrador administrador = new Administrador();
        administrador.setNombre(nombre);
        administrador.setApellido(apellido);
        administrador.setUsername(username);
        administrador.setPassword(password);

        // Guardar el administrador en la base de datos
        administradorDAO.crear(administrador);

     // Configurar el mensaje de éxito
        String mensaje = "Administrador creado exitosamente.";

        // Establecer el tipo de contenido de la respuesta
        response.setContentType("text/html");
        // Obtener el escritor de la respuesta
        PrintWriter out = response.getWriter();

        // Escribir el mensaje en la respuesta
        out.println("<html><body>");
        out.println("<h2>" + mensaje + "</h2>");
        out.println("</body></html>");
	}

}
