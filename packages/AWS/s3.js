require("dotenv").config();
const AWS = require("aws-sdk");
// const moment = require("moment");
// const process = require("process");
const util = require("util");

function log(msg) {
	console.log(util.inspect(msg, { colors: true, showHidden: true, depth: null }));
}

function _getAuditRecs(maxRec) {
	console.log("_getAuditRecs(maxRec) - ", maxRec);
}

function _getUniquePatientsFromMetaData(maxRec, sortType) {
	console.log("_getUniquePatientsFromMetaData(maxRec, sortType) - ", maxRec, sortType);
}

/**
 *  Establish the environment to communicate with S3
 */
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION;
const awsVasBucket = process.env.AWS_VAS_BUCKET;

let AWS_Config = {
	apiVersions: {
		s3: "2006-03-01"
	},
	region: awsRegion
};
if (process.env.AWS_ENV == "GCIO") {
	AWS_Config.credentials = {
		accessKeyId: awsAccessKeyId,
		secretAccessKey: awsSecretAccessKey
	};
} else if (process.env.AWS_ENV == "LOCAL") {
	AWS_Config.credentials = {
		accessKeyId: awsAccessKeyId,
		secretAccessKey: awsSecretAccessKey
	};
}

console.log("AWS_Config - ", AWS_Config);

// Set the region
AWS.config.update(AWS_Config);

const s3 = new AWS.S3();

async function getAllBuckets() {
	// log("getAllBuckets");
	const AllBucketsPromise = await s3.listBuckets().promise();
	// log(AllBucketsPromise.Contents);
	return AllBucketsPromise;
}

async function getAllObj() {
	// log("getObjects");
	const params = { Bucket: awsVasBucket };
	const listObjectsPromise = await s3.listObjectsV2(params).promise();
	return listObjectsPromise;
}

async function getObjects(count, prefix) {
	console.log(`getObjects - ${count} - ${prefix}`);
	const params = { Bucket: awsVasBucket };
	if (count) {
		params.MaxKeys = count;
	}
	if (prefix) {
		params.Prefix = prefix;
	}
	const listObjectsPromise = await s3.listObjectsV2(params).promise();
	return listObjectsPromise;
}

async function putObj(record) {
	const params = {
		Bucket: awsVasBucket,
		Key: record.path,
		Body: JSON.stringify(record)
	};
	const putObjectPromise = await s3
		.putObject(params)
		.promise()
		.catch(function (err) {
			log(`putObj - ${params}\nRecord - ${record}`);
			throw new Error(`INIT failed on putObject, ${err}`);
		});
	return putObjectPromise;
}

async function getObj(recordPath) {
	const params = {
		Bucket: awsVasBucket,
		Key: recordPath
	};
	const recordFile = s3.getObject(params).promise();
	return recordFile;
}

/**
 *
 *  Establish a connection to S3 and confirm it's available
 *  return object containing a dunsel function to retain compatability with previous code functionality
 *  if established or throw an error
 *
 */
async function init(bucket) {
	// log("init");
	// Permissions changed on VAEC role, can't get all buckets
	// const allBuckets = await getAllBuckets().catch(function (err) {
	// 	throw new Error(`INIT failed on getAllBuckets, ${err}`);
	// });

	// log(allBuckets.Buckets);
	if (bucket) {
		return {
			close: function () {
				// Holdover from previous architecture
				// Maintained so that minimal changes are needed for POC
				// Update all code to eliminate need in future.
				// log("Close Connection...");
			}
		};
	}


	// 	const haveBucket = allBuckets.Buckets.filter(function (b) {
	// 		return b.Name === bucket;
	// 	});

	// 	if (haveBucket.length === 1) {
	// 		return {
	// 			close: function () {
	// 				// Holdover from previous architecture
	// 				// Maintained so that minimal changes are needed for POC
	// 				// Update all code to eliminate need in future.
	// 				// log("Close Connection...");
	// 			}
	// 		};
	// 	}
	// 	throw new Error(`Bucket ${bucket} is not available`);
	// } else {
	// 	return allBuckets.Buckets;
	// }
}

/*
 *
 *  howManyRecords - Utility function to return # of audit and metadata records in the DR
 *
 */
async function howManyRecords() {
	const count = {};
	const AuditRecords = await getAllObj().catch(function (err) {
		throw new Error(`READ failed on getAllObj, ${err}`);
	});
	// count.nMeta = AuditRecords.Contents.length;
	count.nAudit = AuditRecords.Contents.length;
	return count;
}


async function readAuditRecord(recordPath) {
	log(`readAuditRecord - ${recordPath}`);
	const readResult = await getObj(recordPath).catch(function (err) {
		throw new Error(`INIT failed on readAuditRecord, ${err}`);
	});
	return readResult;
}

/**
 *
 *  Write audit record passed, return true or throw an error
 *
 */

async function writeAuditRecord(record) {
	log(`writeAuditRecord - ${record.HEADER.DateTime}`);
	const writeResult = await putObj(record).catch(function (err) {
		throw new Error(`INIT failed on writeAuditRecord, ${err}`);
	});
	log(`writeAuditRecord - ${writeResult.ETag}`);
	return writeResult.ETag;
}

/**
 * The following internal private functions are exposed merely for testing.
 * They should not be called by any external processes other than the test modules
 */
const privateFcns = {
	getAllBuckets,
	getAllObj,
	getObjects,
	_getAuditRecs,
	_getUniquePatientsFromMetaData,
	getObj,
	putObj
};

// getMetaData4PUsr /* No Test */,
// getMetaData4P,
// getAuditRecordById /* No Test */,

module.exports = {
	init,
	howManyRecords,
	writeAuditRecord,
	readAuditRecord,
	privateFcns
};
