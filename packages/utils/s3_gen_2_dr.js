require("dotenv").config();
const moment = require("moment");
const chalk = require("chalk");
const sampleData = require("../sample_data/sample_data.js");

async function actual(bucket, count, pIndex, uIndex) {
	const drFuncs = require("../AWS/s3.js");

	const drConnection = await drFuncs.init(bucket, null);
	if (!drConnection) {
		console.log("DataRepository Init Failed");
	} else {
		const sRecs = sampleData.genAuditRecords(count, pIndex, uIndex); // Generate NumRecs Patient Audit Records for the same patient (PatientIdx)
		const pName = sRecs[0].HEADER.Patient.PatientName;
		const pDOB = sRecs[0].HEADER.Patient.DOB;
		const pSSN = sRecs[0].HEADER.Patient.SSN;
		const uName = sRecs[0].HEADER.User.UserName;

		let pMsg = "";
		let uMsg = "";
		if (pIndex >= 0) {
			pMsg = `\n     using a specific patient - ${pName} d=${pDOB} s=${pSSN}`;
		} else {
			pMsg = "using random patients";
		}
		if (uIndex >= 0) {
			uMsg = `\n     using a specific user - ${uName}`;
		} else {
			uMsg = "using random users";
		}
		if (uMsg !== "" || pMsg !== "") {
			uMsg += "\n";
		}

		let x = `Writing ${count.toString(10)}`;
		x += `record${count === 1 ? "" : "s"} `;
		x += `${pMsg} and ${uMsg} to the DR`;
		console.log(x);

		const arrayOfPromises = sRecs.map(async function (el) {
			await drFuncs.writeAuditRecord(el);
		});

		await Promise.all(arrayOfPromises);

		/* APP SPECIFIC CODE */

		if (drConnection) {
			console.log("Closing Connection");
			drConnection.close();
		}
	}
}

(async function () {
	const cmdLineParams = require("yargs")
		.usage("Usage: $0 [options]")
		.example("$0 - Generate 1 record using a random patient and random user and send to the Message Queue Service")
		.example("$0 -c 100 -p 10 -u 0 - Generate 100 records using a specific patient and a specific user and send to the Message Queue Service")
		.option("c", { alias: "count", default: 1, describe: "Number of records to generate" })
		.option("p", { alias: "pidx", default: -1, describe: "Index into list of 3K patients for specific patient to use (0-2999)" })
		.option("u", { alias: "uidx", default: -1, describe: "Index into list of 3K Users for specific user to use (0-2999)" })
		.help("h")
		.alias("h", "help").argv;
	cmdLineParams.app = (function () {
		const app = cmdLineParams.$0;
		let path;

		if (app.includes("\\")) {
			path = app.split("\\");
		} else if (app.includes("/")) {
			path = app.split("/");
		} else {
			path = [app];
		}
		return path[path.length - 1];
	})();

	const count = cmdLineParams.c;
	const pIndex = cmdLineParams.p;
	const uIndex = cmdLineParams.u;

	console.log(`Running ${cmdLineParams.app}`);
	const bucket = process.env.AWS_VAS_BUCKET;

	console.log(`Writing ${count} records directly to the Data Repository`);
	const start = moment();

	await actual(bucket, count, pIndex, uIndex).catch(function (e) {
		console.log(chalk.red.bold(cmdLineParams.app), `${chalk.red.bold("ERROR: ")}`, e);
		process.exit(1);
	});

	const end = moment();
	console.log(`Start @ ${start} = End @ ${end}`);
})();
