package gov.va.redshift.data;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import gov.va.redshift.pojo.VASFile;

public class FileDimension extends AbstractDimension{

	private Log log = LogFactory.getLog(FileDimension.class);

	public FileDimension() {
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
	private Integer insertFilePath(String path) {

		Integer fileId = null;

		String sql = "INSERT INTO vasdw.file_dimension (path) VALUES "
				+ " (?)";

		String maxIdSql = "select max(file_id) from vasdw.file_dimension";

		try {
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setString(1, path);
			stmt.executeUpdate();
			
			log.trace(sql +", ("+path+")");

			Statement queryMaxStmt = conn.createStatement();
			ResultSet maxResult = queryMaxStmt.executeQuery(maxIdSql);

			if (maxResult.next()) {
				fileId = maxResult.getInt(1);
				log.debug("File ID: " +fileId);
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return fileId;
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
	private Integer getFileId(String path) {

		Integer fileId = null;
		String selectPatientSQL = "SELECT file_id as id from vasdw.file_dimension WHERE path = ?";

		try {
			PreparedStatement stmt = conn.prepareStatement(selectPatientSQL);
			stmt.setString(1, path);
			ResultSet rs = stmt.executeQuery();
			log.trace(selectPatientSQL +", ("+path+")");
			
			if (rs.next()) {
				fileId = rs.getInt(1);
				log.debug("File ID: " +fileId);
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return fileId;
	}

	public Integer process(VASFile file) {
		Integer fileId = this.getFileId(file.getPath());
		if (fileId == null) {
			// User doesn't exist, we need to add
			fileId = this.insertFilePath(file.getPath());
		}
		return fileId;

	}

}
