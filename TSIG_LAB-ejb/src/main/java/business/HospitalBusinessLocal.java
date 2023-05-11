package business;

import java.sql.SQLException;

import javax.ejb.Local;

import org.postgis.Point;

@Local
public interface HospitalBusinessLocal {
	public void agregarDatos() throws SQLException;
	public Point getUbicacionHospital(String nombre) throws SQLException;
}
