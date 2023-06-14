package entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.Type;
import org.postgis.MultiLineString;
import org.postgis.Polygon;

@Entity
public class Ambulancia implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	private Hospital hospital;
	
	@Type(type = "org.hibernate.spatial.GeometryType")
	private MultiLineString recorrido; //ver si está bien el tipo de dato
	
	private Integer distancia;
	
	@Type(type = "org.hibernate.spatial.GeometryType")
	private Polygon zona; //---------- ver si este es un atributo calculado con distancia??

	public Ambulancia() {
		super();
	}

	public Ambulancia(Hospital hospital, MultiLineString recorrido, Integer distancia, Polygon zona) {
		super();
		this.hospital = hospital;
		this.recorrido = recorrido;
		this.distancia = distancia;
		this.zona = zona;
	}

	public Long getId() {
		return id;
	}

	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}

	public MultiLineString getRecorrido() {
		return recorrido;
	}

	public void setRecorrido(MultiLineString recorrido) {
		this.recorrido = recorrido;
	}

	public Integer getDistancia() {
		return distancia;
	}

	public void setDistancia(Integer distancia) {
		this.distancia = distancia;
	}

	public Polygon getZona() {
		return zona;
	}

	public void setZona(Polygon zona) {
		this.zona = zona;
	}

}
