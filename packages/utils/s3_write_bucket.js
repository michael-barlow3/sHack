require("dotenv").config();
const util = require("util");

const drFuncs = require("../AWS/s3.js");

const aRecord = {
	HEADER: {
		RequestType: "Read",
		User: {
			DUZ: 1087960193,
			UID: 59074875,
			UserName: "KAZU,G'KALI",
			Title: "movement might rays everything"
		},
		Location: {
			Site: "PORTLAND",
			StationNumber: 107740
		},
		DateTime: "20160904014916-0500",
		SchemaType: "FMAUDIT",
		Patient: {
			DFN: 4490997511,
			DOB: 19532105,
			INITPLUS4: "V4778",
			MVI: "c4bcc974Ve67243fa",
			PatientName: "VRAG,KELLY",
			SSN: "560864778"
		}
	},
	SCHEMA: {
		"RECORD ADDED": "",
		ACCESSED: "",
		"NEW VALUE": "",
		"OLD VALUE": "",
		"FIELD NAME": "PREFERRED NAME",
		"PROTOCOL or OPTION USED": "VAQ PDX4 (MENU)",
		"FILE NUMBER": 162.2,
		"FILE NAME": "PATIENT ALLERGIES",
		"MENU OPTION USED": ""
	}
};

(async function () {
	const putObjResponse = await drFuncs.privateFcns.putObj(aRecord).catch(function (err) {
		throw new Error(`READ failed on putObj, ${err}`);
	});
	console.log(util.inspect(putObjResponse.ETag, { colors: true, showHidden: true, depth: null }));
})();
