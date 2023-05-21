package dao;

import javax.ejb.Local;

import entity.Hospital;

@Local
public interface HospitalDAOLocal {
    public void guardar(Hospital hospital) ;
    public Hospital obtenerPorId(int id);
    public void actualizar(Hospital hospital);
    public void eliminar(Hospital hospital);
}
