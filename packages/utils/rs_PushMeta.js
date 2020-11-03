require("dotenv").config();
// const chalk = require("chalk");
const util = require("util");
// const drFuncs = require("../AWS/s3.js");
const drRsFuncs = require("../AWS/redshift.js");
const subscriber = require("../subscriber/subscriber.js");

// const redshift = drRsFuncs.redshift;
// const bucket = process.env.AWS_VAS_BUCKET;

// MQ Location to read Audit Records from for Metadata
const writeKey = process.env.mqWriteKey;

function log(msg) {
	console.log(util.inspect(msg, { colors: true, showHidden: true, depth: null }));
}

(async function () {
	let complete = false;
	const clientReady = await subscriber.init();

	if (clientReady) {
		const wCount = await subscriber.writeQueueSize().catch(function (err) {
			throw new Error(`READ failed on writeQueueSize, ${err}`);
		});

		const rCount = await subscriber.readQueueSize().catch(function (err) {
			throw new Error(`READ failed on readQueueSize, ${err}`);
		});

		console.log(`writeQueueSize - ${wCount}; ${writeKey}\nreadQueueSize - ${rCount};  Records`);

		const AuditRecord = await subscriber.getMsgFromWriteQueue();
		if (AuditRecord) {
			log(`Audit Record from ${writeKey} Queue - ${JSON.stringify(AuditRecord)}`);
			const mdRec = await drRsFuncs.genMetadata(AuditRecord);
			console.log("mdRec - ", mdRec);
		} else {
			console.log("No Audit Record from Write Queue");
		}
		complete = true;
	}

	subscriber.quitMqService();
	return complete;
})();
