require("dotenv").config();
const Redshift = require("node-redshift");
// const chalk = require("chalk");

// const drFuncs = require("../AWS/s3.js");
const subscriber = require("../subscriber/subscriber.js");

// const MWB_ComputerIP = "73.52.53.145";
// const rg_loc_host = "redshift-cluster-1.cbxiwuvqjz3d.us-east-2.redshift.amazonaws.com";

const client = {
	user: process.env.RS_USER,
	database: process.env.RS_DATABASE,
	password: process.env.RS_PASSWORD,
	port: process.env.RS_PORT,
	host: process.env.RS_HOST
};

const redshift = new Redshift(client);
const bucket = process.env.AWS_VAS_BUCKET;

async function getAuditCount() {
	console.log("getAuditCount - Start");
	console.log("Initialize Subscriber service");
	const clientReady = await subscriber.init();
	let Ret = {};
	if (clientReady) {
		const wCount = await subscriber.writeQueueSize().catch(function (err) {
			throw new Error(`READ failed on writeQueueSize, ${err}`);
		});

		const rCount = await subscriber.readQueueSize().catch(function (err) {
			throw new Error(`READ failed on readQueueSize, ${err}`);
		});

		const count = await subscriber.howManyRecords().catch(function (err) {
			throw new Error(`howManyRecords failed on count, ${err}`);
		});

		console.log(`MQ Count - wCount: ${wCount}; rCount: ${rCount} Records`);
		console.log(`${bucket} S3 Bucket Count: ${JSON.stringify(count)} Records`);
		Ret = { wCount: wCount, rCount: rCount, s3Count: count };
	} else {
		console.log("Failed to connect to MQ Service");
	}
	return Ret;
}

async function getMetadataCount() {
	console.log("getMetadataCount - Start");

	const rows = await redshift.query("SELECT * FROM vasdw.message_fact", { raw: true }).catch(function (err) {
		console.log("getMetadataCount from Redshift - Query Error on - SELECT * FROM vasdw.message_fact - ", err);
	});

	console.log("getMetadataCount from Redshift - Data: ", rows);

	// if you want to close client pool, uncomment redshift.close() line
	// but you won't be able to make subsequent calls because connection is terminated
	redshift.close();
	if (rows) {
		return rows.length;
	}
	return 0;
}

(async function () {
	const aCount = await getAuditCount();
	const mCount = await getMetadataCount();
	console.log(`Testing Counts - Audit: ${JSON.stringify(aCount)}; Metadata: ${mCount}`);
	return { nAudit: aCount.s3Count, mAudit: mCount };
})();
