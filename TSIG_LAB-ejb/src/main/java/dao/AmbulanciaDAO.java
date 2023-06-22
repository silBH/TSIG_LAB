package dao;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import entity.Ambulancia;
import persistence.Conexion;

//estas funciones son llamadas desde la inferfaz AmbulanciaDAOLocal

@Stateless
@LocalBean
public class AmbulanciaDAO implements AmbulanciaDAOLocal {
	
	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager(); 
	
    public AmbulanciaDAO() {}
    
    @Override
    public List<Ambulancia> listar(){
    	//completar
    	return null;
    }
    @Override
    public List<Ambulancia> listarPorHospital(String hospital){
    	//completar
    	return null;
    }
    @Override
	public Ambulancia obtenerPorId(Long id) {
    	//completar
		return null;
	}
    @Override
	public void crear(Ambulancia ambulancia) {
    	//completar
	}
    @Override
	public void editar(Ambulancia ambulancia) {
    	//completar
	}
    @Override
	public void eliminar(Ambulancia ambulancia) {
		System.out.println("----------------- eliminar dao ambu: 1 ");
		em.remove(ambulancia);
		System.out.println("----------------- eliminar dao  ambu: 2 ");
	}	
    @Override
    public void eliminarID(Long ambID) {  	
    	
    	em.getTransaction().begin();
    	String sql = "DELETE FROM hospital_ambulancia WHERE ambulancias_id = :ambID";
    	Query query = em.createNativeQuery(sql);
	    query.setParameter("ambID", ambID);
	    query.executeUpdate();
		em.getTransaction().commit();
	    
		em.getTransaction().begin();
    	String sql2 = "DELETE FROM ambulancia WHERE id = :ambID";
	    Query query2 = em.createNativeQuery(sql2);
	    query2.setParameter("ambID", ambID);
	    query2.executeUpdate();
		em.getTransaction().commit();
	    System.out.println("AMB DAO - eliminarID --- FIN");
    }

}
