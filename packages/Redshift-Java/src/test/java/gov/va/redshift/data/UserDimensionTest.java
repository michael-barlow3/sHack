package gov.va.redshift.data;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.va.redshift.pojo.User;

public class UserDimensionTest {

	public void testLoad() {
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		try {
			User user = mapper.readValue(new URL("file:/Users/rahulgokulnath/work/dbit/example-record.json"),
					User.class);
			System.out.println(user);
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	
	public void testNameSplit() {

		UserDimension pd = new UserDimension();

		String[] listOfNames = { "SANDHEAVER,ORGULAS", "AVERY,DORMAN K", "BARLOW,MIKE S" };

		for (int x = 0; x < listOfNames.length; x++) {
			String[] split = pd.splitName(listOfNames[x]);

			for (int i = 0; i < split.length; i++) {
				String whichName = "Last Name: ";
				if (i == 1) {
					whichName = "First Name: ";
				} else if (i == 2) {
					whichName = "Middle Name: ";
				}
				System.out.println(whichName + split[i]);
			}

		}

	}

	@Test
	public void testProcess() {
		UserDimension pd = new UserDimension();
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		try {
			User user = mapper.readValue(new URL("file:/Users/rahulgokulnath/work/dbit/example-record.json"),
					User.class);
			System.out.println("User ID: " + pd.process(user));
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
