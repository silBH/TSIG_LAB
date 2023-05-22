package dao;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import persistence.Conexion;
import entity.Hospital;

//estas funciones solo se usan desde la interfaz local

@Stateless
@LocalBean
public class HospitalDAO implements HospitalDAOLocal {

	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager(); 
	
    public HospitalDAO() {}
    
    @Override
	public List<Hospital> listar(){
		//completar
		return null;
	}
    
    @Override
	public Hospital obtenerPorId(Long id) {
		//completar
		return null;
	}
    
    @Override
	public Hospital obtenerPorNombre(String nombre) {
		//completar
		return null;
	}
    
    @Override
	public void crear(Hospital hospital) {
		//completar
	}
    
    @Override
	public void editar(Hospital hospital) {
		//completar
	}
    
    @Override
	public void eliminar(Hospital hospital) {
		//completar
	}


}
