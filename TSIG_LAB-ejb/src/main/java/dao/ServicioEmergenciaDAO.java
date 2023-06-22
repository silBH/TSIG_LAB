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
		//----------------------------- se manipula directo la base por problema de deserealizacion hibernate
		String sql = "INSERT INTO hospital_servicioemergencia (hospital_id, servicios_id) VALUES (:idHospital, :idServicio)";
	    Query query = em.createNativeQuery(sql);
	    query.setParameter("idHospital", idHospital);
	    query.setParameter("idServicio", idServicio);
	    query.executeUpdate();
	    System.out.println("servicioDAO - agregarServicioEmergencia --- FIN");
	}
    
    @Override
	public void actualizarServicio(Long idServicio, Long idHospNuevo, Long idHospViejo) {
    	//----------------------------- se manipula directo la base por problema de deserealizacion hibernate
		String sql = "UPDATE hospital_servicioemergencia SET hospital_id = :idHospNuevo WHERE hospital_id = :idHospViejo AND servicios_id = :idServicio";
	    Query query = em.createNativeQuery(sql);
	    query.setParameter("idHospNuevo", idHospNuevo);
	    query.setParameter("idHospViejo", idHospViejo);
	    query.setParameter("idServicio", idServicio);
	    query.executeUpdate();
	    System.out.println("servicioDAO - actualizarServicio --- FIN");
	}
   
    @Override
	public ServicioEmergencia obtenerPorId(Long id) {
    	System.out.println("----------------- obtenerPorId 1 ---- NO FUNCIONA");   //problema de deserealizacion 	
    	ServicioEmergencia obj = em.find(ServicioEmergencia.class, id);    	
    	return 	obj;
	}
    
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
		em.remove(servicio);
	}
    
    @Override
    public void eliminarID(Long servId) {
    	
    	em.getTransaction().begin();
    	String sql = "DELETE FROM hospital_servicioemergencia WHERE servicios_id = :servId";
    	Query query = em.createNativeQuery(sql);
	    query.setParameter("servId", servId);
	    query.executeUpdate();
	    em.getTransaction().commit();
	    
	    em.getTransaction().begin();
    	String sql2 = "DELETE FROM servicioemergencia WHERE id = :servId";
	    Query query2 = em.createNativeQuery(sql2);
	    query2.setParameter("servId", servId);
	    query2.executeUpdate();
	    em.getTransaction().commit();
    }
    
}
