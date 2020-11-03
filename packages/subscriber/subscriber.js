require("dotenv").config();
const chai = require("chai");
const msgQueue = require("async-redis");
const util = require("util");
const uuid = require("uuid");

const process = require("process");

chai.use(require("chai-json-schema-ajv"));

const { unescape } = require("html-escaper");
// const sampleData = require("../sample_data/sample_data.js");
const drFuncs = require("../AWS/s3.js");

// const { expect } = chai;

function log(msg) {
	console.log(util.inspect(msg, { colors: true, showHidden: true, depth: null }));
}

function _getUNID() {
	const pid = process.pid ? process.pid : "00000";
	const timestamp = Date.now();
	const counter = uuid.v4().split("-")[0];
	return `${timestamp}_${pid}_${counter}`;
}

function _getBucketPathFromDate(date) {
	// extract Yr, Mon, Day from date passed (YYYYMMDD)
	// to form path YYYY/MM/DD
	return `${date.substr(0, 4)}/${date.substr(4, 2)}/${date.substr(6, 2)}`;
}

function _getPathKey(record) {
	const key = _getUNID();
	const Path = _getBucketPathFromDate(record.HEADER.DateTime);
	const pathKey = `${Path}/${key}.json`;
	return pathKey;
}

const readKey = process.env.mqKey;
const writeKey = process.env.mqWriteKey;

const server = process.env.mqServer;
const port = process.env.mqPort;
const bucket = process.env.AWS_VAS_BUCKET;

let drClient = null;
let mqClient = null;
const waitMS = 10;
let globalError = false;

// VistA sends us data which might have special characters in it which need to be converted
async function ProcMsg(msg) {
	if (!globalError) {
		const xLatedMsg = JSON.parse(unescape(JSON.stringify(msg)));
		xLatedMsg.path = _getPathKey(xLatedMsg);

// Patch to avoid crashing on missing fields.
if (xLatedMsg.HEADER.User.DUZ === '') {
	xLatedMsg.HEADER.User.DUZ = 1;
}
if (xLatedMsg.HEADER.User.UID === '') {
	xLatedMsg.HEADER.User.UID = 1;
}
if (xLatedMsg.HEADER.Patient.DFN === '') {
	xLatedMsg.HEADER.Patient.DFN = 1;
}
if (xLatedMsg.HEADER.Patient.MVI === '') {
	xLatedMsg.HEADER.Patient.MVI = "(none)";
}
if (xLatedMsg.HEADER.Patient.SSN === '') {
	xLatedMsg.HEADER.Patient.SSN = "NYA";
}

if (!xLatedMsg.SCHEMA.hasOwnProperty("FIELD NAME") || xLatedMsg.SCHEMA["FIELD NAME"] === '') {
	xLatedMsg.SCHEMA["FIELD NAME"] = "(none)";
}

if (!xLatedMsg.SCHEMA.hasOwnProperty("PROTOCOL or OPTION USED") || xLatedMsg.SCHEMA["PROTOCOL or OPTION USED"] === '') {
	xLatedMsg.SCHEMA["PROTOCOL or OPTION USED"] = "N/A";
}


		await mqClient.lpush(writeKey, JSON.stringify(xLatedMsg)).catch(function (e) {
			throw new Error(`Subscriber ProcMsg() call to mqClient.lpush() failed - ${e}`);
		});

		const dasWrite = await drFuncs.writeAuditRecord(xLatedMsg).catch(function (e) {
			throw new Error(`Subscriber ProcMsg() call to drFuncs.writeAuditRecord() failed - ${e}`);
		});

		return dasWrite;
	}
	return null;
}

async function procMsgFromQueue() {
	let m2push = {};
	let msgbp = 0;
	try {
		// console.log("Waiting for Message");
		const Msg = await mqClient.blpop(readKey, 0).catch(function (e) {
			throw new Error(`Subscriber procMsgFromQueue() call to mqClient.blpop() failed - ${e}`);
		});
		console.log("BLPOP passed - ", Msg);

		try {
			m2push = JSON.parse(Msg[1]); // Element 0 is the key itself, element 1 is the data popped
			console.log("Parse msg passed - ", m2push);
		} catch (e) {
			globalError = `JSON Parse Error `, e;
			throw new Error(globalError);
		}

		// if (expect(m2push).to.be.jsonSchema(sampleData.auditSchema)) { --- Remove validation until we have a valid schema definition
		const mp1 = await ProcMsg(m2push).catch(function (e) {
			throw new Error(`Subscriber procMsgFromQueue() call to ProcMsg() failed - ${e}`);
		});

		console.log("ProcMsg passed - ", mp1);
		if (process.env.display_records) {
			log(m2push);
		}

		// }
		// globalError = `${globalError}\nDid NOT get a valid Audit Record from the MessageQueue service\n${m2push}`;
		// throw new Error(globalError);
	} catch (e) {
		globalError = `${globalError}\nError in blpop - ${JSON.stringify(e, null, "  ")}`;
		throw new Error(globalError);
	}
}

/*
 *
 * Functions for use external to this module
 *
 */

async function writeQueueSize() {
	const ListSize = await mqClient.llen(writeKey).catch(function (e) {
		throw new Error(`Subscriber writeQueueSize() call failed - ${e}`);
	});
	return ListSize;
}

async function readQueueSize() {
	const ListSize = await mqClient.llen(readKey).catch(function (e) {
		throw new Error(`Subscriber readQueueSize() call failed - ${e}`);
	});
	return ListSize;
}

async function runAndWait() {
	if (globalError) {
		console.log("Error received Ignoring data - \n", globalError);
		await procMsgFromQueue();
		setTimeout(runAndWait, waitMS);
		globalError = null;
	} else {
		await procMsgFromQueue();
		setTimeout(runAndWait, waitMS);
	}
}

async function getMsgFromWriteQueue() {
	try {
		const Msgs2Get = await writeQueueSize();
		if (Msgs2Get > 0) {
			console.log(`There are ${Msgs2Get} messages in the ${writeKey} Queue`);
			const Msg = await mqClient.blpop(writeKey, 0).catch(function (e) {
				throw new Error(`Subscriber procMsgFromWriteQueue() call to mqClient.blpop() failed - ${e}`);
			});
			const m2push = JSON.parse(Msg[1]); // Element 0 is the key itself, element 1 is the data popped
			const xLatedMsg = JSON.parse(unescape(JSON.stringify(m2push)));

			console.log("ProcAuditMsg passed - ", xLatedMsg);
			if (process.env.display_records) {
				log(xLatedMsg);
			}
			return xLatedMsg;
		}
		console.log(`There are NO messages in the ${writeKey} Queue for getMsgFromWriteQueue() to return`);
		return null;
	} catch (e) {
		globalError = `${globalError}\nError in getMsgFromWriteQueue - ${JSON.stringify(e, null, "  ")}`;
		throw new Error(globalError);
	}
}

async function quitMqService() {
	if (drClient !== null) {
		console.log("Closing out DR connection");
		drClient.close().catch(function (e) {
			drClient = null;
			console.log("FAILURE attempting to close/flush out the DR Service - ", e);
			globalError = `${globalError}\nFAILURE attempting to close/flush out the DR Service`;
		});
	}

	if (mqClient !== null) {
		// Don't flush the DB on quiting. We might still need the Write Queue for the RedShift service
		// await mqClient.flushdb().catch(function (err) {
		// 	throw new Error(`mqClient.flushdb() generated an error - ${err}`);
		// });
		mqClient.quit();
	}
	drClient = null;
	mqClient = null;
}

async function howManyRecords() {
	// Test function to verify how many records exist in Data Repository
	return drFuncs.howManyRecords();
}

async function init() {
	console.log(`Subscriber Initialization port: ${port}, server: ${server}, bucket: ${bucket}`);
	if (process.env.display_records) {
		console.log("Displaying records pulled from MQ");
	}
	globalError = null;

	await drFuncs.init(bucket).catch(function (err) {
		throw new Error(`READ failed on getAllObj, ${err}`);
	});
	mqClient = msgQueue.createClient(port, server);
	mqClient.on("error", function (err) {
		console.log(`MQService Init Error ${err}`);
		globalError = `${globalError}\nMQService Init Error ${JSON.stringify(err, null, "  ")}`;
		quitMqService();
	});
	mqClient.on("connect", function () {
		console.log("connected");
	});

	const sMsg = "Are we connected?";
	let Msg = await mqClient.set("Test", sMsg).catch(function (e) {
		throw new Error(`Subscriber Set TEST SET function() failed - ${e}`);
	});
	console.log("SET - ", Msg);

	Msg = await mqClient.get("Test").catch(function (e) {
		throw new Error(`Subscriber Set TEST GET function() failed - ${e}`);
	});
	if (Msg === sMsg) {
		console.log(`${sMsg} - Yes we are`);
	} else {
		console.log(`${sMsg} - NO we aren't`);
	}

	console.log("Starting with data in the DR: ", await howManyRecords());

	return mqClient;
}

module.exports = {
	init,
	quitMqService,
	howManyRecords,
	writeQueueSize,
	readQueueSize,
	getMsgFromWriteQueue,
	runAndWait
};
