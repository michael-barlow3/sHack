package gov.va.redshift.deserialize;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import gov.va.redshift.pojo.Change;

/**
 * Converts JSON into patient Object
 * @author rahulgokulnath
 *
 */
public class ChangeDeserializer extends StdDeserializer<Change> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ChangeDeserializer() {
		this(null);
	}

	public ChangeDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public Change deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		// deserialize patient info
		JsonNode rootNode = p.getCodec().readTree(p);

		JsonNode node = rootNode.get("HEADER");
		JsonNode schema = rootNode.get("SCHEMA");

		String requestType = node.get("RequestType").asText();
		String fieldName = schema.get("FIELD NAME").asText();
		String protocol = schema.get("PROTOCOL or OPTION USED").asText();
		String fileNumber = schema.get("FILE NUMBER").asText();
		String fileName = schema.get("FILE NAME").asText();
		String menu = schema.get("MENU OPTION USED").asText();
	
		Change change = new Change( requestType,  
				fieldName,  protocol,  
				fileNumber,  fileName, menu);
		return change;
	}

}
