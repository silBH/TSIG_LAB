package business;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;

import dao.AdministradorDAOLocal;
import datatype.DtAdministrador;

//estas funciones son usadas desde la interfaz AdministradorBusinessLocal

@Stateless
@LocalBean
public class AdministradorBusiness implements AdministradorBusinessLocal {

	@EJB AdministradorDAOLocal administradorData;
	
    public AdministradorBusiness() {}
    
    @Override
    public List<DtAdministrador> listar() throws Exception{
    	return null;
    }
    
    @Override
	public DtAdministrador obtenerPorId(Long id) throws Exception{
		return null;
	}
    
    @Override
	public DtAdministrador obtenerPorUsername(String username) throws Exception{
		return null;
	}
    
    @Override
	public void crear(DtAdministrador administrador) throws Exception{
		
	}
    
    @Override
	public void editar(DtAdministrador administrador) throws Exception{
		
	}
    
    @Override
	public void eliminar(Long id) throws Exception{
		
	}

	//public DtAdministrador login(DtAdministrador administrador) throws Exception;
	
}
