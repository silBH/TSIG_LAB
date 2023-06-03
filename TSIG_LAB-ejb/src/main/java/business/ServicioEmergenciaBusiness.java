package business;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;

import dao.ServicioEmergenciaDAOLocal;
import datatype.DtServicioEmergencia;


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
}
