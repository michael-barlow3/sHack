package gov.va.redshift.data;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DateDimension extends AbstractDimension{


	private Log log = LogFactory.getLog(DateDimension.class);
	
	public DateDimension() {
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
	private Integer getDateId(Date dateValue) {

		Integer dateId = null;
		String selectPatientSQL = "SELECT date_id as id from vasdw.date_dimension WHERE full_date=?";

		try {
			PreparedStatement stmt = conn.prepareStatement(selectPatientSQL);
			stmt.setDate(1, new java.sql.Date(dateValue.getTime()));
			log.trace(selectPatientSQL.replace("?", dateValue.toString()));
			ResultSet rs = stmt.executeQuery();

			if (rs.next()) {
				dateId = rs.getInt(1);
				log.debug("Date ID: "+dateId);
			}

		} catch (SQLException e) {
			log.error(e);
		}

		return dateId;
	}

	public Integer process(Date rawDateValue) {
		Integer dateId = null;
		dateId = this.getDateId(rawDateValue);
		return dateId;

	}

}
