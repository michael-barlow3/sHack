package gov.va.redshift.data;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import gov.va.redshift.pojo.User;

public class UserDimension  extends AbstractDimension {

	private Log log = LogFactory.getLog(UserDimension.class);

	public UserDimension() {
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
	private Integer insertPatient(String uid, String firstName, String lastName, String middleName) {

		Integer userId = null;

		String sql = "INSERT INTO vasdw.users_dimension"
				+ " (uid, first_name, last_name, middle_name) VALUES (?,?,?,?)";

		String maxIdSql = "select max(user_id) from vasdw.users_dimension";

		try {
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setString(1, uid);
			stmt.setString(2, firstName);
			stmt.setString(3, lastName);
			stmt.setString(4, middleName);
			stmt.executeUpdate();
			
			log.trace(sql + ", ("
					+uid+", "
					+firstName+", "
					+lastName+", "
					+middleName
					+")");


			Statement queryMaxStmt = conn.createStatement();
			ResultSet maxResult = queryMaxStmt.executeQuery(maxIdSql);

			if (maxResult.next()) {
				userId = maxResult.getInt(1);
				log.debug("User ID: "+userId);
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e);
		}

		return userId;
	}

	/**
	 * Get a patient id based on the values
	 * 
	 * @param mvi
	 * @param firstName
	 * @param lastName
	 * @param ssn
	 * @return
	 */
	private Integer getUserId(String userName) {

		Integer userId = null;
		String selectPatientSQL = "SELECT user_id as id from vasdw.users_dimension WHERE uid=?";

		try {
			PreparedStatement stmt = conn.prepareStatement(selectPatientSQL);
			stmt.setString(1, userName);
			ResultSet rs = stmt.executeQuery();
			
			log.trace(selectPatientSQL + ", ("
					+userName+")");

			if (rs.next()) {
				userId = rs.getInt(1);
				log.debug("User ID: "+userId);
			}

		} catch (SQLException e) {
			log.error(e);
		}

		return userId;
	}

	public String[] splitName(String patientName) {
		String[] name = patientName.split(",");
		String lastName = name[0];
		String firstName = name[1];
		String middleName = null;

		String[] middleNameArray = firstName.split(" ");

		if (middleNameArray.length > 1) {
			firstName = middleNameArray[0];
			middleName = middleNameArray[1];
		}

		String[] results = { lastName, firstName, middleName };

		return results;
	}

	public Integer process(User user) {
		
		Integer userId = this.getUserId(user.getUid());

		if (userId == null) {
			// User doesn't exist, we need to add
			String[] names = this.splitName(user.getUserName());
			userId = this.insertPatient(user.getUid(), names[1], names[0], names[2]);
		}

		return userId;

	}

}
