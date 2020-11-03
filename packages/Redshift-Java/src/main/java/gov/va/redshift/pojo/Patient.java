package gov.va.redshift.pojo;

import java.util.Date;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import gov.va.redshift.deserialize.PatientDeserializer;

/**
 * Represents a patient object in JSON
 * @author rahulgokulnath
 *
 */
@JsonDeserialize(using=PatientDeserializer.class)
public class Patient {
	
	private String dfn;
	private Date dob;
	private String initPlusFour;
	private String mvi;
	private String patientName;
	private String ssn;
	
	public Patient(String dfn, Date dob,
			String initPlusFour, String mvi, String patientName, String ssn) {
		this.dfn = dfn;
		this.dob = dob;
		this.initPlusFour = initPlusFour;
		this.mvi = mvi;
		this.patientName = patientName;
		this.ssn = ssn;
	}
	
	
	public String getDfn() {
		return dfn;
	}
	public void setDfn(String dfn) {
		this.dfn = dfn;
	}
	public Date getDob() {
		return dob;
	}
	public void setDob(Date dob) {
		this.dob = dob;
	}
	public String getInitPlusFour() {
		return initPlusFour;
	}
	public void setInitPlusFour(String initPlusFour) {
		this.initPlusFour = initPlusFour;
	}
	public String getMvi() {
		return mvi;
	}
	public void setMvi(String mvi) {
		this.mvi = mvi;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getSsn() {
		return ssn;
	}
	public void setSsn(String ssn) {
		this.ssn = ssn;
	}


	@Override
	public String toString() {
		return "Patient [dfn=" + dfn + ", dob=" + dob + ", initPlusFour=" + initPlusFour + ", mvi=" + mvi
				+ ", patientName=" + patientName + ", ssn=" + ssn + "]";
	}
	
	

}
