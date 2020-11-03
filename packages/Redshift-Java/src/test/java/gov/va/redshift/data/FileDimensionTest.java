package gov.va.redshift.data;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.va.redshift.pojo.Change;
import gov.va.redshift.pojo.VASFile;

public class FileDimensionTest {


	@Test
	public void testProcess() {
		FileDimension pd = new FileDimension();
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		try {
			VASFile file = mapper.readValue(new URL("file:/Users/rahulgokulnath/work/dbit/example-record.json"),
					VASFile.class);
			System.out.println("File ID: " + pd.process(file));
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
