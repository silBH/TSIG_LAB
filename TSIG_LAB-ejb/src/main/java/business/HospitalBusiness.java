package business;

import java.sql.SQLException;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;

import org.postgis.Point;

import dao.HospitalDAO;

/**
 * Session Bean implementation class HospBusiness
 */
@Stateless
@LocalBean
public class HospitalBusiness implements HospitalBusinessRemote, HospitalBusinessLocal {

	@EJB HospitalDAO data;
	
	public HospitalBusiness() {}
}
