package entity;

import java.awt.Point;

//import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

//import org.hibernate.annotations.Type;

@Entity
public class Hospital {
	@Id
	private String nombre;
	private Point ubicacion;
	
	public Hospital() {
		super();
	}

	public Hospital(String nombre, Point objeto) {
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

	public Point getUbicacion() {
		return ubicacion;
	}

	public void setUbicacion(Point ubicacion) {
		this.ubicacion = ubicacion;
	}

}
