package dao;

import javax.persistence.EntityManager;
import persistence.Conexion;



public class HospitalDAO{

	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager();
	
    public HospitalDAO() {}

}
