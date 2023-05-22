package business;

import java.util.List;
import javax.ejb.Local;
import datatype.DtHospital;


@Local
public interface HospitalBusinessLocal {
	public List<DtHospital> listar();
	public DtHospital obtenerPorId(Long id);
	public DtHospital obtenerPorNombre(String nombre);
	public void crear(DtHospital hospital);
	public void editar(DtHospital hospital);
	public void eliminar(DtHospital hospital);
}
