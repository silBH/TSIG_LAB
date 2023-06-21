package servlets;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.PrintWriter;
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
import datatype.TipoHospital;

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
			case "/actualizarServicio":
				actualizarServicioEmergencia(request, response);
				break;
			case "/agregarAmbulancia":
				agregarAmbulancia(request, response);
				break;
			case "/agregarServicio":
				agregarServicio(request, response);
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
		// Convertir la lista de hospitales a JSON
	    ObjectMapper mapper = new ObjectMapper();
	    String jsonHospitales = mapper.writeValueAsString(hospitales);
		request.setAttribute("hospitales", hospitales);
		// Establecer el encabezado Content-Type para indicar que la respuesta es JSON
	    response.setContentType("application/json");

	    // Enviar la respuesta JSON al cliente
	    PrintWriter out = response.getWriter();
	    out.print(jsonHospitales);
	    out.flush();
		//RequestDispatcher dispatcher = request.getRequestDispatcher("hospitalLista.jsp"); 
	    //dispatcher.forward(request, response);		
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
		
		System.out.println("----------------- servlet nombre: " + nombre);
		System.out.println("----------------- servlet tipo: " + t);
		
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

	private void actualizarServicioEmergencia(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String serviceId = request.getParameter("servicioId");    	
    	String hospIdNuevo = request.getParameter("hospIdNuevo");
    	String hospIdViejo = request.getParameter("hospIdViejo");
    	    
    	System.out.println("----------------- servlet serviceId: " + serviceId);
    	System.out.println("----------------- servlet hospIdNuevo: " + hospIdNuevo);
    	System.out.println("----------------- servlet hospIdViejo: " + hospIdViejo);
    	
    	try {
    		long idServicio = Long.parseLong(serviceId);
        	long idHospNuevo = Long.parseLong(hospIdNuevo);
        	long idHospViejo = Long.parseLong(hospIdViejo);
        	hospBusiness.actualizarServicioEmergencia(idServicio, idHospNuevo, idHospViejo);
        	
    	} catch (Exception e) {
            // Error al parsear el ID del servicio
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }
	}

	private void agregarAmbulancia(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.sendRedirect("hospitalMenu.jsp");
	}

	private void agregarServicio(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
				
		String serviceId = request.getParameter("id");    	
    	String hospitalId = request.getParameter("hospitalId");
    	    
    	System.out.println("----------------- servlet id serviceId: " + serviceId);
    	System.out.println("----------------- servlet id hospitalId: " + hospitalId);
        
        try {
        	long idServicio = Long.parseLong(serviceId);
        	long idHospital = Long.parseLong(hospitalId);

            hospBusiness.agregarServicioEmergencia(idHospital, idServicio);
            
        } catch (Exception e) {
            // Error al parsear el ID del servicio
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }        	
        response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	private void eliminarAmbulancia(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.sendRedirect("hospitalMenu.jsp");
	}
}