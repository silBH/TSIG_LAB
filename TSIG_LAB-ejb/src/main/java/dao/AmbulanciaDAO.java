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

	public AmbulanciaDAO() {
	}

	@Override
	public List<Ambulancia> listar() {
		// completar
		return null;
	}

	@Override
	public List<Ambulancia> listarPorHospital(String hospital) {
		// completar
		return null;
	}

	@Override
	public Ambulancia obtenerPorId(Long id) {
		// completar
		return null;
	}

	@Override
	public void crear(Ambulancia ambulancia) {
		// completar
	}

	public void agregarAmbulancia(Long idHospital, Long idAmbulancia) throws Exception {
		// ----------------------------- se manipula directo la base por problema de
		// deserealizacion hibernate
		String sql = "INSERT INTO hospital_ambulancia (hospital_id, ambulancias_id) VALUES (:idHospital, :idAmbulancia)";
		Query query = em.createNativeQuery(sql);
		query.setParameter("idHospital", idHospital);
		query.setParameter("idAmbulancia", idAmbulancia);
		query.executeUpdate();
		System.out.println("ambulanciaDAO - agregarAmbulancia --- FIN");
	}

	@Override
	public void editar(Ambulancia ambulancia) {
		// completar
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
		String sqlNombre = "SELECT nombre FROM ambulancia WHERE id = :ambID";
		Query queryNombre = em.createNativeQuery(sqlNombre);
		queryNombre.setParameter("ambID", ambID);
		String nombreAmbulancia = (String) queryNombre.getSingleResult();
		em.getTransaction().commit();
		System.out.println("AMB DAO - eliminarID ambu--- 1");

		em.getTransaction().begin();
		String sqlZona = "DELETE FROM zona WHERE nombre = :nombreAmbulancia";
		Query queryZona = em.createNativeQuery(sqlZona);
		queryZona.setParameter("nombreAmbulancia", nombreAmbulancia);
		queryZona.executeUpdate();
		em.getTransaction().commit();
		System.out.println("AMB DAO - eliminarID ambu--- 2");

		em.getTransaction().begin();
		String sql = "DELETE FROM hospital_ambulancia WHERE ambulancias_id = :ambID";
		Query query = em.createNativeQuery(sql);
		query.setParameter("ambID", ambID);
		query.executeUpdate();
		em.getTransaction().commit();

		System.out.println("AMB DAO - eliminarID ambu--- 3");
		em.getTransaction().begin();
		String sql2 = "DELETE FROM ambulancia WHERE id = :ambID";
		Query query2 = em.createNativeQuery(sql2);
		query2.setParameter("ambID", ambID);
		query2.executeUpdate();
		em.getTransaction().commit();
		System.out.println("AMB DAO - eliminarID ambu--- FIN");
	}

}
