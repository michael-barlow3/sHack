package gov.va.redshift.data;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * In
 * @author rahulgokulnath
 *
 */
public class MessageFact extends AbstractDimension{


	private Log log = LogFactory.getLog(MessageFact.class);
	
	public MessageFact() {
		super();
		

	}

	/**
	 * Insert a new patient
	 * 
	 * @param mvi
	 * @param firstName
	 * @param lastName
	 * @param middleName
	 * @param ssn
	 * @param dob
	 * @return
	 */
	public void insertFact(Integer userId, 
			Integer patientId, Integer changeId, 
			Integer locationId, Integer dateId, Integer timeId, Integer fileId) {

		String sql =  " INSERT INTO vasdw.message_fact " + 
				"(user_id, patient_id, change_id, location_id, date_id, time_id, file_id) " + 
				"VALUES (?,?,?,?,?,?,?) ";

		try {
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setInt(1, userId);
			stmt.setInt(2, patientId);
			stmt.setInt(3, changeId);
			stmt.setInt(4, locationId);
			stmt.setInt(5, dateId);
			stmt.setInt(6, timeId);
			stmt.setInt(7, fileId);
			
			log.trace(sql + ", ("
					+userId
					+patientId
					+changeId
					+locationId
					+dateId
					+timeId
					+fileId
			+")");
			
			stmt.executeUpdate();

		
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e);
		}

	}


}
