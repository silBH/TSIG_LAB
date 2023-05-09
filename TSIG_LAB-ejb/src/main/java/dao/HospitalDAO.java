package dao;

import java.awt.Point;
import javax.persistence.EntityManager;

import entity.Hospital;
import persistence.Conexion;


public class HospitalDAO{

	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager();
	
    public HospitalDAO() {}

    
    public Point getUbicacionHospital(String nombre) {
    	Hospital hosp = em.find(Hospital.class, nombre);
    	Point ubi = null;
    	if(hosp!=null) {
    		ubi = hosp.getUbicacion();
    	}
    	return ubi;
    }
}
