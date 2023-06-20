package datatype;

import java.util.List;

import entity.Ambulancia;
import entity.Hospital;
import entity.ServicioEmergencia;

public class DtHospital {
	
	private Long id;
	private String nombre;
	private TipoHospital tipo;
	private List<DtServicioEmergencia> servicios;
	private List<DtAmbulancia> ambulancias;
	
	public DtHospital() {
		super();
	}
		
	public DtHospital(Long id, String nombre, TipoHospital tipo, List<DtServicioEmergencia> servicios,
			List<DtAmbulancia> ambulancias) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.tipo = tipo;
		this.servicios = servicios;
		this.ambulancias = ambulancias;
	}

	public DtHospital(Long id, String nombre, TipoHospital tipo) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.tipo = tipo;
	}
	
	public DtHospital(Hospital hospital) {
		super();
		this.id = hospital.getId();
		this.nombre = hospital.getNombre();
		this.tipo = hospital.getTipo();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public TipoHospital getTipo() {
		return tipo;
	}

	public void setTipo(TipoHospital tipo) {
		this.tipo = tipo;
	}


	public List<DtServicioEmergencia> getServicios() {
		return servicios;
	}


	public void setServicios(List<DtServicioEmergencia> servicios) {
		this.servicios = servicios;
	}


	public List<DtAmbulancia> getAmbulancias() {
		return ambulancias;
	}


	public void setAmbulancias(List<DtAmbulancia> ambulancias) {
		this.ambulancias = ambulancias;
	}
		
}
