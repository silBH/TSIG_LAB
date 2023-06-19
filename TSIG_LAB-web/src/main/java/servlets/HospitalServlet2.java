package servlets;

import java.io.IOException;
import java.util.List;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import business.HospitalBusinessLocal;
import business.ServicioEmergenciaBusinessLocal;
import entity.ServicioEmergencia;


@WebServlet("/HospitalServlet2")
public class HospitalServlet2 extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	@EJB HospitalBusinessLocal hospBusiness;
	@EJB ServicioEmergenciaBusinessLocal servicioBusiness;

    public HospitalServlet2() {
        super();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	String serviceId = request.getParameter("id");
        System.out.println("----------------- servlet id serviceId: " + serviceId);
        long servId = Long.parseLong(serviceId);
        System.out.println("----------------- servlet id servId: " + servId);

        try {
        	System.out.println("----------------- servlet 1");
        	ServicioEmergencia nuevoServicio = servicioBusiness.obtenerPorIdObjeto(servId);        	
            System.out.println("----------------- servlet id nuevoServicio: " + nuevoServicio.getId());
           // hospBusiness.agregarServicioEmergencia(nuevoServicio);
        } catch (Exception e) {
            // Error al parsear el ID del servicio
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }        	
        response.getWriter().append("Served at: ").append(request.getContextPath());
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		doGet(request, response);
	}

}
