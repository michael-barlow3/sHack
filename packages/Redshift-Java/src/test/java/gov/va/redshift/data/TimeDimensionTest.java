package gov.va.redshift.data;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.va.redshift.pojo.Change;
import gov.va.redshift.pojo.VASDate;

public class TimeDimensionTest {

	
	public void testParse() {
		String datevalue = "20140917000000-0500";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmssZ", Locale.getDefault());
		
		Date d;
		try {
			d = sdf.parse(datevalue);
			System.out.println(d);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		
	}
	
	@Test
	public void testProcess() {
		TimeDimension pd = new TimeDimension();
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		try {
			VASDate d = mapper.readValue(new URL("file:/Users/rahulgokulnath/work/dbit/example-record.json"),
					VASDate.class);
			System.out.println("Time ID: " + pd.process(d.getDateTime()));
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
