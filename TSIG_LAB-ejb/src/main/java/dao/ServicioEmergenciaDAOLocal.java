package dao;

import java.util.List;
import javax.ejb.Local;
import entity.ServicioEmergencia;

//estas funciones solo las utiliza la capa de bussiness

@Local
public interface ServicioEmergenciaDAOLocal {
	public List<ServicioEmergencia> listar();
	public ServicioEmergencia obtenerPorId(Long id);
	public void crear(ServicioEmergencia servicio);
	public void editar(ServicioEmergencia servicio);
	public void eliminar(ServicioEmergencia servicio);
	public void agregarServicioEmergencia(Long idHospital, Long idServicio) throws Exception;
}
