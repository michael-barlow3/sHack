package gov.va.redshift.deserialize;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import gov.va.redshift.pojo.Location;

/**
 * Converts JSON into patient Object
 * @author rahulgokulnath
 *
 */
public class LocationDeserializer extends StdDeserializer<Location> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public LocationDeserializer() {
		this(null);
	}

	public LocationDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public Location deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		// deserialize patient info
		JsonNode rootNode = p.getCodec().readTree(p);

		JsonNode node = rootNode.get("HEADER").get("Location");

		String site = node.get("Site").asText();
		String stationNumber = node.get("StationNumber").asText();
	
		Location location = new Location(site, stationNumber);
		return location;
	}

}
