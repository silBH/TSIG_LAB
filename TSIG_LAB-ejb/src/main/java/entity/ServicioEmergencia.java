package entity;

import java.io.Serializable;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.Type;
import org.postgis.Point;

@Entity
public class ServicioEmergencia implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	private Hospital hospital;
	
	private Integer totalCamas;
	private Integer camasDisponibles;
	
	//@Type(type = "org.hibernate.spatial.GeometryType")
	private Point ubicacion;

	public ServicioEmergencia() {
		super();
	}

	public ServicioEmergencia(Long id, Hospital hospital, Integer totalCamas, Integer camasDisponibles,
			Point ubicacion) {
		super();
		this.id = id;
		this.hospital = hospital;
		this.totalCamas = totalCamas;
		this.camasDisponibles = camasDisponibles;
		this.ubicacion = ubicacion;
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

	public Integer getTotalCamas() {
		return totalCamas;
	}

	public void setTotalCamas(Integer totalCamas) {
		this.totalCamas = totalCamas;
	}

	public Integer getCamasDisponibles() {
		return camasDisponibles;
	}

	public void setCamasDisponibles(Integer camasDisponibles) {
		this.camasDisponibles = camasDisponibles;
	}

	public Point getUbicacion() {
		return ubicacion;
	}

	public void setUbicacion(Point ubicacion) {
		this.ubicacion = ubicacion;
	}

}
