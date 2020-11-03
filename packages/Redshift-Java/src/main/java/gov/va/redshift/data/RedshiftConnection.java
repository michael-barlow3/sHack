package gov.va.redshift.data;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class RedshiftConnection {
	
	private static Connection conn = null;
	
	private static Log log = LogFactory.getLog(RedshiftConnection.class);
	
	/*# Redshift environment variables
		REDSHIFT_USER=awsuser
		REDSHIFT_DB=dev
		REDSHIFT_PASSWORD=VSRRockz1!
		REDSHIFT_PORT=5439
		REDSHIFT_HOST=vas-dev.ctibauijw8aw.us-gov-west-1.redshift.amazonaws.com
	 */

	static String dbURL = "jdbc:redshift://vas-dev.ctibauijw8aw.us-gov-west-1.redshift.amazonaws.com:5439/dev";
	static final String MasterUsername = "awsuser";
	static final String MasterUserPassword = "VSRRockz1!";

	private RedshiftConnection() throws ClassNotFoundException, SQLException {
		// Dynamically load driver at runtime.
		// Redshift JDBC 4.1 driver: com.amazon.redshift.jdbc41.Driver
		// Redshift JDBC 4 driver: com.amazon.redshift.jdbc4.Driver
		Class.forName("com.amazon.redshift.jdbc.Driver");

		// Open a connection and define properties.
		Properties props = new Properties();

		// Uncomment the following line if using a keystore.
		// props.setProperty("ssl", "true");
		
		props.setProperty("user", MasterUsername);
		props.setProperty("password", MasterUserPassword);
		
		if(System.getenv("REDSHIFT_USER") != null) {
			props.setProperty("user", System.getenv("REDSHIFT_USER"));
		}
		if(System.getenv("REDSHIFT_PASSWORD") != null) {
			props.setProperty("password", System.getenv("REDSHIFT_PASSWORD"));
		}
		if(System.getenv("REDSHIFT_PORT") != null 
				&& System.getenv("REDSHIFT_DB") != null
				&& System.getenv("REDSHIFT_HOST") != null) {
			dbURL = "jdbc:redshift://"+System.getenv("REDSHIFT_HOST")+":"+System.getenv("REDSHIFT_PORT")+"/"+System.getenv("REDSHIFT_DB");
		}
		
		log.debug("Connecting to Redshift "+dbURL);
		
		conn = DriverManager.getConnection(dbURL, props);

	}
	
	public static Connection get() throws ClassNotFoundException, SQLException {
		
		if(conn == null) {
			log.debug("Instatiating new Redshift connection");
			new RedshiftConnection();
		}
			
		
		return conn;
	}

}
