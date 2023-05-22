package business;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;

import datatype.DtAmbulancia;


//estas funciones son usadas desde la interfaz AmbulanciaBusinessLocal

@Stateless
@LocalBean
public class AmbulanciaBusiness implements AmbulanciaBusinessLocal {

	@EJB AmbulanciaBusinessLocal ambulanciaData;
	
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
}
