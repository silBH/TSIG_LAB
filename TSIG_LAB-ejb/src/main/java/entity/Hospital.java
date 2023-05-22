package entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import datatype.TipoHospital;

@Entity
public class Hospital implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String nombre;
	private TipoHospital tipo;
	
	public Hospital() {
		super();
	}

	
	public Hospital(String nombre, TipoHospital tipo) {
		super();
		this.nombre = nombre;
		this.tipo = tipo;
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
	
}
