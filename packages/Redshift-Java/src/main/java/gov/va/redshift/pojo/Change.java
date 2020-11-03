package gov.va.redshift.pojo;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import gov.va.redshift.deserialize.ChangeDeserializer;

@JsonDeserialize(using=ChangeDeserializer.class)
public class Change {
	
	private String requestType;
	private String fieldName;
	private String protocol;
	private String fileNumber;
	private String fileName;
	private String menu;
	
	
	
	
	
	public Change(String requestType, String fieldName, String protocol, String fileNumber, String fileName,
			String menu) {
		super();
		this.requestType = requestType;
		this.fieldName = fieldName;
		this.protocol = protocol;
		this.fileNumber = fileNumber;
		this.fileName = fileName;
		this.menu = menu;
	}
	public String getRequestType() {
		return requestType;
	}
	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}
	public String getFieldName() {
		return fieldName;
	}
	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}
	public String getProtocol() {
		return protocol;
	}
	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}
	public String getFileNumber() {
		return fileNumber;
	}
	public void setFileNumber(String fileNumber) {
		this.fileNumber = fileNumber;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getMenu() {
		return menu;
	}
	public void setMenu(String menu) {
		this.menu = menu;
	}
	@Override
	public String toString() {
		return "Change [requestType=" + requestType + ", fieldName=" + fieldName + ", protocol=" + protocol
				+ ", fileNumber=" + fileNumber + ", fileName=" + fileName + ", menu=" + menu + "]";
	}
	

	

}
