package gov.va.redshift.data;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.va.redshift.pojo.Change;

public class ChangeDimensionTest {

	
	public void testLoad() {
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		try {
			Change change = mapper.readValue(new URL("file:/Users/rahulgokulnath/work/dbit/example-record.json"),
					Change.class);
			System.out.println(change);
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	@Test
	public void testProcess() {
		ChangeDimension pd = new ChangeDimension();
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		try {
			Change change = mapper.readValue(new URL("file:/Users/rahulgokulnath/work/dbit/example-record.json"),
					Change.class);
			System.out.println("Change ID: " + pd.process(change));
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
