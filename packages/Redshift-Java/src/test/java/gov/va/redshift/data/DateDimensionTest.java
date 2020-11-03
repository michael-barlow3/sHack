package gov.va.redshift.data;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.va.redshift.pojo.Change;
import gov.va.redshift.pojo.VASDate;

public class DateDimensionTest {


	@Test
	public void testProcess() {
		DateDimension pd = new DateDimension();
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		try {
			VASDate d = mapper.readValue(new URL("file:/Users/rahulgokulnath/work/dbit/example-record.json"),
					VASDate.class);
			System.out.println("DAte test:" + d.getDateTime());
			System.out.println("Date ID: " + pd.process(d.getDateTime()));
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
