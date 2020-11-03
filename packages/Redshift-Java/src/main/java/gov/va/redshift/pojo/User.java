package gov.va.redshift.pojo;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import gov.va.redshift.deserialize.UserDeserializer;

@JsonDeserialize(using=UserDeserializer.class)
public class User {
	
	private String duz;
	private String uid;
	private String userName;
	private String title;
	
	
	
	
	
	public User(String duz, String uid, String userName, String title) {
		super();
		this.duz = duz;
		this.uid = uid;
		this.userName = userName;
		this.title = title;
	}
	public String getDuz() {
		return duz;
	}
	public void setDuz(String duz) {
		this.duz = duz;
	}
	public String getUid() {
		return uid;
	}
	public void setUid(String uid) {
		this.uid = uid;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	
	
	@Override
	public String toString() {
		return "User [duz=" + duz + ", uid=" + uid + ", userName=" + userName + ", title=" + title + "]";
	}
	
	

}
