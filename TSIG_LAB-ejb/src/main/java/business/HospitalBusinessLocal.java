package business;

import java.util.List;
import javax.ejb.Local;

import datatype.DtAmbulancia;
import datatype.DtHospital;
import datatype.DtServicioEmergencia;
import entity.Hospital;
import entity.ServicioEmergencia;


@Local
public interface HospitalBusinessLocal {
	public List<DtHospital> listar() throws Exception;
	public DtHospital obtenerPorId(Long id) throws Exception;
	public DtHospital obtenerPorNombre(String nombre) throws Exception;
	public Hospital obtenerPorIdObjeto(Long id) throws Exception;
	public void crear(DtHospital hospital) throws Exception;
	public void eliminar(Long id) throws Exception;
	public void editar(DtHospital hospital) throws Exception; //nombre y tipo
	//public void agregarServicioEmergencia(ServicioEmergencia servicio ) throws Exception;
	public void agregarServicioEmergencia(Long idHospital, Long idServicio) throws Exception;
	public void actualizarServicioEmergencia(Long idServicio, Long idHospNuevo, Long idHospViejo) throws Exception;
	public void actualizarAmbulancia(Long idAmbulancia) throws Exception;
	public void agregarAmbulancia(Long idHospital, Long idAmbulancia) throws Exception;
	public void eliminarServicioEmergencia(DtHospital hospital, DtServicioEmergencia servicio ) throws Exception;
	public void eliminarAmbulancia(DtHospital hospital, DtAmbulancia ambulancia) throws Exception;
	
}
