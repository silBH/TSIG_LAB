package business;

import java.util.List;
import javax.ejb.Local;
import datatype.DtServicioEmergencia;


@Local
public interface ServicioEmergenciaBusinessLocal {
	public List<DtServicioEmergencia> listar();
	public DtServicioEmergencia obtenerPorId(Long id);
	public void crear(DtServicioEmergencia servicio);
	public void editar(DtServicioEmergencia servicio);
	public void eliminar(DtServicioEmergencia servicio);
}
