package business;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;

import dao.HospitalDAOLocal;
import datatype.DtHospital;

//estas funciones son usadas desde la interfaz HospitalBusinessLocal

@Stateless
@LocalBean
public class HospitalBusiness implements HospitalBusinessLocal {

	@EJB HospitalDAOLocal hopitalData;
	
    public HospitalBusiness() {}
    
    @Override
	public List<DtHospital> listar(){
		return null;
	}
	
    @Override
	public DtHospital obtenerPorId(Long id) {
		return null;
	}
	
    @Override
	public DtHospital obtenerPorNombre(String nombre) {
		return null;
	}
    
    @Override
	public void crear(DtHospital hospital) {
		
	}
    
    @Override
	public void editar(DtHospital hospital) {
		
	}
    
    @Override
	public void eliminar(DtHospital hospital) {
		
	}

}
