package dao;

import javax.ejb.Remote;

import entity.Hospital;

@Remote
public interface HospitalDAORemote {
    public void guardar(Hospital hospital) ;
    public Hospital obtenerPorId(int id);
    public void actualizar(Hospital hospital);
    public void eliminar(Hospital hospital);
}
