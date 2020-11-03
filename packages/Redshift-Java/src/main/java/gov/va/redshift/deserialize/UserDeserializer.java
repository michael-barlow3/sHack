package gov.va.redshift.deserialize;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import gov.va.redshift.pojo.User;

/**
 * Converts JSON into patient Object
 * @author rahulgokulnath
 *
 */
public class UserDeserializer extends StdDeserializer<User> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public UserDeserializer() {
		this(null);
	}

	public UserDeserializer(Class<?> vc) {
		super(vc);
	}

	@Override
	public User deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
		// deserialize patient info
		JsonNode rootNode = p.getCodec().readTree(p);

		JsonNode node = rootNode.get("HEADER").get("User");

		String duz = node.get("DUZ").asText();
		String uid = node.get("UID").asText();
		String userName = node.get("UserName").asText();
		String title = node.get("Title").asText();

		User user = new User(duz, uid, userName, title);
		return user;
	}

}
