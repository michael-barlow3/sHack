package gov.va.redshift.deserialize;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import gov.va.redshift.pojo.VASFile;

/**
 * Converts JSON into patient Object
 * @author rahulgokulnath
 *
 */
public class FileDeserializer extends StdDeserializer<VASFile> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public FileDeserializer() {
		this(null);
	}

	public FileDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public VASFile deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		// deserialize patient info
		JsonNode rootNode = p.getCodec().readTree(p);

		String filePath = rootNode.get("path").asText();

		VASFile f = new VASFile(filePath);
		return f;
	}

}
