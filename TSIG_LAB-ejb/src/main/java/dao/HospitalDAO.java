package dao;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import persistence.Conexion;
import entity.Hospital;
import entity.ServicioEmergencia;

//estas funciones solo se usan desde la interfaz local

@Stateless
@LocalBean
public class HospitalDAO implements HospitalDAOLocal {

	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager();

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
	public void eliminar(Hospital hospital) {
		em.remove(em.merge(hospital));
	}
		
}
