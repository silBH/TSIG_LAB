package business;

import java.util.List;
import javax.ejb.Local;
import datatype.DtAdministrador;

@Local
public interface AdministradorBusinessLocal {
	public List<DtAdministrador> listar() throws Exception;
	public DtAdministrador obtenerPorId(Long id) throws Exception;
	public DtAdministrador obtenerPorUsername(String username) throws Exception;
	public void crear(DtAdministrador administrador) throws Exception;
	public void editar(DtAdministrador administrador) throws Exception;
	public void eliminar(Long id) throws Exception;
	//public DtAdministrador login(DtAdministrador administrador) throws Exception;
}
