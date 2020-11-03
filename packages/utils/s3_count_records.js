require("dotenv").config();
const util = require("util");
const drFuncs = require("../AWS/s3.js");

(async function () {
	const initGood = await drFuncs.init(process.env.AWS_VAS_BUCKET).catch(function (err) {
		throw new Error(`INIT failed, ${err}`);
	});
	console.log("InitGood returns - ", initGood);

	const count = await drFuncs.howManyRecords().catch(function (err) {
		throw new Error(`READ failed on count, ${err}`);
	});
	console.log("-------------- count --------------\n", util.inspect(count, { colors: true, showHidden: true, depth: null }));
})();
