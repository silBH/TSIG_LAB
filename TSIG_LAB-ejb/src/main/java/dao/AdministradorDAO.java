package dao;

import java.util.List;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import entity.Administrador;
import persistence.Conexion;

//estas funciones solo se usan desde la interfaz local

@Stateless
@LocalBean
public class AdministradorDAO implements AdministradorDAOLocal {

	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager(); 
	
    public AdministradorDAO() {
    }

    @Override
	public List<Administrador> listar(){
    	Query q = em.createNativeQuery("select * from Administrador", Administrador.class);
		List<Administrador> result = q.getResultList();
    	return result;
	}
    
    @Override
	public Administrador obtenerPorId(Long id) {
    	//completar
		return null;
	}
    
    @Override
	public Administrador obtenerPorUsername(String username) {
    	//completar
    	return null;
    }
	
	//crear si son necesarias porque no se pide modificaciones del administrador
	//public void crear(Administrador admin);
	//public void editar(Administrador admin);
	//public void eliminar(Administrador admin);
}
