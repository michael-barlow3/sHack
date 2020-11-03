/**
 *
 *	Issues:
 *		Some individuals have hyphenated names. This causes a problem when we use hyphens to separate name, ssn, and dob
 *		Some individuals have apostrophe in their names. This causes a problem when adding to query. Need to escape the name elements
 *
 */

require("dotenv").config();

const port = process.env.metadataPort;
// const drConnectionString = process.env.drUrl;

// const metadata = require("./metadata.js");

// (async function () {
// 	await metadata.init(port, drConnectionString);
// })();


/**
 *
 *	/howManyRecords - Returns the number of metadata and audit records in the DR
 *	/AuditRecord/{auditId} - Returns a specific Audit Record from the S3 Audit container
 *	/MetaData/{patient} - Returns array of metadata records from Redshift for specified patient
 *	/MetaData/{patient}/{user} - Returns array of metadata records from Redshift for specified patient/user
 *
 */
// const os = require('os');
// console.log(os.networkInterfaces())
const SQL = require("sql-template-strings");
const queryParser = require("connect-query");
const service = require("restana")();
const { StringDecoder } = require("string_decoder");
const moment = require("moment");
const _ = require("lodash");

const redShift = require("../AWS/redshift.js");
const drFuncs = require("../AWS/s3.js");
service.use(queryParser());
service.use((req, res, next) => {
	res.setHeader("Access-Control-Request-Headers", "content-type");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Allow", "OPTIONS, GET, HEAD");
	return next()
});

/* ----------------------- Data Extraction from Params ---------------------------------------------- */

/* Extract portions of patient name and DOB/SSN from the query information passed */
function extractPatient(req) {
	if (!req.params.hasOwnProperty("patient")) {
		return null;
	}
	const patientName = decodeURI(req.params.patient);
	const params = req.query;
	let patient, ln = "", fn_1 = "", fn = "", mn = "", sn = "", dob = "";

	const hasHyphen = patientName.indexOf("-");
	if (hasHyphen) {
		const data = patientName.split("-");
		patient = data[0].split(",");
		ln = patient[0];
		fn_1 = patient[1].split(" ");
		fn = fn_1[0];
		mn = fn_1[1];
		ssn = data[1] ? data[1] : "";
		dob = data[2] ? data[2] : "";
	} else {
		patient = patientName.split(",");
		ln = patient[0];
		fn_1 = patient[1].split(" ");
		fn = fn_1[0];
		mn = fn_1[1];
	}

	const patientInfo = {
		firstName: fn.toUpperCase(),
		lastName: ln.toUpperCase(),
		middleName: mn ? mn.toUpperCase() : "",
		ssn: params.ssn ? params.ssn : ssn,
		dob: params.dob ? params.dob : dob
	}

	if (patientInfo.dob) {
		const dob = patientInfo.dob;
		patientInfo.dob = `${dob.substring(0, 4)}-${dob.substring(4, 6)}-${dob.substring(6, 8)}`;
	}

	return patientInfo;
}

function extractUser(req) {
	if (!req.params.hasOwnProperty("user")) {
		return null;
	}
	const userName = decodeURI(req.params.user);
	const params = req.query;
	let user, ln, fn_1, fn, mn, uid;

	if (userName) {
		const hasHyphen = userName.indexOf("-");
		if (hasHyphen) {
			const data = userName.split("-");
			user = data[0].split(",");
			ln = user[0];
			fn_1 = user[1].split(" ");
			fn = fn_1[0];
			mn = fn_1[1];
			uid = data[1] ? data[1] : "";
		} else {
			user = userName.split(",");
			ln = user[0];
			fn_1 = user[1].split(" ");
			fn = fn_1[0];
			mn = fn_1[1];
			uid = params.uid ? params.uid : "";
		}

		const userInfo = {
			firstName: fn.toUpperCase(),
			lastName: ln.toUpperCase(),
			middleName: mn ? mn.toUpperCase() : "",
			uid: uid
		}
		return userInfo;
	}
	return null;
}



/* --------------------- Queries ------------------------------------------------ */
async function rsGetPatientUserList(req) {
	const patientInfo = extractPatient(req);
	const userInfo = extractUser(req);
	let stmt = `select distinct`;
	const re = /'/g;
	const newPfirst = patientInfo.firstName.replace(re, "\\'");
	const newPlast = patientInfo.lastName.replace(re, "\\'");

	if (userInfo) {
		const newUfirst = userInfo.firstName.replace(re, "\\'");
		const newUlast = userInfo.lastName.replace(re, "\\'");

		// stmt = `${stmt} cd.name as Change, ld.name as Location, dd.us_format_date as usDate, td.time_value as Time,`;
		stmt = `${stmt} ld.name as location, dd.us_format_date as usdate, td.time_value as time,`;
		stmt = `${stmt} mf.field_name as mfchange, mf.request_type as mfrtype, mf.location_id as mflocation, mf.file_path as mffile, mf.date_id as mfdate, mf.time_id as mftime`;
		stmt = `${stmt} from vasdw.message_fact mf`;

		// stmt = `${stmt} LEFT OUTER JOIN vasdw.change_dimension cd on cd.change_id = mf.change_id`;
		stmt = `${stmt} JOIN vasdw.locations_dimension ld on ld.location_id = mf.location_id`;
		stmt = `${stmt} JOIN vasdw.date_dimension dd on dd.date_id = mf.date_id`;
		stmt = `${stmt} JOIN vasdw.time_dimension td on td.time_id = mf.time_id`;

		stmt = `${stmt} JOIN vasdw.patients_dimension pd on pd.patient_id = mf.patient_id`;
		stmt = `${stmt} JOIN vasdw.users_dimension ud on ud.user_id = mf.user_id`;
		stmt = `${stmt} where pd.first_name = '${newPfirst}' AND pd.last_name = '${newPlast}'`;
		stmt = `${stmt} AND ud.first_name='${newUfirst}' AND ud.last_name = '${newUlast}' AND ud.uid = '${userInfo.uid}'`;
	} else {
		stmt = `${stmt} ud.uid, ud.first_name as ufirst_name, ud.last_name as ulast_name, ud.middle_name as umiddle_name,`;
		stmt = `${stmt} pd.first_name, pd.last_name, pd.middle_name, pd.ssn, pd.dob`;
		stmt = `${stmt} from vasdw.message_fact mf`;
		stmt = `${stmt} JOIN vasdw.patients_dimension pd on pd.patient_id = mf.patient_id`;
		stmt = `${stmt} JOIN vasdw.users_dimension ud on ud.user_id = mf.user_id`;
		stmt = `${stmt} where pd.first_name = '${newPfirst}' AND pd.last_name = '${newPlast}'`;
	}
	if (patientInfo.middleName) {
		const newPmiddle = patientInfo.middleName.replace(re, "\\'");
		stmt = `${stmt} AND pd.middle_name='${newPmiddle}'`;
	}
	if (patientInfo.ssn) {
		stmt = `${stmt} AND pd.ssn='${patientInfo.ssn}'`;
	}
	if (patientInfo.dob) {
		stmt = `${stmt} AND pd.dob='${patientInfo.dob}'`;
	}
	console.log("------------------------ - rsGetPatientUserList - SQL Statement - ---------------------------------------\n", stmt, "\n---------------------------------------");

	const qsRslt = await redShift.query(stmt).catch(function (err) {
		throw new Error(`rsGetPatientId - redShift.query - ${JSON.stringify(stmt)} FAILED - \n${err}`);
	});

	console.log("Return Result = ", qsRslt.rows.length);


	if (qsRslt.rows.length > 0) {
		const pData = qsRslt.rows;
		pData.map(function (el) {
			Object.keys(el).map(function (k) {
				el[k] = typeof el[k] === "string" ? el[k].trim() : el[k] ? el[k] : "";
			});

			if (!userInfo) {	// If we have the UserInfo as part of the initial request then we already have all the data needed to send back
				// If we don't have the UserInfo then we need to format and return patient/user data to return
				/*	Response - { "p":"PORUS,KRIZ","s":"510686302","d":"19381129", "u": ["BOLGER,BELLISIMA-45848077","KRETH,LORGH-47181340"]} */
				// el.uSingle = `${el.ulast_name},${el.ufirst_name} ${el.umiddle_name ? el.umiddle_name : ""}`.trim();
				// el.uSingle = `${el.uSingle}-${el.uid}`;
				// el.middle_name = el.middle_name ? el.middle_name : "";
				// el.pName = `${el.last_name},${el.first_name} ${el.middle_name}`.trim();
				// el.dob = moment(el.dob).format("YYYYMMDD");
				// el.pSingle = `${el.pName}-${el.ssn}-${el.dob}`;
				// console.log("A single record - ", el, "\n------------------");
				/*	Response - { "p":"PORUS,KRIZ","s":"510686302","d":"19381129", "u": ["BOLGER,BELLISIMA-45848077","KRETH,LORGH-47181340"]} */
				el.uSingle = `${el.ulast_name},${el.ufirst_name} ${el.umiddle_name ? el.umiddle_name : ""}`.trim();
				el.uSingle = `${el.uSingle}-${el.uid}`;
				el.middle_name = el.middle_name ? el.middle_name : "";
				el.pName = `${el.last_name},${el.first_name} ${el.middle_name}`.trim();
				el.dob = moment(el.dob).format("YYYYMMDD");
				el.pSingle = `${el.pName}-${el.ssn}-${el.dob}`;
			}
				// console.log("rsGetPatientUserList - A single record - ", el, "\n------------------");
		});

		console.log("rsGetPatientUserList - return Data - ", pData, "\n------------------");

		return pData;
	} else {
		console.log("No Data Returned");
	}
	return null;
}



async function rsGetPatientUserDataList(req) {
	const patientInfo = extractPatient(req);

	let stmt = `select distinct`;
	stmt = `${stmt} ud.uid, ud.first_name as ufirst_name, ud.last_name as ulast_name, ud.middle_name as umiddle_name,`;
	stmt = `${stmt} pd.mvi, pd.first_name, pd.last_name, pd.middle_name, pd.ssn, pd.dob,`;
	stmt = `${stmt} mf.change_id as mfChange, mf.location_id as mfLocation, mf.file_path as mfFile, mf.date_id as mfDate, mf.time_id as mfTime`;
	stmt = `${stmt} from vasdw.message_fact mf`;
	stmt = `${stmt} JOIN vasdw.patients_dimension pd on pd.patient_id = mf.patient_id`;
	stmt = `${stmt} JOIN vasdw.users_dimension ud on ud.user_id = mf.user_id`;

	const re = /'/g;
	const newPfirst = patientInfo.firstName.replace(re, "\\'");
	const newPlast = patientInfo.lastName.replace(re, "\\'");

	stmt = `${stmt} where pd.first_name = '${newPfirst}' and pd.last_name = '${newPlast}'`;
	if (patientInfo.middleName) {
		const newPmiddle = patientInfo.middleName.replace(re, "\\'");
		stmt = `${stmt} AND pd.middle_name='${newPmiddle}'`;
	}
	if (patientInfo.ssn) {
		stmt = `${stmt} AND pd.ssn='${patientInfo.ssn}'`;
	}
	if (patientInfo.dob) {
		stmt = `${stmt} AND pd.dob='${patientInfo.dob}'`;
	}







	const qsRslt = await redShift.query(stmt).catch(function (err) {
		throw new Error(`rsGetPatientId - redShift.query - ${JSON.stringify(stmt)} FAILED - \n${err}`);
	});

	if (qsRslt.rows.length > 0) {
		const pData = qsRslt.rows;
		pData.map(function (el) {
			Object.keys(el).map(function (k) {
				el[k] = typeof el[k] === "string" ? el[k].trim() : el[k] ? el[k] : "";
			});

			/*	Response - { "p":"PORUS,KRIZ","s":"510686302","d":"19381129", "u": ["BOLGER,BELLISIMA-45848077","KRETH,LORGH-47181340"]} */
			el.uSingle = `${el.ulast_name},${el.ufirst_name} ${el.umiddle_name ? el.umiddle_name : ""}`.trim();
			el.uSingle = `${el.uSingle}-${el.uid}`;
			el.middle_name = el.middle_name ? el.middle_name : "";
			el.pName = `${el.last_name},${el.first_name} ${el.middle_name}`.trim();
			el.dob = moment(el.dob).format("YYYYMMDD");
			el.pSingle = `${el.pName}-${el.ssn}-${el.dob}`;
			console.log("A single record - ", el, "\n------------------");
		});

		return pData;
	} else {
		console.log("No Data Returned");
	}
	return null;
}


/* --------------------- API Data Retrieval Functions ------------------------------ */

async function howManyRecords(req, res) {
	const numAuditRecords = await drFuncs.howManyRecords();

	const rows = await redShift.query("SELECT * FROM vasdw.message_fact", { raw: true }).catch(function (err) {
		console.log("getMetadataCount from Redshift - Query Error on - SELECT * FROM vasdw.message_fact - ", err);
	});

	numAuditRecords.nMeta = rows.length;

	return JSON.stringify(numAuditRecords);
}

async function AuditRecord (req, res) {
	console.log("Audit Record File Path - ", req.params.yr, req.params.mon, req.params.day, req.params.file)
	const recPath = `${req.params.yr}/${req.params.mon}/${req.params.day}/${req.params.file}`;
	const aRec = await drFuncs.readAuditRecord(recPath);
	const decoder = new StringDecoder('utf8');
	const theAuditRecord = decoder.write(aRec.Body);
	return theAuditRecord;

	// let stmt = SQL`SELECT * from vasdw.file_dimension WHERE file_id=${req.params.id}`;

	// const qsRslt = await redShift.query(stmt).catch(function (err) {
	// 	throw new Error(`rsGetFileData - redShift.query - ${JSON.stringify(stmt, 4)} FAILED - ${err}`);
	// });

	// if (qsRslt.rows.length > 0) {
		// const aRec = await drFuncs.readAuditRecord(qsRslt.rows[0].path.trim());
		// const decoder = new StringDecoder('utf8');
		// const theAuditRecord = decoder.write(aRec.Body);
		// return theAuditRecord;
	// } else { console.log("No Record found for ", )}
	return null;
}

/*
 *	/MetaData/{patient} - Returns array of metadata records from Redshift for specified patient
 *
 *	Given a specific patient name and either ssn or dob
 *	return that full patient info and a list of users who have accessed that patient's records
 *	Request - http://192.168.0.25:8081/MetaData/MOGODUSH,GELLY?ssn=278949806
 *	Request - /MetaData/MOGODUSH,GELLY?dob=19980110
 *	Response - { "p":"PORUS,KRIZ","s":"510686302","d":"19381129", "u": ["BOLGER,BELLISIMA-45848077","KRETH,LORGH-47181340"]}
 */

async function MetadataPatient (req, res) {
	console.log("MetadataPatient - ", req.params.patient)
	console.log("rsGetPatientData - ", req.params.patient);
	const patientInfo = extractPatient(req);

	let patientData = await rsGetPatientUserList(req);
	console.log("MetadataPatient - patientData - ", patientData);

	if (patientData) {
		console.log("Patient/User Information - ", patientData.length);
		let ret = { p: patientData[0].pName, s: patientData[0].ssn, d: patientData[0].dob}
		let users = patientData.map(function(el) {
			return el.uSingle;
		})

		ret.u = users;
		return ret;
	}
	return `"No records found for Patient ${req.params.patient}"`
}


/**
 *
 *	Request - http://localhost:8081/MetaData/MOGODUSH,GELLY-278949806-19980110/BOLGER,BELLISIMA-45848077
 *	meta?p=VRAG,KELLY-560864778-19532105&u=KAZU,G%27KALI-59074875
 *	[{"_id":"5ee6653139c1063412a9efab",
 *		"p":"VRAG,KELLY-560864778-19532105",
 *		"u":"KAZU,G'KALI-59074875",
 *		"c":"PREFERRED NAME",
 *		"l":"PORTLAND",
 *		"d":"20160904014916-0500"}]
 *

{"response":"[
{\"p\":\"MOGODUSH,GELLY-278949806-19980110\",\"u\":\"BOLGER,BELLISIMA-45848077\",\"c\":\"INTEGRATION CONTROL NUMBER\",\"l\":\"WOODLAND\",\"d\":\"20152004013800\"}
{\"p\":\"MOGODUSH,GELLY-278949806-19980110\",\"u\":\"BOLGER,BELLISIMA-45848077\",\"c\":\"NAME\",\"l\":\"WOODLAND\",\"d\":\"20161011022000\"},



select distinct
cd.name as Change, ld.name as Location, dd.us_format_date as usDate, td.time_value as Time,
mf.change_id as mfChange, mf.location_id as mfLocation, mf.file_id as mfFile, mf.date_id as mfDate, mf.time_id as mfTime
from vasdw.message_fact mf
JOIN vasdw.change_dimension cd on cd.change_id = mf.change_id
JOIN vasdw.locations_dimension ld on ld.location_id = mf.location_id
JOIN vasdw.date_dimension dd on dd.date_id = mf.date_id
JOIN vasdw.time_dimension td on td.time_id = mf.time_id
JOIN vasdw.patients_dimension pd on pd.patient_id = mf.patient_id
JOIN vasdw.users_dimension ud on ud.user_id = mf.user_id
where pd.first_name = 'GELLY' AND pd.last_name = 'MOGODUSH'
AND ud.first_name='BELLISIMA' AND ud.last_name = 'BOLGER'
AND ud.uid = '45848077' AND pd.ssn='278949806' AND pd.dob='1998-01-10'

*/

async function MetadataPatientUser (req, res) {
	console.log("MetadataPatientUser - Entry point - ", req.params.patient, req.params.user)
	let mData = await rsGetPatientUserList(req);
	const retData = mData.map(function (el) {
		const d = el.usdate.split("/");
		const t = el.time.split(":");
		console.log("MetadataPatientUser - Single Record before - ", el, d, t);
		const retData = {
			p: req.params.patient,
			u: req.params.user,
			c: el.mfchange,
			l: el.location,
			d: `${d[2]}${d[0]}${d[1]}${t[0]}${t[1]}00`,
			t: el.mfrtype,
			path: el.mffile
		}
		console.log("MetadataPatientUser - Single Record after - ", retData);
		return retData;
	});

	console.log("MetadataPatientUser - EXIT point; all Data \n", retData);
	return retData;
}

/* ------------------- Missing Data Error Report -------------------------------------------------- */

service.get("/AuditRecord", async function( req, res ) {
	res.send(`{"response": You must specify a record ID!}`);
});

service.get("/MetaData", async function( req, res ) {
	// console.log("Metadata - 1", req.params.patient);
	res.send(`{"response": You must specify a patient!}`);
});

/* --------------------- API Functions ------------------------------ */
service.get("/howManyRecords", async function( req, res ) {
	console.log("howManyRecords")
	const resp = await howManyRecords (req, res);
	res.send(`{"response": ${resp}}`);
});


/**
 *
 *	auditById?id=5ee6653139c1063412a9efab
 *	{"response": {"_id":"5ee6653139c1063412a9efab","HEADER":{"RequestType":"Read","User":{"DUZ":1087960193,"UID":59074875,"UserName":"KAZU,G'KALI","Title":"movement might rays everything"},"Location":{"Site":"PORTLAND","StationNumber":107740},"DateTime":"20160904014916-0500","SchemaType":"FMAUDIT","Patient":{"DFN":4490997511,"DOB":19532105,"INITPLUS4":"V4778","MVI":"c4bcc974Ve67243fa","PatientName":"VRAG,KELLY","SSN":"560864778"}},"SCHEMA":{"RECORD ADDED":"","ACCESSED":"","NEW VALUE":"","OLD VALUE":"","FIELD NAME":"PREFERRED NAME","PROTOCOL or OPTION USED":"VAQ PDX4 (MENU)","FILE NUMBER":162.2,"FILE NAME":"PATIENT ALLERGIES","MENU OPTION USED":""}}}
 *
 */

service.options("/AuditRecord/:yr/:mon/:day/:file", function optionsResponse(req, res) {
	console.log("OPTIONS for - /AuditRecord/:yr/:mon/:day/:file")
	res.send("", 200);
});
service.get("/AuditRecord/:yr/:mon/:day/:file", async function( req, res ) {
	console.log("AuditRecord - ")
	const theAuditRecord = await AuditRecord(req, res);
	res.send(theAuditRecord);
});



/**
 *	Call:	http://localhost:8081/MetaData/HOLFAST,BANKS?ssn=213071808
 *			http://localhost:3000/MetaData/HOLFAST,BANKS?dob=19501021
 *	/MetaData/<LastName>,<FirstName> <MiddleName>?ssn=<SSN>		<---- SSN Format: ######### OR #########P
 *				OR
 *	/MetaData/<LastName>,<FirstName> <MiddleName>?dob=<DOB> 	<---- DOB Format: YYYYMMDD
 *
 *	Returns: {"response":  {"p":"<PATIENT_NAME>-<SSN>-<DOB>","u":["<USER_NAME>-<UID>","<USER_NAME>-<UID>","<USER_NAME>-<UID>"]}
 *
 *	CURRENT WORKING - {"response": {"p":"VRAG,KELLY",   "s":"560864778","d":"19532105","u":["KAZU,G'KALI-59074875"]}}
 *	NEW - {"response": {"p":"HOLFAST,BANKS","s":"213071808","d":"19501021","u":["PALKAR,MARLA-12345","ISSARRA,KOZAK-12345"]}}
 */
service.options("/MetaData/:patient", function optionsResponse(req, res) {
	console.log("OPTIONS for - /MetaData/:patient")
	res.send("", 200);
});

service.get("/MetaData/:patient", async function( req, res ) {
	console.log("GET - MetaData/Patient")
	const mdp = await MetadataPatient(req, res);
	console.log("mdp - ", mdp)
	res.send(mdp);
});

/**
 *
 *	meta?p=VRAG,KELLY-560864778-19532105&u=KAZU,G%27KALI-59074875
 *	[{"_id":"5ee6653139c1063412a9efab","p":"VRAG,KELLY-560864778-19532105","u":"KAZU,G'KALI-59074875","c":"PREFERRED NAME","l":"PORTLAND","d":"20160904014916-0500"}]
 *
 */

service.options("/MetaData/:patient/:user", function optionsResponse(req, res) {
	console.log("OPTIONS for - /MetaData/:patient/:user")
	res.send("", 200);
});

service.get("/MetaData/:patient/:user", async function( req, res ) {
	console.log("MetaData/Patient/User")
	const mdpu = await MetadataPatientUser(req, res);
	console.log("mdpu - ", mdpu)
	res.send(mdpu);

});

service.get('/version', function (req, res) {
	// optionally you can send the response data in the body property
	// 200 is the default response code
	res.send({ version: "1.0.0" });
})

service.get('/', function (req, res) {
	// optionally you can send the response data in the body property
	// 200 is the default response code
	res.send("No process requested");
})




// service.start(3000, "192.168.0.25").then((server) => { console.log("Listening on port 3000")})

service.start(port).then((server) => { console.log(`Listening on Local Server, Port: ${port}`)})
