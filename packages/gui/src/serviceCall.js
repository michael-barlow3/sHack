const APIBase4P = process.env.VUE_APP_API_BASE;

/**
 *
 *    /howManyRecords - Returns the number of metadata and audit records in the DR
 *    /AuditRecord/{auditId} - Returns a specific Audit Record from the S3 Audit container
 *    /MetaData/{patient} - Returns array of metadata records from Redshift for specified patient
 *        http://localhost:8081/MetaData/LNAME,FNAME MNAME?ssn=434669944
 *        http://localhost:8081/MetaData/LNAME,FNAME MNAME?dob=MMDDYYYY
 *
 *        {"response": {"p":"L_NAME,F_NAME M_NAME","s":"434669944","d":"19370420","u":["57601527"]}}

 *    /MetaData/{patient}/{user} - Returns array of metadata records from Redshift for specified patient/user
 *

 *    [{"_id":"5ee6653139c1063412a9efab",
 *        "p":"VRAG,KELLY-560864778-19532105",
 *        "u":"KAZU,G'KALI-59074875",
 *        "c":"PREFERRED NAME",
 *        "l":"PORTLAND",
 *        "d":"20160904014916-0500"}]


 */

function genQuery(data) {
  console.log("Gen Query - ", data, APIBase4P);
  // console.log("MDB SELECT PATIENT - httpHeaders = ", APIBase4P, httpHeaders)
  switch (data.type) {
    case "patient":
      let url = "";
      if (data.hasOwnProperty("ssn")) {
        url = `${APIBase4P}MetaData/${data.pName}?ssn=${data.ssn}`;
      } else if (data.hasOwnProperty("dob")) {
        const dobA = data.dob.split("/");
        const dob = `${dobA[2]}${dobA[0]}${dobA[1]}`;
        url = `${APIBase4P}MetaData/${data.pName}?dob=${dob}`;
      }
      return url;
    case "puser":
      const r = `${APIBase4P}MetaData/${data.patient}/${data.user}`;
      console.log("Gen Query - ", r);
      return r;
    case "audit":
      return `${APIBase4P}AuditRecord/${data.auditId}`;
  }
}

module.exports = {
  genQuery
};
