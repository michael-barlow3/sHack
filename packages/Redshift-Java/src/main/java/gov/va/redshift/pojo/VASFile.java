package gov.va.redshift.pojo;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import gov.va.redshift.deserialize.FileDeserializer;

@JsonDeserialize(using=FileDeserializer.class)
public class VASFile {
	
	private String path;

	public VASFile(String path) {
		super();
		this.path = path;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Override
	public String toString() {
		return "VASFile [path=" + path + "]";
	}
	
	
	

}
