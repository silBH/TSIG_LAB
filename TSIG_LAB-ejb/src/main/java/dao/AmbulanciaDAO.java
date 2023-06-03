package dao;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;

import entity.Ambulancia;
import persistence.Conexion;

//estas funciones son llamadas desde la inferfaz AmbulanciaDAOLocal

@Stateless
@LocalBean
public class AmbulanciaDAO implements AmbulanciaDAOLocal {
	
	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager(); 
	
    public AmbulanciaDAO() {}
    
    public List<Ambulancia> listar(){
    	//completar
    	return null;
    }
    public List<Ambulancia> listarPorHospital(String hospital){
    	//completar
    	return null;
    }
	public Ambulancia obtenerPorId(Long id) {
    	//completar
		return null;
	}
	public void crear(Ambulancia hospital) {
    	//completar
	}
	public void editar(Ambulancia hospital) {
    	//completar
	}
	public void eliminar(Ambulancia hospital) {
    	//completar
	}

}
