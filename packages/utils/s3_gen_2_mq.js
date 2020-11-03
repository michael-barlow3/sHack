/**
 *	Utility function to generate Audit records using the "sample_data" code
 *	and sends those records to Redis/Elasticache
 * @module vas/utils/gen_records
 *
 * Run utility via "node"
 * @example <default>
 *  node gen_records
 *
 * @example
 *  node gen_records -c 10 <generate 10 records>
 *
 * Optional Command Line Arguments
 * c {Number} - # of records to generate
 *
 */
require("dotenv").config();
const moment = require("moment");
const chalk = require("chalk");
const util = require("util");

const sampleData = require("../sample_data/sample_data.js");

const key = process.env.mqKey;
const mqServer = process.env.mqServer;
const mqPort = process.env.mqPort;

function log(msg) {
	console.log(util.inspect(msg, { colors: true, showHidden: true, depth: null }));
}

async function actual(count, pIndex, uIndex) {
	const msgQueue = require("async-redis");

	/* APP SPECIFIC CODE */

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
	x += `${pMsg} and ${uMsg} to the Message Queue Service`;
	console.log(x);

	const mqClient = msgQueue.createClient({
		host: mqServer,
		port: mqPort
	});
	console.log(`Redis Config - ${mqServer},  ${mqPort}`);
	const allKeys = await mqClient.keys("*");
	console.log("All Redis Keys - ", allKeys);

	const asyncBlock = async () => {
		await mqClient.set("string key", "string val");
		const value = await mqClient.get("string key");
		console.log(value);
		await mqClient.flushall().catch(function (e) {
			console.log("Flush failed - ", e);
		});
	};

	await asyncBlock();

	const arrayOfPromises = sRecs.map(async function (el) {
		if (process.env.display_records) {
			log(el);
		}
		return mqClient.rpush(key, JSON.stringify(el));
	});

	await Promise.all(arrayOfPromises);

	if (mqClient) {
		mqClient.quit();
	}

	/* APP SPECIFIC CODE */
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
	console.log(`Writing ${count} records to the Message Queue Service`);
	const start = moment();

	await actual(count, pIndex, uIndex).catch(function (e) {
		console.log(chalk.red.bold(cmdLineParams.app), `${chalk.red.bold("ERROR: ")}`, e);
		process.exit(1);
	});

	const end = moment();
	console.log(`Start @ ${start} = End @ ${end}`);
})();
