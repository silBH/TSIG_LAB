package dao;

import java.util.List;
import javax.ejb.Local;
import entity.Administrador;

//estas funciones solo las utiliza la capa de bussiness

@Local
public interface AdministradorDAOLocal {	
	public List<Administrador> listar();
	public Administrador obtenerPorId(Long id);
	public Administrador obtenerPorUsername(String username);
	//crear si son necesarias
	public void crear(Administrador admin);
	public void editar(Administrador admin);
	public void eliminar(Administrador admin);
}
