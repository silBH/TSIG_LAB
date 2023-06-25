package dao;

import java.util.List;
import javax.ejb.Local;
import entity.Ambulancia;
import entity.Hospital;

//estas funciones solo las utiliza la capa de bussiness

@Local
public interface AmbulanciaDAOLocal {
	public List<Ambulancia> listar();
	public List<Ambulancia> listarPorHospital(String hospital);
	public Ambulancia obtenerPorId(Long id);
	public void crear(Ambulancia hospital);
	public void editar(Ambulancia hospital);
	public void eliminar(Ambulancia hospital);	
	public void eliminarID(Long id);
}
