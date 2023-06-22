package business;

import java.util.ArrayList;
import java.util.List;
import java.math.BigInteger;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.Query;

import dao.AmbulanciaDAOLocal;
import dao.HospitalDAOLocal;
import dao.ServicioEmergenciaDAOLocal;
import datatype.DtAmbulancia;
import datatype.DtHospital;
import datatype.DtServicioEmergencia;
import entity.Ambulancia;
import entity.Hospital;
import entity.ServicioEmergencia;

//estas funciones son usadas desde la interfaz HospitalBusinessLocal

@Stateless
@LocalBean
public class HospitalBusiness implements HospitalBusinessLocal {

	@EJB HospitalDAOLocal hospitalData;
	@EJB ServicioEmergenciaDAOLocal servicioData;
	@EJB AmbulanciaDAOLocal ambulanciaData;

	public HospitalBusiness() {}

	@Override
	public List<DtHospital> listar() throws Exception {
		List<Hospital> hospitales = hospitalData.listar();
		List<DtHospital> dtHospitales = new ArrayList<>();
		for (Hospital hosp : hospitales) {
			dtHospitales.add(new DtHospital(hosp));			
		}
		return dtHospitales;
	}

	@Override
	public DtHospital obtenerPorId(Long id) throws Exception {
		Hospital hospital = hospitalData.obtenerPorId(id);
		if (hospital != null) {
			System.out.println("----obtener por id---- hospital" + hospital.getNombre());
			return new DtHospital(hospital);
		}
		return null;
	}

	@Override
	public DtHospital obtenerPorNombre(String nombre) throws Exception {
		Hospital hospital = hospitalData.obtenerPorNombre(nombre);
		if (hospital != null) {
			System.out.println("----obtener por nombre---- hospital" + hospital.getNombre());
			return new DtHospital(hospital);
		}
		return null;
	}
	
	@Override
	public Hospital obtenerPorIdObjeto(Long id) throws Exception{
		Hospital hospital = hospitalData.obtenerPorId(id);
		if (hospital != null) {
			return hospital;
		}
		return null;
	}
	
	@Override
	public void crear(DtHospital hospital) throws Exception {
		Hospital nuevo = new Hospital(hospital.getNombre(), hospital.getTipo(), null, null);
		hospitalData.crear(nuevo);
		System.out.println("---- crear ---- hospital" + nuevo.getNombre());
	}
	
	@Override
	public void eliminar(Long id) throws Exception {
		System.out.println("----------------- eliminar hosp list : 1 ");		
		hospitalData.eliminar(id);		
		System.out.println("----------------- eliminar hosp list : FIN ");
	}

	@Override
	public void editar(DtHospital hospital) throws Exception{
		Hospital existeHosp = hospitalData.obtenerPorId(hospital.getId());
		if (existeHosp != null) {
			existeHosp.setNombre(hospital.getNombre());
			existeHosp.setTipo(hospital.getTipo());
			System.out.println("----editar---- hospital" + existeHosp.getNombre());
		}
	}
	
	@Override
	public void agregarServicioEmergencia(Long idHospital, Long idServicio) throws Exception{//ServicioEmergencia servicio		
		//problema de deserealizacion... se manipula directamente la base en DAO
		servicioData.agregarServicioEmergencia(idHospital, idServicio); //----------------------- VER SI SE CAMBIA		
	}
	
	@Override
	public void actualizarServicioEmergencia(Long idServicio, Long idHospNuevo, Long idHospViejo) throws Exception {
		//problema de deserealizacion... se manipula directamente la base en DAO
		servicioData.actualizarServicio(idServicio, idHospNuevo, idHospViejo);
	}
	
	
	@Override
	public void agregarAmbulancia(DtHospital hospital, DtAmbulancia ambulancia) throws Exception{
		Hospital hosp = hospitalData.obtenerPorId(hospital.getId());
		List<Ambulancia> ambulancias = hosp.getAmbulancias();
		//ambulancias.add(new Ambulancia(hosp, ambulancia.getRecorrido(),
			//	ambulancia.getDistancia(), ambulancia.getZona()));
	}
	
	@Override
	public void eliminarServicioEmergencia(DtHospital hospital, DtServicioEmergencia servicio ) throws Exception{
		//elimina el servicio de la lista y de la base de datos
		Hospital hosp = hospitalData.obtenerPorId(hospital.getId());
		List<ServicioEmergencia> servicios = hosp.getServicios();
		ServicioEmergencia serv = servicioData.obtenerPorId(servicio.getId());
		servicios.remove(serv);
		servicioData.eliminar(serv);
	}
	
	@Override
	public void eliminarAmbulancia(DtHospital hospital, DtAmbulancia ambulancia) throws Exception{
		//elimina la ambulancia de la lista y de la base de datos
		Hospital hosp = hospitalData.obtenerPorId(hospital.getId());
		List<Ambulancia> ambulancias = hosp.getAmbulancias();
		Ambulancia amb = ambulanciaData.obtenerPorId(ambulancia.getId());
		ambulancias.remove(amb);
		ambulanciaData.eliminar(amb);
	}
	
}
