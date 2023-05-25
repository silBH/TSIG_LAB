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
        Query query = em.createQuery("SELECT a FROM Administrador a WHERE a.id = :id", Administrador.class);
        query.setParameter("id", id);
        List<Administrador> result = query.getResultList();
        if (!result.isEmpty()) {
            return result.get(0);
        }
        return null;
    }

    @Override
    public Administrador obtenerPorUsername(String username) {
        Query query = em.createQuery("SELECT a FROM Administrador a WHERE a.username = :username", Administrador.class);
        query.setParameter("username", username);
        List<Administrador> result = query.getResultList();
        if (!result.isEmpty()) {
            return result.get(0);
        }
        return null;
    }
	
	//crear si son necesarias porque no se pide modificaciones del administrador
    public void crear(Administrador admin) {
        em.persist(admin);
    }

    public void editar(Administrador admin) {
        em.merge(admin);
    }

    public void eliminar(Administrador admin) {
        em.remove(admin);
    }
}
