package datatype;

import entity.Administrador;

public class DtAdministrador {
	private Long id;
	private String nombre;	
	private String apellido;	
	private String username;	
	private String password;
	
	public DtAdministrador() {
		super();
	}

	public DtAdministrador(String nombre, String apellido, String username, String password) {
		super();
		this.nombre = nombre;
		this.apellido = apellido;
		this.username = username;
		this.password = password;
	}
	
	public DtAdministrador(Administrador administrador) {
		super();
		this.nombre = administrador.getNombre();
		this.apellido = administrador.getApellido();
		this.username = administrador.getUsername();
		this.password = administrador.getPassword();
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

	public String getApellido() {
		return apellido;
	}

	public void setApellido(String apellido) {
		this.apellido = apellido;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
