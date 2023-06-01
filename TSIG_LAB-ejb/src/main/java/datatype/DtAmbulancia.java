package datatype;

import org.postgis.Polygon;

import entity.Ambulancia;
import entity.Hospital;

public class DtAmbulancia {
	private Long id;
	private Hospital hospital;
	private Integer distancia;
	private Polygon zona;
	
	public DtAmbulancia() {
		super();
	}

	public DtAmbulancia(Long id, Hospital hospital, Integer distancia, Polygon zona) {
		super();
		this.id = id;
		this.hospital = hospital;
		this.distancia = distancia;
		this.zona = zona;
	}
	
	public DtAmbulancia(Ambulancia ambulancia) {
		super();
		this.id = ambulancia.getId();
		this.hospital = ambulancia.getHospital();
		this.distancia = ambulancia.getDistancia();
		this.zona = ambulancia.getZona();
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