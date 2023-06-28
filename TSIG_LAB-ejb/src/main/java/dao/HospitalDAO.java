package dao;

import java.util.List;
import java.util.ArrayList;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import persistence.Conexion;
import entity.Hospital;
import entity.ServicioEmergencia;
import java.math.BigInteger;

import java.util.List;
//estas funciones solo se usan desde la interfaz local

@Stateless
@LocalBean
public class HospitalDAO implements HospitalDAOLocal {

	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager();

	@EJB
	ServicioEmergenciaDAOLocal dataServicio;
	@EJB
	AmbulanciaDAOLocal dataAmbulancia;

	public HospitalDAO() {
	}

	@Override
	public List<Hospital> listar() {
		Query q = em.createQuery("SELECT h FROM Hospital h", Hospital.class);
		List<Hospital> result = q.getResultList();
		return result;
	}

	@Override
	public Hospital obtenerPorId(Long id) {
		return em.find(Hospital.class, id);
	}

	@Override
	public Hospital obtenerPorNombre(String nombre) {
		Query query = em.createQuery("SELECT h FROM Hospital h WHERE h.nombre = :nombre", Hospital.class);
		query.setParameter("nombre", nombre);
		List<Hospital> result = query.getResultList();
		if (!result.isEmpty()) {
			return result.get(0);
		}
		return null;
	}

	@Override
	public void crear(Hospital hospital) {
		em.persist(hospital);
	}

	@Override
	public void editar(Hospital hospital) {
		em.merge(hospital);
	}

	@Override
	public void eliminar(Long id) {

		// elimino asociaciones
		em.getTransaction().begin();
		String sql = "DELETE FROM hospital_servicioemergencia WHERE hospital_id = :id";
		Query query = em.createNativeQuery(sql);
		query.setParameter("id", id);
		query.executeUpdate();
		em.getTransaction().commit();	
	
		em.getTransaction().begin();
		String sql2 = "DELETE FROM hospital_ambulancia WHERE hospital_id = :id";
		Query query2 = em.createNativeQuery(sql2);
		query2.setParameter("id", id);
		query2.executeUpdate();
		em.getTransaction().commit();	
		
		// elimina ambulancias
		em.getTransaction().begin();
		String sql3 = "DELETE FROM ambulancia WHERE hospital_id = :id";
		Query query3 = em.createNativeQuery(sql3);
		query3.setParameter("id", id);
		query3.executeUpdate();
		em.getTransaction().commit();

		// elimina servicios
		em.getTransaction().begin();
		String sql4 = "DELETE FROM servicioemergencia WHERE hospital_id = :id";
		Query query4 = em.createNativeQuery(sql4);
		query4.setParameter("id", id);
		query4.executeUpdate();
		em.getTransaction().commit();

		// elimina hospital
		
		em.getTransaction().begin();
		String sql5 = "DELETE FROM hospital WHERE id = :id";
		Query query5 = em.createNativeQuery(sql5);
		query5.setParameter("id", id);
		query5.executeUpdate();
		em.getTransaction().commit();

		System.out.println("----------------- eliminar dao hosp: FIN");
	}
}
