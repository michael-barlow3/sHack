const Redshift = require("node-redshift");
const SQL = require("sql-template-strings");
const msgQueue = require("async-redis");
require("dotenv").config();

const util = require("util");
// const drS3Funcs = require("./packages/AWS/s3.js");
const drRsFuncs = require("./packages/AWS/redshift.js");
// const subscriber = require("./packages/subscriber/subscriber.js");

const readKey = process.env.mqKey;
const writeKey = process.env.mqWriteKey;

const server = process.env.mqServer;
const port = process.env.mqPort;
const bucket = process.env.AWS_VAS_BUCKET;

let drClient = null;
let mqClient = null;
const waitMS = 10;
let globalError = false;


async function redis() {

	mqServer="vas-dev-001.rwdloz.0001.usgw1.cache.amazonaws.com";
	mqPort=6379;

	console.log("Redis Server - ", mqServer);

	mqClient = msgQueue.createClient(mqPort, mqServer);

	mqClient.on("error", function (err) {
		console.log(`MQService Init Error ${err}`);
		mqClient.quit();
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
}

async function test() {
	const stmt = SQL`SELECT * from vasdw.patients_dimension`;
	const rslt = await drRsFuncs.redshift.query(stmt).catch(function (err) {
		throw new Error(`CreateUser - redshift.query - ${stmt} FAILED - ${err}`);
	});
	console.log(rslt.rows);
}

(async function () {
	const x = await redis();
	console.log(x);
})();