package entity;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import datatype.TipoHospital;

@Entity
public class Hospital implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String nombre;
	private TipoHospital tipo;
	
	@OneToMany
	private List<ServicioEmergencia> servicios;
	
	@OneToMany
	private List<Ambulancia> ambulancias;
	
	public Hospital() {
		super();
	}

	public Hospital(String nombre, TipoHospital tipo, List<ServicioEmergencia> servicios, List<Ambulancia> ambulancias) {
		super();
		this.nombre = nombre;
		this.tipo = tipo;
		this.servicios = servicios;
		this.ambulancias = ambulancias;
	}

	public Long getId() {
		return id;
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

	public List<ServicioEmergencia> getServicios() {
		return servicios;
	}

	public void setServicios(List<ServicioEmergencia> servicios) {
		this.servicios = servicios;
	}

	public List<Ambulancia> getAmbulancias() {
		return ambulancias;
	}

	public void setAmbulancias(List<Ambulancia> ambulancias) {
		this.ambulancias = ambulancias;
	}
		
}
