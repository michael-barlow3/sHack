package gov.va.redshift.vas_redshift;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.va.redshift.data.ChangeDimension;
import gov.va.redshift.data.DateDimension;
import gov.va.redshift.data.FileDimension;
import gov.va.redshift.data.LocationDimension;
import gov.va.redshift.data.MessageFact;
import gov.va.redshift.data.PatientDimension;
import gov.va.redshift.data.TimeDimension;
import gov.va.redshift.data.UserDimension;
import gov.va.redshift.pojo.Change;
import gov.va.redshift.pojo.Location;
import gov.va.redshift.pojo.Patient;
import gov.va.redshift.pojo.User;
import gov.va.redshift.pojo.VASDate;
import gov.va.redshift.pojo.VASFile;
import redis.clients.jedis.Jedis;

/**
 * Hello world!
 *
 */
public class App 
{
	
	private static Log log = LogFactory.getLog(App.class);
	
	static String REDIS_HOST = "localhost";
	static int REDIS_PORT = 6379;
	
    public static void main( String[] args )
    {
    	
    	if(System.getenv("REDIS_HOST") != null && System.getenv("REDIS_PORT") != null) {
    		REDIS_HOST = System.getenv("REDIS_HOST");
    		REDIS_PORT = Integer.parseInt( System.getenv("REDIS_PORT"));
    	}
        @SuppressWarnings("resource")
		Jedis jedis = new Jedis(REDIS_HOST,REDIS_PORT);
        log.info("Connected to Redis");
        log.debug("Redis connect info: " +REDIS_HOST + " PORT "+REDIS_PORT);
        // infinite loop to read redis
        while(true) {
        	List<String> message = jedis.blpop(0, "vsr_audit");
        	String payload = message.get(1);
        	ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        	try {
        		log.info("Reading Message From Redis");
        		log.debug(payload);
				Integer patientId = new PatientDimension().process(mapper.readValue(payload,Patient.class));
				Integer userId = new UserDimension().process(mapper.readValue(payload,User.class));
				Integer changeId = new ChangeDimension().process(mapper.readValue(payload,Change.class));
				Integer fileId = new FileDimension().process(mapper.readValue(payload,VASFile.class));
				Integer locationId = new LocationDimension().process(mapper.readValue(payload,Location.class));
				VASDate vasDate = mapper.readValue(payload,VASDate.class);
				Integer timeId = new TimeDimension().process(vasDate.getDateTime());
				Integer dateId = new DateDimension().process(vasDate.getDateTime());
				
				new MessageFact().insertFact(userId, patientId, changeId, locationId, dateId, timeId, fileId);
				log.info("Processed data into message fact");
				
			} catch (JsonMappingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
        
        
    }
}
