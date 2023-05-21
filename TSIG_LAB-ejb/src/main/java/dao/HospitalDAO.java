package dao;

import javax.persistence.EntityManager;

import entity.Hospital;
import persistence.Conexion;

public class HospitalDAO{

	@SuppressWarnings("unused")
	private EntityManager em; 
	
    public HospitalDAO() {
    	Conexion conexion = Conexion.getInstancia();
    	conexion.getEntityManager();
    }

    public void guardar(Hospital hospital) {

    }

    public Hospital obtenerPorId(int id) {

        return null;
    }

    public void actualizar(Hospital hospital) {

    }

    public void eliminar(Hospital hospital) {

    }
}
