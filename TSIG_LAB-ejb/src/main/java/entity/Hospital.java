package entity;

import java.awt.Point;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Hospital {
	@Id
	private String nombre;
	private Point ubicacion;

	public Hospital(String nombre, Point ubicacion) {
		super();
		this.nombre = nombre;
		this.ubicacion = ubicacion;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Point getUbicacion() {
		return ubicacion;
	}

	public void setUbicacion(Point ubicacion) {
		this.ubicacion = ubicacion;
	}

}
