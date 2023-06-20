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
    	String hospitalId = request.getParameter("hospitalId");
    	    
    	System.out.println("----------------- servlet id serviceId: " + serviceId);
    	System.out.println("----------------- servlet id hospitalId: " + hospitalId);
        
        try {
        	long idServicio = Long.parseLong(serviceId);
        	long idHospital = Long.parseLong(hospitalId);

            hospBusiness.agregarServicioEmergencia(idHospital, idServicio);
            //ServicioEmergencia nuevoServicio = servicioBusiness.obtenerPorIdObjeto(servId); 
            //--------------------------------------------------------------------------------------------ver si se puede arreglar bien esta funcion           
            
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
