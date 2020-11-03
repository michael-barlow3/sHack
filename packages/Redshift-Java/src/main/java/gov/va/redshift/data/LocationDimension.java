package gov.va.redshift.data;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import gov.va.redshift.pojo.Location;

public class LocationDimension extends AbstractDimension{

	private Log log = LogFactory.getLog(LocationDimension.class);
	
	public LocationDimension() {
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
	private Integer insertLocation(String stationNumber, String name) {

		Integer locationId = null;

		String sql = "INSERT INTO vasdw.locations_dimension"
				+ " ( station_number, name) VALUES (?,?)";

		String maxIdSql = "select max(location_id) from vasdw.locations_dimension";

		try {
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setString(1, stationNumber);
			stmt.setString(2, name);
			log.trace(sql+", ("+stationNumber+","+name+")");
			stmt.executeUpdate();

			Statement queryMaxStmt = conn.createStatement();
			ResultSet maxResult = queryMaxStmt.executeQuery(maxIdSql);

			if (maxResult.next()) {
				locationId = maxResult.getInt(1);
				log.debug("LocationID: "+locationId);
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e);
		}

		return locationId;
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
	private Integer getLocationId(String stationNumber, String name) {

		Integer locationId = null;
		String selectPatientSQL = "SELECT location_id as id from vasdw.locations_dimension WHERE station_number=? and name=?";

		try {
			PreparedStatement stmt = conn.prepareStatement(selectPatientSQL);
			stmt.setString(1, stationNumber);
			stmt.setString(2, name);
			log.trace(selectPatientSQL+", ("+stationNumber+","+name+")");;
			ResultSet rs = stmt.executeQuery();

			if (rs.next()) {
				locationId = rs.getInt(1);
				log.debug("LocationID: "+locationId);
			}

		} catch (SQLException e) {
			log.error(e);
		}

		return locationId;
	}

	public Integer process(Location location) {
		Integer locationId = this.getLocationId(location.getStationNumber(), location.getSite());
		if (locationId == null) {
			// User doesn't exist, we need to add
			locationId = this.insertLocation(location.getStationNumber(), location.getSite());
		}
		return locationId;

	}

}
