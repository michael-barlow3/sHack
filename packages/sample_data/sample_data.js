const randomWords = require("random-words");
const moment = require("moment");
const { cloneDeep } = require("lodash");

// Names data from: https://www.fakenamegenerator.com/order.php
// Use: http://www.convertcsv.com/csv-to-json.htm to convert to JSON

const patientNames = require("./patient_names.json");
const userNames = require("./user_names.json");
const metadataSchema = require("./metadata_schema.json");
const auditSchema = require("./audit_schema.json");

const FieldNames = [
	"ALIAS",
	"ALIAS SSN",
	"APPOINTMENT REQUEST DATE",
	"APPOINTMENT REQUEST ON 1010EZ",
	"CIRN MASTER OF RECORD",
	"CITY",
	"CLAIM NUMBER",
	"CMOR ACTIVITY SCORE",
	"COUNTRY",
	"COUNTY",
	"COVERED BY HEALTH INSURANCE?",
	"DATE OF BIRTH",
	"DATE OF DEATH",
	"EMPLOYER NAME",
	"EMPLOYMENT STATUS",
	"ETHNICITY",
	"FULL ICN HISTORY,FULL ICN HISTORY",
	"FULL ICN",
	"ICN CHECKSUM",
	"ICN HISTORY,ICN HISTORY",
	"INSURANCE TYPE,GROUP PLAN",
	"INSURANCE TYPE,INSURANCE EXPIRATION DATE",
	"INTEGRATION CONTROL NUMBER",
	"K-NAME OF PRIMARY NOK",
	"K-PHONE NUMBER",
	"LOCALLY ASSIGNED ICN",
	"MARITAL STATUS",
	"MOTHER'S MAIDEN NAME",
	"MULTIPLE BIRTH INDICATOR",
	"NAME",
	"ORIGINAL APPOINTMENT REQUEST",
	"ORIGINAL APPT REQUEST DATE",
	"PERIOD OF SERVICE",
	"PHONE NUMBER [RESIDENCE]",
	"PHONE NUMBER [WORK]",
	"PLACE OF BIRTH [CITY]",
	"PLACE OF BIRTH [STATE]",
	"POSTAL CODE",
	"PREFERRED NAME",
	"PRIMARY ELIGIBILITY CODE",
	"PROVINCE",
	"RACE INFORMATION,RACE INFORMATION",
	"RELIGIOUS PREFERENCE",
	"RESIDENTIAL ADDR CASS IND",
	"RESIDENTIAL ADDR CHANGE SOURCE",
	"RESIDENTIAL ADDRESS [LINE 1]",
	"RESIDENTIAL CITY",
	"RESIDENTIAL COUNTRY",
	"RESIDENTIAL COUNTY",
	"RESIDENTIAL STATE",
	"RESIDENTIAL ZIP+4",
	"SCORE CALCULATION DATE",
	"SELF IDENTIFIED GENDER",
	"SERVICE CONNECTED PERCENTAGE",
	"SERVICE CONNECTED?",
	"SEX",
	"SOCIAL SECURITY NUMBER",
	"STATE",
	"STREET ADDRESS 1 (CIVIL)",
	"STREET ADDRESS [LINE 1]",
	"STREET ADDRESS [LINE 2]",
	"STREET ADDRESS [LINE 3]",
	"TYPE",
	"VETERAN (Y/N)?",
	"ZIP+4"
];

const Protocol = [
	"1345;ORD(101,",
	"DGMT MEANS TEST DEPENDENT EDIT",
	"EAS EZ LINK TO FILE 2",
	"IBCNB PROCESS ACCEPT",
	"IBCNSC INS CO (IN)ACTIVATE COMPANY",
	"IBCNSJ INS CO INACTIVATE PLAN",
	"IBCNSM ADD POLICY",
	"IBCNSM DELETE POLICY",
	"IBCNSP EDIT EFFECTIVE DATES",
	"IBJP AB PRESCRIPTION EDIT",
	"IBTRC APPEAL/DENIALS",
	"IBTRE  MENU",
	"IBTRV CONT STAY",
	"IBTRV DELETE REVIEW",
	"IVMLD UPLOAD FIELDS",
	"OR GXACTV HOB UP",
	"ORC EVENT TRANSFER",
	"PRO EDIT ALLERGY/ADR DATA",
	"PSO PATIENT RECORD UPDATE",
	"RG ADT INPATIENT ENCOUNTER DRIVER",
	"RG ADT OUTPATIENT ENCOUNTER DRIVER",
	"RG EXCPT EDIT PATIENT DATA",
	"SCENI CORRECT ERROR",
	"SDAM APPT MAKE",
	"SDAM PATIENT DEMOGRAPHICS",
	"SDCO PATIENT DEMOGRAPHICS",
	"TIUF OWNER PERSONAL",
	"VAMC 500 ORF-Z11 SERVER",
	"VAMC 500 ORU-Z05 CLIENT",
	"VAMC 500 ORU-Z09 SERVER",
	"VAMC 500 ORU-Z11 CLIENT",
	"VAQ PDX4 (MENU)",
	"XUHUI MFK"
];

const Sites = [
	{ Site: "Burlington", StationNumber: 51510 },
	{ Site: "Jersey City", StationNumber: 257342 },
	{ Site: "Kettering", StationNumber: 55870 },
	{ Site: "Pflugerville", StationNumber: 53752 },
	{ Site: "Noblesville", StationNumber: 56540 },
	{ Site: "Downers Grove", StationNumber: 49670 },
	{ Site: "Cutler Bay", StationNumber: 43328 },
	{ Site: "Pflugerville", StationNumber: 53752 },
	{ Site: "Minnetonka", StationNumber: 51368 },
	{ Site: "Las Vegas", StationNumber: 603488 },
	{ Site: "Santa Rosa", StationNumber: 171990 },
	{ Site: "New Brunswick", StationNumber: 55831 },
	{ Site: "Loveland", StationNumber: 71334 },
	{ Site: "Watsonville", StationNumber: 52477 },
	{ Site: "Flint", StationNumber: 99763 },
	{ Site: "Waukesha", StationNumber: 71016 },
	{ Site: "Fort Collins", StationNumber: 152060 },
	{ Site: "Bakersfield", StationNumber: 363630 },
	{ Site: "Enid", StationNumber: 50725 },
	{ Site: "Dothan", StationNumber: 68001 },
	{ Site: "Mount Vernon", StationNumber: 68224 },
	{ Site: "Hutchinson", StationNumber: 41889 },
	{ Site: "Hillsboro", StationNumber: 97368 },
	{ Site: "Grand Forks", StationNumber: 54932 },
	{ Site: "Miami Beach", StationNumber: 91026 },
	{ Site: "Hawthorne", StationNumber: 86199 },
	{ Site: "Raleigh", StationNumber: 431746 },
	{ Site: "Perris", StationNumber: 72326 },
	{ Site: "Yonkers", StationNumber: 199766 },
	{ Site: "Santee", StationNumber: 56105 },
	{ Site: "Victoria", StationNumber: 65098 },
	{ Site: "Quincy", StationNumber: 93494 },
	{ Site: "San Ramon", StationNumber: 74513 },
	{ Site: "Gastonia", StationNumber: 73209 },
	{ Site: "Grove City", StationNumber: 37490 },
	{ Site: "Homestead", StationNumber: 64079 },
	{ Site: "Logan", StationNumber: 48913 },
	{ Site: "Danville", StationNumber: 42907 },
	{ Site: "Norwich", StationNumber: 40347 },
	{ Site: "Pasadena", StationNumber: 152730 },
	{ Site: "Menifee", StationNumber: 83447 },
	{ Site: "Elk Grove", StationNumber: 161000 },
	{ Site: "North Miami", StationNumber: 61007 },
	{ Site: "Malden", StationNumber: 60509 },
	{ Site: "Downey", StationNumber: 113240 },
	{ Site: "Burlington", StationNumber: 42284 },
	{ Site: "DeSoto", StationNumber: 51483 },
	{ Site: "Lee's Summit", StationNumber: 93184 },
	{ Site: "DeSoto", StationNumber: 51483 },
	{ Site: "Athens-Clarke County", StationNumber: 119980 },
	{ Site: "Broomfield", StationNumber: 59471 },
	{ Site: "Carpentersville", StationNumber: 38241 },
	{ Site: "Merced", StationNumber: 81102 },
	{ Site: "Meridian", StationNumber: 83596 },
	{ Site: "Albany", StationNumber: 98424 },
	{ Site: "East Lansing", StationNumber: 48554 },
	{ Site: "Newport Beach", StationNumber: 87273 },
	{ Site: "Sparks", StationNumber: 93282 },
	{ Site: "Sandy", StationNumber: 90231 },
	{ Site: "Riverside", StationNumber: 316619 },
	{ Site: "Sandy", StationNumber: 90231 },
	{ Site: "Joliet", StationNumber: 147800 },
	{ Site: "Kent", StationNumber: 124430 },
	{ Site: "Woodland", StationNumber: 56590 },
	{ Site: "Hagerstown", StationNumber: 40612 },
	{ Site: "Paramount", StationNumber: 54980 },
	{ Site: "Rockwall", StationNumber: 40922 },
	{ Site: "Rochester", StationNumber: 110740 },
	{ Site: "Oro Valley", StationNumber: 41627 },
	{ Site: "Beaumont", StationNumber: 117790 },
	{ Site: "Medford", StationNumber: 57170 },
	{ Site: "Nashua", StationNumber: 87137 },
	{ Site: "Shawnee", StationNumber: 64323 },
	{ Site: "Lakewood", StationNumber: 147210 },
	{ Site: "Plainfield", StationNumber: 50588 },
	{ Site: "Shawnee", StationNumber: 64323 },
	{ Site: "West Allis", StationNumber: 60697 },
	{ Site: "Brookfield", StationNumber: 37999 },
	{ Site: "Streamwood", StationNumber: 40351 },
	{ Site: "Spanish Fork", StationNumber: 36956 },
	{ Site: "La Quinta", StationNumber: 39331 },
	{ Site: "McAllen", StationNumber: 136630 },
	{ Site: "Lakewood", StationNumber: 81121 },
	{ Site: "Sunnyvale", StationNumber: 147550 },
	{ Site: "St. Clair Shores", StationNumber: 60070 },
	{ Site: "Bowie", StationNumber: 56759 },
	{ Site: "Turlock", StationNumber: 70365 },
	{ Site: "Bremerton", StationNumber: 39056 },
	{ Site: "Lancaster", StationNumber: 159520 },
	{ Site: "San Mateo", StationNumber: 101120 },
	{ Site: "Topeka", StationNumber: 127670 },
	{ Site: "Plymouth", StationNumber: 73987 },
	{ Site: "Doral", StationNumber: 50213 },
	{ Site: "Baton Rouge", StationNumber: 229426 },
	{ Site: "Portland", StationNumber: 66318 },
	{ Site: "Blaine", StationNumber: 60407 },
	{ Site: "Rochester", StationNumber: 110740 },
	{ Site: "Fond du Lac", StationNumber: 42970 },
	{ Site: "Syracuse", StationNumber: 144669 },
	{ Site: "Chesapeake", StationNumber: 230571 },
	{ Site: "Watsonville", StationNumber: 52477 },
	{ Site: "Culver City", StationNumber: 39428 },
	{ Site: "Largo", StationNumber: 78409 },
	{ Site: "Grove City", StationNumber: 37490 },
	{ Site: "Jurupa Valley", StationNumber: 98030 },
	{ Site: "Elizabeth", StationNumber: 127550 },
	{ Site: "Greenwood", StationNumber: 53665 },
	{ Site: "Novato", StationNumber: 54194 },
	{ Site: "Dayton", StationNumber: 143355 },
	{ Site: "San Jacinto", StationNumber: 45851 },
	{ Site: "Danbury", StationNumber: 83684 },
	{ Site: "Daly City", StationNumber: 104730 },
	{ Site: "Victoria", StationNumber: 65098 },
	{ Site: "Meridian", StationNumber: 40921 },
	{ Site: "Tacoma", StationNumber: 203446 },
	{ Site: "Lompoc", StationNumber: 43509 },
	{ Site: "Moore", StationNumber: 58414 },
	{ Site: "Miramar", StationNumber: 130280 },
	{ Site: "Salina", StationNumber: 47846 },
	{ Site: "Reno", StationNumber: 233294 },
	{ Site: "Bakersfield", StationNumber: 363630 },
	{ Site: "Texarkana", StationNumber: 37442 },
	{ Site: "Saginaw", StationNumber: 50303 },
	{ Site: "North Little Rock", StationNumber: 66075 },
	{ Site: "Collierville", StationNumber: 47333 },
	{ Site: "Kingsport", StationNumber: 52962 },
	{ Site: "White Plains", StationNumber: 57866 },
	{ Site: "Greenwood", StationNumber: 53665 },
	{ Site: "Weslaco", StationNumber: 37093 },
	{ Site: "Terre Haute", StationNumber: 61025 },
	{ Site: "Paterson", StationNumber: 145948 },
	{ Site: "Durham", StationNumber: 245475 },
	{ Site: "Clarksville", StationNumber: 142350 },
	{ Site: "Henderson", StationNumber: 270811 },
	{ Site: "Inglewood", StationNumber: 111542 },
	{ Site: "Roanoke", StationNumber: 98465 },
	{ Site: "Chandler", StationNumber: 249146 },
	{ Site: "Clearwater", StationNumber: 109700 },
	{ Site: "Tampa", StationNumber: 352957 },
	{ Site: "Port St. Lucie", StationNumber: 171010 },
	{ Site: "Greensboro", StationNumber: 279639 },
	{ Site: "Bolingbrook", StationNumber: 73936 },
	{ Site: "Little Rock", StationNumber: 197357 },
	{ Site: "Grand Island", StationNumber: 50550 },
	{ Site: "Corona", StationNumber: 159500 },
	{ Site: "Rochester Hills", StationNumber: 72952 },
	{ Site: "Houston", StationNumber: 2195914 },
	{ Site: "Huntsville", StationNumber: 39795 },
	{ Site: "Binghamton", StationNumber: 46444 },
	{ Site: "Ames", StationNumber: 61792 },
	{ Site: "Biloxi", StationNumber: 44820 },
	{ Site: "Ames", StationNumber: 61792 },
	{ Site: "Valdosta", StationNumber: 56481 },
	{ Site: "Florence", StationNumber: 40059 },
	{ Site: "Calumet City", StationNumber: 37240 },
	{ Site: "St. Charles", StationNumber: 67569 },
	{ Site: "Buckeye", StationNumber: 56683 },
	{ Site: "Scottsdale", StationNumber: 226918 },
	{ Site: "Wichita Falls", StationNumber: 104890 },
	{ Site: "Reno", StationNumber: 233294 },
	{ Site: "Brentwood", StationNumber: 55000 },
	{ Site: "Weymouth Town", StationNumber: 55419 },
	{ Site: "Manassas", StationNumber: 41705 },
	{ Site: "Schenectady", StationNumber: 65902 },
	{ Site: "Mission", StationNumber: 81050 },
	{ Site: "Laguna Niguel", StationNumber: 64652 },
	{ Site: "St. Cloud", StationNumber: 40918 },
	{ Site: "Providence", StationNumber: 177990 },
	{ Site: "Bayonne", StationNumber: 65028 },
	{ Site: "Eagan", StationNumber: 65453 },
	{ Site: "Saginaw", StationNumber: 50303 },
	{ Site: "Mission Viejo", StationNumber: 96346 },
	{ Site: "Irvine", StationNumber: 236716 },
	{ Site: "Apple Valley", StationNumber: 70924 },
	{ Site: "Columbia", StationNumber: 133350 },
	{ Site: "Fairfield", StationNumber: 109320 },
	{ Site: "Santa Maria", StationNumber: 102210 },
	{ Site: "Kansas City", StationNumber: 467007 },
	{ Site: "Richmond", StationNumber: 107570 },
	{ Site: "Clovis", StationNumber: 99769 },
	{ Site: "Draper", StationNumber: 45285 },
	{ Site: "Lima", StationNumber: 38355 },
	{ Site: "Aventura", StationNumber: 37199 },
	{ Site: "Newport Beach", StationNumber: 87273 },
	{ Site: "Apple Valley", StationNumber: 70924 },
	{ Site: "Tyler", StationNumber: 100220 },
	{ Site: "Monrovia", StationNumber: 37101 },
	{ Site: "Harrisonburg", StationNumber: 51395 },
	{ Site: "Lake Oswego", StationNumber: 37610 },
	{ Site: "Coachella", StationNumber: 43092 },
	{ Site: "Irvine", StationNumber: 236716 },
	{ Site: "St. Louis Park", StationNumber: 47411 },
	{ Site: "Lauderhill", StationNumber: 69813 },
	{ Site: "Apple Valley", StationNumber: 70924 },
	{ Site: "Sammamish", StationNumber: 50169 },
	{ Site: "El Paso", StationNumber: 674433 },
	{ Site: "Logan", StationNumber: 48913 },
	{ Site: "Delray Beach", StationNumber: 64072 },
	{ Site: "Edina", StationNumber: 49376 },
	{ Site: "West Covina", StationNumber: 107740 }
];

function getText() {
	const count = Math.floor(Math.random() * 7);
	return randomWords({ min: 3, max: count, join: " " });
}

function genPatientObj(idx) {
	const n = patientNames[idx];
	let tmp = n.GUID.split("-");
	const mvi = `${tmp[0]}V${tmp[1]}${tmp[2]}`;

	tmp = n.DOB.split("/");
	const tmp1 = `0${tmp[1]}`;
	const tmp2 = `0${tmp[0]}`;
	const dob = `${tmp[2]}${tmp2.slice(-2)}${tmp1.slice(-2)}`;

	tmp = n.SSN.split("-");
	const ssn = tmp.join("");

	const pObj = {
		DFN: n.WesternUnionMTCN,
		DOB: parseInt(dob, 10),
		INITPLUS4: n.Surname.substring(0, 1) + tmp[2],
		MVI: mvi,
		PatientName: `${n.Surname},${n.GivenName}`.toUpperCase(),
		SSN: ssn
	};
	return pObj;
}

function getRandomPatient() {
	const idx = Math.floor(Math.random() * patientNames.length);
	return genPatientObj(idx);
}

function genUserObj(idx) {
	const n = userNames[idx];
	return {
		DUZ: n.DFN,
		UID: n.UID,
		UserName: `${n.Surname},${n.GivenName}`.toUpperCase(),
		Title: getText()
	};
}

function getRandomUser() {
	const idx = Math.floor(Math.random() * userNames.length);
	return genUserObj(idx);
}

function getFieldName() {
	return FieldNames[Math.floor(Math.random() * FieldNames.length)];
}

function getProtocol() {
	return Protocol[Math.floor(Math.random() * Protocol.length)];
}

function getSite() {
	const n = Sites[Math.floor(Math.random() * Sites.length)];
	return { Site: n.Site.toUpperCase(), StationNumber: 107740 };
}

function getReqType() {
	const rTypes = ["Create", "Read", "Update", "Delete"];
	return rTypes[Math.floor(Math.random() * rTypes.length)];
}

function getFile() {
	const files = [
		"CAPRI TEMPLATES",
		"FEE BASIS PAYMENT",
		"FEE NOTIFICATION/REQUEST",
		"PATIENT ALLERGIES",
		"PATIENT MOVEMENT",
		"PATIENT",
		"RECALL REMINDERS",
		"SD WAIT LIST",
		"SDEC APPT REQUEST",
		"SURGERY",
		"TREATING FACILITY LIST",
		"ZDKA PATIENT"
	];
	const fNums = [120.8, 130, 162, 162.2, 2, 391.91, 396.17, 403.5, 405, 409.3, 409.85, 500123];
	const idx = Math.floor(Math.random() * files.length);
	return { File: files[idx], fNum: fNums[idx] };
}

function getRandomTime() {
	const s = new Date(2011, 0, 1).getTime();
	const e = new Date().getTime();
	const rDate = new Date(s + Math.random() * (e - s));
	const retDate = moment(rDate).format("YYYYMMDDHHmmss-0500");
	const s1 = new Date(2014, 8, 17).getTime();
	const rDate1 = new Date(s1);
	const retDate2 = moment(rDate1).format("YYYYMMDDHHmmss-0500");
	console.log("Date being generated - ", retDate2);
	return retDate2;
}

function genAuditRecords(howmany, idxP, idxU) {
	const aRecord = {
		HEADER: {},
		SCHEMA: {}
	};
	const recs = [];

	for (let i = 0; i < howmany; i += 1) {
		let p = null;
		let u = null;
		if (idxP >= 0) {
			p = genPatientObj(idxP);
		} else {
			p = getRandomPatient();
		}
		if (idxU >= 0) {
			u = genUserObj(idxU);
		} else {
			u = getRandomUser();
		}

		aRecord.HEADER.RequestType = getReqType();
		aRecord.HEADER.User = u;
		aRecord.HEADER.Location = getSite();
		aRecord.HEADER.DateTime = getRandomTime();
		aRecord.HEADER.SchemaType = "FMAUDIT";
		aRecord.HEADER.Patient = p;

		aRecord.SCHEMA["RECORD ADDED"] = "";
		aRecord.SCHEMA.ACCESSED = "";
		aRecord.SCHEMA["NEW VALUE"] = "";
		aRecord.SCHEMA["OLD VALUE"] = "";
		aRecord.SCHEMA["FIELD NAME"] = getFieldName();
		aRecord.SCHEMA["PROTOCOL or OPTION USED"] = getProtocol();
		const f = getFile();
		aRecord.SCHEMA["FILE NUMBER"] = f.fNum;
		aRecord.SCHEMA["FILE NAME"] = f.File;
		aRecord.SCHEMA["MENU OPTION USED"] = "";
		console.log("A Single Record - ", aRecord);
		recs.push(cloneDeep(aRecord));
	}
	return recs;
}

const privateFcns = {
	genPatientObj,
	getRandomPatient,
	genUserObj,
	getRandomUser,
	getSite,
	getFile,
	getRandomTime
};

module.exports = {
	genAuditRecords,
	metadataSchema,
	auditSchema,
	privateFcns
};
