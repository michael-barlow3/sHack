require("dotenv").config();

// eslint-disable-next-line import/no-extraneous-dependencies
const chai = require("chai");
// eslint-disable-next-line import/no-extraneous-dependencies
chai.use(require("chai-json-schema-ajv"));

const { assert, expect } = chai;
// const msgQueue = require("async-redis");
const msgQueue = require("redis-mock");

const sampleData = require("../packages/sample_data/sample_data.js"); // Require a module in this Repo, but NOT this package
const subscriber = require("../packages/subscriber/subscriber.js");

let mqClient;

const NumRecs = 10;
const PatientIdx = 5;
const UsrIdx = 15;

let sRecs = [];
let sRecs2 = [];
let sRecs3 = [];

const drConnectionString = process.env.drUrl;
const key = process.env.mqKey;
const server = process.env.mqServer;
const port = process.env.mqPort;
const dasDR = {};

before(async function () {
	console.log("Initializing Sample Data Records...");
	sRecs = sampleData.genAuditRecords(NumRecs);
	sRecs2 = sampleData.genAuditRecords(NumRecs, PatientIdx);
	sRecs3 = sampleData.genAuditRecords(NumRecs, PatientIdx, UsrIdx);
});

after(async function () {
	console.log("Terminating Subscriber Service...");
	subscriber.quitMqService();
});

describe("Subscriber Micro Service", async function () {
	it("Confirm Sample Audit Data is correct", function () {
		expect(sRecs[0]).to.be.jsonSchema(sampleData.auditSchema);
		expect(sRecs2[0]).to.be.jsonSchema(sampleData.auditSchema);
		expect(sRecs3[0]).to.be.jsonSchema(sampleData.auditSchema);
	});

	it("Starting up the Subscriber Service should return a connection", async function () {
		mqClient = await subscriber.init(msgQueue, dasDR, port, server, drConnectionString).catch(function (e) {
			console.log("Start Sub - Crashed =- ", e);
		});
		console.log("Init passed");
		assert.isOk(mqClient);
		assert.isObject(mqClient);
	});

	it("Simulate VistA Push of audit record to MQ Service", async function () {
		const keyLen = await mqClient.llen(key);
		console.log("keyLen - ", keyLen);
		// const drRecords = await subscriber.privateFcns.howManyRecords();

		const KeyLenAfterPush = await mqClient.rpush(key, JSON.stringify(sRecs[0]));
		console.log("KeyLenAfterPush - ", KeyLenAfterPush);

		// assert.equal(KeyLenAfterPush, keyLen + 1);
		// const nKeyLen = await mqClient.llen(key);
		// assert.equal(KeyLenAfterPush, nKeyLen);

		// const newDrRecords = await subscriber.privateFcns.howManyRecords();
		// assert.equal(newDrRecords.nAudit, drRecords.nAudit, "We should not have pushed any records to the Data Repository yet");
	});

	// it("Process the message pushed earlier", async function () {
	// 	const keyLen = await mqClient.llen(key);
	// 	const drRecords = await subscriber.privateFcns.howManyRecords();

	// 	try {
	// 		await subscriber.privateFcns.procMsgFromQueue();
	// 	} catch (e) {
	// 		console.log("Run and Wait crashed - ", e);
	// 	}

	// 	const nKeyLen = await mqClient.llen(key);
	// 	const nDrRecords = await subscriber.privateFcns.howManyRecords();
	// 	assert.equal(nKeyLen, keyLen - 1, "We did not remove a record from the quque");
	// 	assert.equal(drRecords.nAudit + 1, nDrRecords.nAudit, "We did not add a new Audit Record to the Data Repository");
	// 	assert.isOk(true);
	// });
});
