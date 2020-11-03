package gov.va.redshift.data;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class TimeDimension extends AbstractDimension{


	private Log log = LogFactory.getLog(TimeDimension.class);
	public TimeDimension() {
		super();
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
	private Integer getTimeId(String timeValue) {

		Integer patientId = null;
		String selectPatientSQL = "SELECT time_id as id from vasdw.time_dimension WHERE time_value=?";

		try {
			PreparedStatement stmt = conn.prepareStatement(selectPatientSQL);
			stmt.setString(1, timeValue);
			ResultSet rs = stmt.executeQuery();

			if (rs.next()) {
				patientId = rs.getInt(1);
				log.debug("Patient ID: "+patientId);
			}

		} catch (SQLException e) {
			log.error(e);
		}

		return patientId;
	}

	public Integer process(Date rawTimeValue) {
		
		Integer timeId = null;
		
		SimpleDateFormat convertToTimeValue = new SimpleDateFormat("hh:mm");
		String timeValue = convertToTimeValue.format(rawTimeValue);
		timeId = this.getTimeId(timeValue);
		
		return timeId;

	}

}
