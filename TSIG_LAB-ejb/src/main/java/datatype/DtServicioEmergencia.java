package datatype;

import org.postgis.Point;

import entity.Hospital;
import entity.ServicioEmergencia;

public class DtServicioEmergencia {

	private Long id;
	private Hospital hospital;	
	private Integer totalCamas;
	private Integer camasDisponibles;
	private Point ubicacion;
	
	public DtServicioEmergencia() {
		super();
	}

	public DtServicioEmergencia(Long id, Hospital hospital, Integer totalCamas, Integer camasDisponibles,
			Point ubicacion) {
		super();
		this.id = id;
		this.hospital = hospital;
		this.totalCamas = totalCamas;
		this.camasDisponibles = camasDisponibles;
		this.ubicacion = ubicacion;
	}

	public DtServicioEmergencia(ServicioEmergencia servicio) {
		super();
		this.id = servicio.getId();
		this.hospital = servicio.getHospital();
		this.totalCamas = servicio.getTotalCamas();
		this.camasDisponibles = servicio.getCamasDisponibles();
		this.ubicacion = servicio.getUbicacion();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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
