package business;

//import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
//import dao.HospitalDAO;


@Stateless
@LocalBean
public class HospitalBusiness implements HospitalBusinessRemote, HospitalBusinessLocal {

	//@EJB HospitalDAO data;
	
	public HospitalBusiness() {}

}
