package dao;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.query.NativeQuery;

import entity.Hospital;
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
    	Query q = em.createQuery("SELECT se FROM ServicioEmergencia se", ServicioEmergencia.class);
		List<ServicioEmergencia> result = q.getResultList();		
		return result;
	}
    
    @Override
	public void agregarServicioEmergencia(Long idHospital, Long idServicio) throws Exception{
		System.out.println("servicioDAO - agregarServicioEmergencia"); //----------------------------- VER SI SE CAMBIA FUNCION		
		String sql = "INSERT INTO hospital_servicioemergencia (hospital_id, servicios_id) VALUES (:idHospital, :idServicio)";
	    Query query = em.createNativeQuery(sql);
	    query.setParameter("idHospital", idHospital);
	    query.setParameter("idServicio", idServicio);
	    query.executeUpdate();		
	}
    
   
    @Override
	public ServicioEmergencia obtenerPorId(Long id) {
    	System.out.println("----------------- obtenerPorId 1 ---- NO FUNCIONA");    	
    	ServicioEmergencia obj = em.find(ServicioEmergencia.class, id);    	
    	return 	obj;
	}/*
    @Override 
    public ServicioEmergencia obtenerPorId(Long id) {
    	System.out.println("----------------obtenerPorId 1");
        TypedQuery<ServicioEmergencia> query = em.createQuery(
            "SELECT se FROM ServicioEmergencia se WHERE se.id = :id", 
            ServicioEmergencia.class
        );
        query.setParameter("id", id);

        try {
        	System.out.println("----------------obtenerPorId 2");
            return query.getSingleResult();            
        } catch (NoResultException e) {
        	System.out.println("----------------obtenerPorId 3");
            return null; // El servicio de emergencia no existe con el ID proporcionado
        }
    }
    @Override
    public ServicioEmergencia obtenerPorId(Long id) {
        String sql = "SELECT * FROM servicioemergencia WHERE id = :id";
        @SuppressWarnings("unchecked")
		NativeQuery<ServicioEmergencia> query = (NativeQuery<ServicioEmergencia>) em.createNativeQuery(sql, ServicioEmergencia.class);
        query.setParameter("id", id);

        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null; // El servicio de emergencia no existe con el ID proporcionado
        }
    }*/
    
    @Override
	public void crear(ServicioEmergencia servicio) {
		//se hace por geoserver
	}
    
    @Override
	public void editar(ServicioEmergencia servicio) {
    	//se hace por geoserver
	}
    
    @Override
	public void eliminar(ServicioEmergencia servicio) {
		//se hace por geoserver
	}
    
}
