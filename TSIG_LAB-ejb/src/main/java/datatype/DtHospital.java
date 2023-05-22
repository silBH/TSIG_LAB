package datatype;

import entity.Hospital;

public class DtHospital {
	
	private Long id;
	private String nombre;
	private TipoHospital tipo;
	
	public DtHospital() {
		super();
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
	
	
	
	
}
