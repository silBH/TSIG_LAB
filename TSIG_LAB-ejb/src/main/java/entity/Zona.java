package entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.postgis.Polygon;

@Entity
public class Zona implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String nombre;
	
	@Column(columnDefinition = "geometry(Polygon, 3857)")
	private Polygon ubicacion; 	
	
    public Zona() {}

	public Zona(String nombre, Polygon ubicacion) {
		super();		
		this.nombre = nombre;
		this.ubicacion = ubicacion;
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

	public Polygon getUbicacion() {
		return ubicacion;
	}

	public void setUbicacion(Polygon ubicacion) {
		this.ubicacion = ubicacion;
	}

}
