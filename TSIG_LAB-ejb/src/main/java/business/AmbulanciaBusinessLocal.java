package business;

import java.util.List;
import javax.ejb.Local;
import datatype.DtAmbulancia;


@Local
public interface AmbulanciaBusinessLocal {
	public List<DtAmbulancia> listar();
	public List<DtAmbulancia> listarPorHospital(String hospital);
	public DtAmbulancia obtenerPorId(Long id);
	public void crear(DtAmbulancia hospital);
	public void editar(DtAmbulancia hospital);
	public void eliminar(DtAmbulancia hospital);
}
