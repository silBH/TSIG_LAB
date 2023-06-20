package entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.postgis.LineString;

@Entity
public class Ambulancia implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String nombre;
	
	@ManyToOne
	private Hospital hospital;

	@Column(columnDefinition = "geometry(LineString, 3857)")
	private LineString ubicacion; 	
	
	private Integer distancia;


	public Ambulancia() {
		super();
	}

	public Ambulancia(String nombre, Hospital hospital, LineString ubicacion, Integer distancia) {
		super();
		this.nombre = nombre;
		this.hospital = hospital;
		this.ubicacion = ubicacion;
		this.distancia = distancia;
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

	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}

	public LineString getUbicacion() {
		return ubicacion;
	}

	public void setUbicacion(LineString ubicacion) {
		this.ubicacion = ubicacion;
	}

	public Integer getDistancia() {
		return distancia;
	}

	public void setDistancia(Integer distancia) {
		this.distancia = distancia;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
}
