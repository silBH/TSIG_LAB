package business;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;

import dao.ServicioEmergenciaDAOLocal;
import datatype.DtHospital;
import datatype.DtServicioEmergencia;
import entity.Hospital;
import entity.ServicioEmergencia;


@Stateless
@LocalBean
public class ServicioEmergenciaBusiness implements ServicioEmergenciaBusinessLocal {

	@EJB ServicioEmergenciaDAOLocal servicioData;
	
    public ServicioEmergenciaBusiness() {}

    @Override
	public List<DtServicioEmergencia> listar(){
    	//completar
		return null;
	}
	
    @Override
	public DtServicioEmergencia obtenerPorId(Long id) {
    	//completar
		return null;
	}
	
    @Override
    public ServicioEmergencia obtenerPorIdObjeto(Long id) {    	
    	ServicioEmergencia servicio = servicioData.obtenerPorId(id);    	
		if (servicio != null) {			
			return servicio;
		}
		return null;
    }
    
    @Override
	public void crear(DtServicioEmergencia servicio) {
    	//completar
	}
    
    @Override
	public void editar(DtServicioEmergencia servicio) {
    	//completar
	}
	
    @Override
	public void eliminar(DtServicioEmergencia servicio) {
    	//completar
	}
    
    @Override
    public void eliminarServicioId(Long id) {
    	System.out.println("----------------- eliminarServicioId 1");
    	servicioData.eliminarID(id);
    	System.out.println("----------------- eliminarServicioId 2");
    }
}
