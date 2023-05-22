package dao;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;

import entity.ServicioEmergencia;
import persistence.Conexion;

//estas funciones solo se usan desde la interfaz local

@Stateless
@LocalBean
public class ServicioEmergenciaDAO implements ServicioEmergenciaDAOLocal {

	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager();
	
    public ServicioEmergenciaDAO() {}
    
    @Override
	public List<ServicioEmergencia> listar(){
		//completar
		return null;
	}
    
    @Override
	public ServicioEmergencia obtenerPorId(Long id) {
		//completar
		return null;
	}
    
    @Override
	public void crear(ServicioEmergencia servicio) {
		//completar
	}
    
    @Override
	public void editar(ServicioEmergencia servicio) {
		//completar
	}
    
    @Override
	public void eliminar(ServicioEmergencia servicio) {
		//completar
	}
    
}
