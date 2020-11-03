require("dotenv").config();
const chalk = require("chalk");

async function actual(bucket) {
	const drFuncs = require("../AWS/s3.js");

	const drConnection = await drFuncs.init(bucket, null);
	if (!drConnection) {
		console.log("DataRepository Init Failed");
	} else {
		/* APP SPECIFIC CODE */
		console.log("Unique Patients from Metadata");
		const nRecs = await drFuncs.privateFcns._getUniquePatientsFromMetaData(1000, 1);
		console.log("\nPatients and users who accessed them from Metadata:", nRecs, "\n");

		const nRecs2 = await drFuncs.privateFcns._getUniquePatientsFromMetaData(1000, 2);
		console.log("\nPatients and users who accessed them from Metadata:", nRecs2, "\n");

		const aRecs = await drFuncs.privateFcns._getAuditRecs(1000);
		console.log("\nPatient object from Audit Recs:", aRecs);
		/* APP SPECIFIC CODE */

		if (drConnection) {
			drConnection.close();
		}
	}
}

(async function () {
	const cmdLineParams = require("yargs")
		.usage("Usage: $0 [options]")
		.example("$0 Retrieve Patient Metadata Records (up to 100) in the specified Environment")
		.example("   Also displays Audit Records (up to 100) in the specified Environment")
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

	console.log(`Running ${cmdLineParams.app}`);
	const bucket = process.env.AWS_VAS_BUCKET;

	await actual(bucket).catch(function (e) {
		console.log(chalk.red.bold(cmdLineParams.app), `${chalk.red.bold("ERROR: ")}`, e);
		process.exit(1);
	});
})();
