package gov.va.redshift.pojo;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import gov.va.redshift.deserialize.LocationDeserializer;

@JsonDeserialize(using=LocationDeserializer.class)
public class Location {
	
	private String site;
	private String stationNumber;
	public Location(String site, String stationNumber) {
		super();
		this.site = site;
		this.stationNumber = stationNumber;
	}
	public String getSite() {
		return site;
	}
	public void setSite(String site) {
		this.site = site;
	}
	public String getStationNumber() {
		return stationNumber;
	}
	public void setStationNumber(String stationNumber) {
		this.stationNumber = stationNumber;
	}
	@Override
	public String toString() {
		return "Location [site=" + site + ", stationNumber=" + stationNumber + "]";
	}
	
	

}
