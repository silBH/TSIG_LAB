package business;

import java.sql.SQLException;

import javax.ejb.Remote;

import org.postgis.Point;

@Remote
public interface HospitalBusinessRemote {
	public void agregarDatos() throws SQLException;
	public Point getUbicacionHospital(String nombre) throws SQLException;
}
