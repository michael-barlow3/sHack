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

import gov.va.redshift.pojo.VASDate;

/**
 * Converts JSON into patient Object
 * @author rahulgokulnath
 *
 */
public class DateDeserializer extends StdDeserializer<VASDate> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public DateDeserializer() {
		this(null);
	}

	public DateDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public VASDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		// deserialize patient info
		JsonNode rootNode = p.getCodec().readTree(p);

		JsonNode node = rootNode.get("HEADER");

		String rawDateValue = node.get("DateTime").asText();
		
		SimpleDateFormat convertFromRawValue = new SimpleDateFormat("yyyyMMddhhmmssZ");
		
		VASDate vasDate = null;
		try {
			Date date = convertFromRawValue.parse(rawDateValue);
			vasDate = new VASDate(date);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
		
		return vasDate;
	}

}
