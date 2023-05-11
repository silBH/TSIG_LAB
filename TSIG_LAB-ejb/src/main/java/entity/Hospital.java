package entity;

import java.awt.Point;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.postgresql.util.PGobject;

@Entity
public class Hospital {
	@Id
	private String nombre;
	//private org.postgis.Point ubicacion;
	private PGobject ubicacion;
	
	public Hospital() {
		super();
	}

	public Hospital(String nombre, PGobject objeto) {
		super();
		this.nombre = nombre;
		this.ubicacion = objeto;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public PGobject getUbicacion() {
		return ubicacion;
	}

	public void setUbicacion(PGobject ubicacion) {
		this.ubicacion = ubicacion;
	}

}
