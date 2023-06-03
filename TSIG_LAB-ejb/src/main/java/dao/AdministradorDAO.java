package dao;

import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import entity.Administrador;

@Stateless
public class AdministradorDAO implements AdministradorDAOLocal {

    @PersistenceContext(unitName = "TSIG_LABPersistenceUnit")
    private EntityManager em;

    public AdministradorDAO() {
    }

    @Override
    public List<Administrador> listar() {
        Query q = em.createQuery("SELECT a FROM Administrador a", Administrador.class);
        List<Administrador> result = q.getResultList();
        return result;
    }

    @Override
    public Administrador obtenerPorId(Long id) {
        return em.find(Administrador.class, id);
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

    @Override
    public void crear(Administrador admin) {
        em.persist(admin);
    }

    @Override
    public void editar(Administrador admin) {
        em.merge(admin);
    }

    @Override
    public void eliminar(Administrador admin) {
        em.remove(em.merge(admin));
    }
}
