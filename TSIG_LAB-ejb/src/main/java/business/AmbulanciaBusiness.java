package business;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;

import dao.AmbulanciaDAOLocal;
import datatype.DtAmbulancia;


//estas funciones son usadas desde la interfaz AmbulanciaBusinessLocal

@Stateless
@LocalBean
public class AmbulanciaBusiness implements AmbulanciaBusinessLocal {

	@EJB AmbulanciaDAOLocal ambulanciaData;
	
    public AmbulanciaBusiness() {}
    
	public List<DtAmbulancia> listar(){
		return null;
	}
	
	public List<DtAmbulancia> listarPorHospital(String hospital){
		return null;
	}
	
	public DtAmbulancia obtenerPorId(Long id) {
		return null;
	}
	
	public void crear(DtAmbulancia hospital) {
		
	}
	
	public void editar(DtAmbulancia hospital) {
		
	}
	
	public void eliminar(DtAmbulancia hospital){
		
	}
	
	@Override
	public void eliminarAmbulanciaId(Long id){
		System.out.println("----------------- eliminarAmbulanciaID 1");
		ambulanciaData.eliminarID(id);
    	System.out.println("----------------- eliminarAmbulanciaID 2");
	}
}
