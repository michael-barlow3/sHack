require("dotenv").config();
const util = require("util");

const drFuncs = require("../AWS/s3.js");

(async function () {
	const allBuckets = await drFuncs.privateFcns.getAllBuckets().catch(function (err) {
		throw new Error(`READ failed on getAllBuckets, ${err}`);
	});
	console.log(util.inspect(allBuckets.Buckets, { colors: true, showHidden: true, depth: null }));
})();
