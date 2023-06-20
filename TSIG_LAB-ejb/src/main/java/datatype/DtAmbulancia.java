package datatype;

import org.postgis.LineString;
import org.postgis.MultiLineString;
import org.postgis.Polygon;

import entity.Ambulancia;
import entity.Hospital;

public class DtAmbulancia {
	private Long id;
	private String nombre;
	private Hospital hospital;
	private LineString ubicacion;
	private Integer distancia;
	
	public DtAmbulancia() {
		super();
	}

	
	public DtAmbulancia(Long id, String nombre, Hospital hospital, LineString ubicacion, Integer distancia) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.hospital = hospital;
		this.ubicacion = ubicacion;
		this.distancia = distancia;
	}

	public DtAmbulancia(Ambulancia ambulancia) {
		super();
		this.id = ambulancia.getId();
		this.nombre = ambulancia.getNombre();
		this.hospital = ambulancia.getHospital();
		this.ubicacion = ambulancia.getUbicacion();
		this.distancia = ambulancia.getDistancia();
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

	public LineString getUbicacion() {
		return ubicacion;
	}

	public void setUbicacion(LineString ubicacion) {
		this.ubicacion = ubicacion;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
}
