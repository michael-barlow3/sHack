package gov.va.redshift.data;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import gov.va.redshift.pojo.Change;

public class ChangeDimension extends AbstractDimension{

	private Log log = LogFactory.getLog(ChangeDimension.class);

	public ChangeDimension() {
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
	private Integer insertChange(String requestType, String fieldName, String protocol, String fileNumber,
			String fileName, String menu) {

		Integer changeId = null;

		String sql = "INSERT INTO vasdw.change_dimension"
				+ " ( request_type, field_name, protocol, file_number, file_name, menu) "
				+ "VALUES (?,?,?,?,?,?)";

		String maxIdSql = "select max(change_id) from vasdw.change_dimension";

		try {
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setString(1, requestType);
			stmt.setString(2, fieldName);
			stmt.setString(3, protocol);
			stmt.setString(4, fileNumber);
			stmt.setString(5, fileName);
			stmt.setString(6, menu);
			log.trace(sql+", ("+requestType+","+fieldName+","+protocol+","+fileNumber+","+fileName+","+menu+")");
			stmt.executeUpdate();

			Statement queryMaxStmt = conn.createStatement();
			ResultSet maxResult = queryMaxStmt.executeQuery(maxIdSql);

			if (maxResult.next()) {
				changeId = maxResult.getInt(1);
				log.debug("Change ID: "+changeId);
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e);
		}

		return changeId;
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
	private Integer getChangeId(String requestType, String fieldName, String protocol, String fileNumber,
			String fileName, String menu) {

		Integer changeId = null;
		String selectPatientSQL = "SELECT change_id as id from vasdw.change_dimension "
				+ "WHERE request_type=? "
				+ "and field_name=? "
				+ "and  protocol = ? "
				+ "and file_number = ? "
				+ "and file_name = ? "
				+ "and menu = ?";

		try {
			PreparedStatement stmt = conn.prepareStatement(selectPatientSQL);
			stmt.setString(1, requestType);
			stmt.setString(2, fieldName);
			stmt.setString(3, protocol);
			stmt.setString(4, fileNumber);
			stmt.setString(5, fileName);
			stmt.setString(6, menu);
			ResultSet rs = stmt.executeQuery();
			log.trace(selectPatientSQL
					+", ("+requestType+","+fieldName+","+protocol+","+fileNumber+","+fileName+","+menu+")");

			if (rs.next()) {
				changeId = rs.getInt(1);
				log.debug("Change ID: "+changeId);
			}

		} catch (SQLException e) {
			log.error(e);
		}

		return changeId;
	}

	public Integer process(Change change) {
		Integer changeId = this.getChangeId(change.getRequestType(), 
				change.getFieldName(), change.getProtocol(), 
				change.getFileNumber(), change.getFileName(), change.getMenu());
		if (changeId == null) {
			// Change doesn't exist, we need to add
			changeId = this.insertChange(change.getRequestType(), 
				change.getFieldName(), change.getProtocol(), 
				change.getFileNumber(), change.getFileName(), change.getMenu());
		}
		return changeId;

	}

}
