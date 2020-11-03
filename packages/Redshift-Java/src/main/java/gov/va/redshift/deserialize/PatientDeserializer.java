package gov.va.redshift.deserialize;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import gov.va.redshift.pojo.Patient;

/**
 * Converts JSON into patient Object
 * @author rahulgokulnath
 *
 */
public class PatientDeserializer extends StdDeserializer<Patient> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public PatientDeserializer() {
		this(null);
	}

	public PatientDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public Patient deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		// deserialize patient info
		JsonNode rootNode = p.getCodec().readTree(p);

		JsonNode node = rootNode.get("HEADER").get("Patient");

		String dfn = node.get("DFN").asText();
		SimpleDateFormat df = new SimpleDateFormat("YYYYMMDD");
		Date dob = null;
		try {
			dob = df.parse(node.get("DOB").asText());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String initPlusFour = node.get("INITPLUS4").asText();
		String mvi = node.get("MVI").asText();
		String patientName = node.get("PatientName").asText();
		String ssn = node.get("SSN").asText();

		Patient patient = new Patient(dfn, dob, initPlusFour, mvi, patientName, ssn);
		return patient;
	}

}
