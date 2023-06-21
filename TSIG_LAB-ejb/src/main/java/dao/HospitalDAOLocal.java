package dao;

import java.util.List;

import javax.ejb.Local;
import entity.Hospital;

//estas funciones solo las utiliza la capa de bussiness

@Local
public interface HospitalDAOLocal {
	public List<Hospital> listar();
	public Hospital obtenerPorId(Long id);
	public Hospital obtenerPorNombre(String nombre);
	public void crear(Hospital hospital);
	public void editar(Hospital hospital);
	public void eliminar(Hospital hospital);	
}
