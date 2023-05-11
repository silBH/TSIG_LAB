package dao;

import java.sql.SQLException;
import javax.persistence.EntityManager;
import org.postgresql.util.PGobject;
import entity.Hospital;
import persistence.Conexion;
import org.postgis.Point;



public class HospitalDAO{

	Conexion conexion = Conexion.getInstancia();
	private EntityManager em = conexion.getEntityManager();
	
    public HospitalDAO() {}

    
    public Point getUbicacionHospital(String nombre) throws SQLException {
    	
    	System.out.println("HospitalDAO getUbicacionHospital");//--------------------------------------BORRAR   	
    	PGobject ubi = new PGobject();
    	ubi.setType("point");
    	Hospital hosp = em.find(Hospital.class, nombre);
    	if(hosp!=null) {
    		//ubi = hosp.getUbicacion();
    		//puntoObj.setValue(rs.getString("punto"));
    		ubi.setValue(hosp.getUbicacion().toString());
    	}
    	Point punto = new Point(ubi.getValue());
    	
    	return punto;
    }
    
    public void agregarDatos() throws SQLException {
    	
    	System.out.println("HospitalDAO agregarDatos");//--------------------------------------BORRAR
    	
		Point punto = new Point(574252.20, 6138698.90);
		punto.setSrid(32721);
		PGobject objeto = new PGobject();
		objeto.setType("geometry");
		objeto.setValue(punto.toString());
		
		Hospital hosp1 = new Hospital ("Hospital Universitario ABC", objeto);
		
		em.getTransaction().begin();
		em.persist(hosp1);
		em.getTransaction().commit();
		System.out.println("hospital agregado");
		
	}
}
