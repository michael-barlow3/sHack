package gov.va.redshift.data;

import java.sql.Connection;
import java.sql.SQLException;

public abstract class AbstractDimension {
	
	protected Connection conn = null;
	
	public AbstractDimension() {
		try {
			conn = RedshiftConnection.get();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
