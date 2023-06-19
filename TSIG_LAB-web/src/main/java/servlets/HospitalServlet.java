package servlets;

import java.io.IOException;
import java.util.List;

import javax.ejb.EJB;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import business.AmbulanciaBusinessLocal;
import business.HospitalBusinessLocal;
import business.ServicioEmergenciaBusinessLocal;
import datatype.DtHospital;
import datatype.DtServicioEmergencia;
import datatype.TipoHospital;
import entity.Hospital;
import entity.ServicioEmergencia;

@WebServlet("/HospitalServlet")
public class HospitalServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@EJB HospitalBusinessLocal hospBusiness;
	@EJB ServicioEmergenciaBusinessLocal servicioBusiness;
	@EJB AmbulanciaBusinessLocal ambulanciaBusiness;

	public HospitalServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String action = request.getParameter("action");
		System.out.println(action);
		
		try {
			if (action == null) {
				throw new Exception("No se proporcionó una acción válida.");
			}

			switch (action) {
			case "/listar":
				listarHospitales(request, response);
				break;
			case "/obtenerPorId":
				obtenerHospitalPorId(request, response);
				break;
			case "/obtenerPorNombre":
				obtenerHospitalPorNombre(request, response);
				break;
			case "/crear":
				crearHospital(request, response);
				break;
			case "/editar":
				editarHospital(request, response);
				break;
			case "/eliminar":
				eliminarHospital(request, response);
				break;
			case "/agregarServicioEmergencia":
				agregarServicioEmergencia(request, response);
				break;
			case "/agregarAmbulancia":
				agregarAmbulancia(request, response);
				break;
			case "/eliminarServicioEmergencia":
				eliminarServicioEmergencia(request, response);
				break;
			case "/eliminarAmbulancia":
				eliminarAmbulancia(request, response);
				break;
			default:
				throw new Exception("Acción desconocida: " + action);
			}
		} catch (Exception e) {
			response.getWriter().append("Error: ").append(e.getMessage());
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);		
	}

	private void listarHospitales(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		List<DtHospital> hospitales = hospBusiness.listar();
		request.setAttribute("hospitales", hospitales);
		RequestDispatcher dispatcher = request.getRequestDispatcher("hospitalLista.jsp"); 
	    dispatcher.forward(request, response);		
	}

	private void obtenerHospitalPorId(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Long id = Long.parseLong(request.getParameter("id"));
		DtHospital hospital = hospBusiness.obtenerPorId(id);
		request.setAttribute("hospital", hospital);
		if(hospital.getTipo()==null) {
			request.setAttribute("hospitalTipo", "MUTUALISTA");
		}else {
			request.setAttribute("hospitalTipo", hospital.getTipo());
		}
		
		RequestDispatcher dispatcher = request.getRequestDispatcher("hospitalMostrar.jsp"); 
        dispatcher.forward(request, response);
        
	}

	private void obtenerHospitalPorNombre(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String nombre = request.getParameter("nombre");
		DtHospital hospital = hospBusiness.obtenerPorNombre(nombre);
		request.setAttribute("hospital", hospital);
		RequestDispatcher dispatcher = request.getRequestDispatcher("hospitalMostrar.jsp"); 
        dispatcher.forward(request, response);
	}

	private void crearHospital(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String nombre = request.getParameter("nombre");
		String t = request.getParameter("tipo");
		TipoHospital tipo = null; 
		if(t.equals("Mutualista")) {
			tipo = TipoHospital.MUTUALISTA;
		}else if(t.equals("Seguro Privado")) {
			tipo = TipoHospital.SEGURO_PRIVADO;
		}else if(t.equals("Servicio Estatal")){
			tipo = TipoHospital.SERVICIO_ESTATAL;			
		}
		DtHospital hospital = new DtHospital(null, nombre, tipo, null, null);
		hospBusiness.crear(hospital);
		response.sendRedirect("hospitalMenu.jsp");
	}

	private void editarHospital(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Long id = Long.parseLong(request.getParameter("id"));
		String nombre = request.getParameter("nombre");
		String t = request.getParameter("tipo");
		TipoHospital tipo = null; 
		if(t.equals("Mutualista")) {
			tipo = TipoHospital.MUTUALISTA;
		}else if(t.equals("Seguro Privado")) {
			tipo = TipoHospital.SEGURO_PRIVADO;
		}else if(t.equals("Servicio Estatal")){
			tipo = TipoHospital.SERVICIO_ESTATAL;			
		}
		DtHospital hospital = new DtHospital(id, nombre, tipo, null, null);
		hospBusiness.editar(hospital);
		response.sendRedirect("hospitalMenu.jsp");
	}

	private void eliminarHospital(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Long id = Long.parseLong(request.getParameter("id"));
		hospBusiness.eliminar(id);
		response.sendRedirect("hospitalMenu.jsp");		
	}

	private void agregarServicioEmergencia(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		System.out.println("-------------- servlet ----  agregarServicioEmergencia 1");
		List<DtServicioEmergencia> servicios = servicioBusiness.listar();
		
		if (!servicios.isEmpty()) {
		    // Obtener el último elemento de la lista
		    DtServicioEmergencia ultimoServicio = servicios.get(servicios.size() - 1);
		    Hospital hospital = ultimoServicio.getHospital();
		    List<ServicioEmergencia> listado = hospital.getServicios();
		    ServicioEmergencia servicio = servicioBusiness.obtenerPorIdObjeto(ultimoServicio.getId());
			listado.add(servicio);
			System.out.println("-------------- servlet ----  agregarServicioEmergencia 2");
		}
		System.out.println("-------------- servlet ----  agregarServicioEmergencia 3");
		response.sendRedirect("hospitalMenu.jsp");
	}

	private void agregarAmbulancia(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.sendRedirect("hospitalMenu.jsp");
	}

	private void eliminarServicioEmergencia(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.sendRedirect("hospitalMenu.jsp");
	}

	private void eliminarAmbulancia(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.sendRedirect("hospitalMenu.jsp");
	}
}
