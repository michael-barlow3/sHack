require("dotenv").config();
const util = require("util");
const chalk = require("chalk");

async function actual(bucket, count, path) {
	console.log(`Actual - ${bucket} - ${count} - ${path}`);
	const drFuncs = require("../AWS/s3.js");

	const drConnection = await drFuncs.init(bucket, null);
	if (!drConnection) {
		console.log("DataRepository Init Failed");
	} else {
		let allObj;
		let sPath = "";
		if (path) {
			console.log(typeof path);
			sPath = path.toString();
			console.log(typeof sPath);
		}

		if (sPath.length > 6 && sPath.slice(-5) === ".json") {
			console.log("Reading specific file - ", sPath);
			const oneObj = await drFuncs.privateFcns.getObj(sPath).catch(function (err) {
				throw new Error(`READ failed on getObj, ${err}`);
			});
			console.log("Audit Record: ", util.inspect(JSON.parse(oneObj.Body.toString()), { colors: true, showHidden: true, depth: null }));
		} else {
			allObj = await drFuncs.privateFcns.getObjects(count, sPath).catch(function (err) {
				throw new Error(`READ failed on getAllObj, ${err}`);
			});
			const paths = allObj.Contents.map(function (e) {
				return e.Key;
			});
			console.log("Name: ", allObj.Name);
			console.log("Audit Records: ", paths);
		}

		if (drConnection) {
			drConnection.close();
		}
	}
}

(async function () {
	const cmdLineParams = require("yargs")
		.usage("Usage: $0 [options]")
		.example("$0 - Retrieve Audit Records (up to 100) in the Environment being tested and display paths to the individual audit records")
		.example("$0 -c 10 - Retrieve up to 10 Audit Records")
		.example("$0 -c 10 -p 2016/09 - Retrieve up to 10 Audit Records starting in the specified path (2016/09)")
		.example("$0 -c 10 -p 2016/04/05/1595887639906_5900_348476de.json - Retrieve specific audit record and display the record")
		.option("c", { alias: "count", default: 1, describe: "Number of records to retrieve" })
		.option("p", { alias: "path", describe: "Retrieve record(s) at specified path - e.g. 2016/09/" })
		.help("h")
		.alias("h", "help").argv;
	cmdLineParams.app = (function () {
		const app = cmdLineParams.$0;
		let lPath;

		if (app.includes("\\")) {
			lPath = app.split("\\");
		} else if (app.includes("/")) {
			lPath = app.split("/");
		} else {
			lPath = [app];
		}
		return lPath[lPath.length - 1];
	})();

	const count = cmdLineParams.c;
	const path = cmdLineParams.p;

	console.log(`Running ${cmdLineParams.app}`);
	const bucket = process.env.AWS_VAS_BUCKET;

	await actual(bucket, count, path).catch(function (e) {
		console.log(chalk.red.bold(cmdLineParams.app), `${chalk.red.bold("ERROR: ")}`, e);
		process.exit(1);
	});
})();
