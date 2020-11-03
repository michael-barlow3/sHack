package gov.va.redshift.data;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import gov.va.redshift.pojo.Patient;

public class PatientDimension extends AbstractDimension {

	private Log log = LogFactory.getLog(PatientDimension.class);

	public PatientDimension() {
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
	private Integer insertPatient(String mvi, String firstName, String lastName, String middleName, String ssn,
			Date dob) {

		Integer patientId = null;

		String sql = "INSERT INTO vasdw.patients_dimension"
				+ " (mvi, first_name, last_name, middle_name, ssn, dob) VALUES (?,?,?,?,?,?)";

		String maxIdSql = "select max(patient_id) from vasdw.patients_dimension";

		try {
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setString(1, mvi);
			stmt.setString(2, firstName);
			stmt.setString(3, lastName);
			stmt.setString(4, middleName);
			stmt.setString(5, ssn);
			stmt.setDate(6, new java.sql.Date(dob.getTime()));
			stmt.executeUpdate();
			
			log.trace(sql + ", ("
					+ mvi + ", "
					+ firstName+ ", "
					+ lastName+ ", "
					+ middleName+ ", "
					+ ssn
					+")");

			Statement queryMaxStmt = conn.createStatement();
			ResultSet maxResult = queryMaxStmt.executeQuery(maxIdSql);

			if (maxResult.next()) {
				patientId = maxResult.getInt(1);
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e);
		}

		return patientId;
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
	private Integer getPatientId(String mvi, String firstName, String lastName, String ssn) {

		Integer patientId = null;
		String selectPatientSQL = "SELECT patient_id as id from vasdw.patients_dimension "
				+ "WHERE mvi=? AND first_name=? AND last_name=? AND ssn=?";

		try {
			PreparedStatement stmt = conn.prepareStatement(selectPatientSQL);
			stmt.setString(1, mvi);
			stmt.setString(2, firstName);
			stmt.setString(3, lastName);
			stmt.setString(4, ssn);
			ResultSet rs = stmt.executeQuery();
			
			log.trace(selectPatientSQL + ", ("
					+ mvi + ", "
					+ firstName+ ", "
					+ lastName+ ", "
					+ ssn
					+")");

			if (rs.next()) {
				patientId = rs.getInt(1);
			}

		} catch (SQLException e) {
			log.error(e);
		}

		return patientId;
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

	public Integer process(Patient patient) {
		String[] names = this.splitName(patient.getPatientName());
		Integer patientId = this.getPatientId(patient.getMvi(), names[1], names[0], patient.getSsn());

		if (patientId == null) {
			// Patient doesn't exist, we need to add
			patientId = this.insertPatient(patient.getMvi(), names[1], names[0], names[2], patient.getSsn(),
					patient.getDob());
		}

		return patientId;

	}

}
