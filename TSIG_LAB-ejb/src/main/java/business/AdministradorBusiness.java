package business;

import java.util.List;
import java.util.ArrayList;
import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;

import dao.AdministradorDAOLocal;
import datatype.DtAdministrador;
import entity.Administrador;

@Stateless
@LocalBean
public class AdministradorBusiness implements AdministradorBusinessLocal {

	@EJB
	AdministradorDAOLocal administradorData;

	public AdministradorBusiness() {}

	@Override
	public List<DtAdministrador> listar() throws Exception {
		List<Administrador> administradores = administradorData.listar();
		List<DtAdministrador> dtAdministradores = convertirAListaDTO(administradores);
		return dtAdministradores;
	}

	@Override
	public DtAdministrador obtenerPorId(Long id) throws Exception {
		Administrador administrador = administradorData.obtenerPorId(id);
		if (administrador != null) {
			return new DtAdministrador(administrador);
		}
		return null;
	}

	@Override
	public DtAdministrador obtenerPorUsername(String username) throws Exception {
		Administrador administrador = administradorData.obtenerPorUsername(username);
		if (administrador != null) {
			return new DtAdministrador(administrador);
		}
		return null;
	}

	@Override
	public void crear(DtAdministrador administrador) throws Exception {
		Administrador nuevoAdministrador = new Administrador(administrador.getNombre(),
				administrador.getApellido(), administrador.getUsername(), administrador.getPassword());
		administradorData.crear(nuevoAdministrador);
	}

	@Override
	public void editar(DtAdministrador administrador) throws Exception {
		Administrador adminExistente = administradorData.obtenerPorId(administrador.getId());
		if (adminExistente != null) {
			adminExistente.setNombre(administrador.getNombre());
			adminExistente.setApellido(administrador.getApellido());
			adminExistente.setUsername(administrador.getUsername());
			adminExistente.setPassword(administrador.getPassword());
			administradorData.editar(adminExistente);
		}
	}

	@Override
	public void eliminar(Long id) throws Exception {
		Administrador adminExistente = administradorData.obtenerPorId(id);
		if (adminExistente != null) {
			administradorData.eliminar(adminExistente);
		}
	}

	@Override
	public DtAdministrador login(DtAdministrador administrador) throws Exception {
		Administrador admin = administradorData.obtenerPorUsername(administrador.getUsername());
		if (admin != null && admin.getPassword().equals(administrador.getPassword())) {
			return new DtAdministrador(admin);
		}
		return null;
	}

	// Método auxiliar para convertir una lista de entidades Administrador a una lista de objetos DTO DtAdministrador
	private List<DtAdministrador> convertirAListaDTO(List<Administrador> administradores) {
		List<DtAdministrador> dtAdministradores = new ArrayList<>();
		for (Administrador admin : administradores) {
			dtAdministradores.add(new DtAdministrador(admin));
		}
		return dtAdministradores;
	}
}
