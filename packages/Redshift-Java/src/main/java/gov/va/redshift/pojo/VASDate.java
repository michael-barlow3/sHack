package gov.va.redshift.pojo;

import java.util.Date;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import gov.va.redshift.deserialize.DateDeserializer;

@JsonDeserialize(using=DateDeserializer.class)
public class VASDate {

	public Date dateTime;

	public VASDate(Date dateTime) {
		super();
		this.dateTime = dateTime;
	}

	public Date getDateTime() {
		return dateTime;
	}

	public void setDateTime(Date dateTime) {
		this.dateTime = dateTime;
	}

	@Override
	public String toString() {
		return "VASDate [dateTime=" + dateTime + "]";
	}
	
	
	
}
