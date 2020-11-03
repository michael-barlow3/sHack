require("dotenv").config();
const util = require("util");

const drFuncs = require("../AWS/s3.js");

(async function () {
	const allObj = await drFuncs.privateFcns.getAllObj().catch(function (err) {
		throw new Error(`READ failed on getAllObj, ${err}`);
	});
	console.log("Name: ", allObj.Name);
	console.log("Contents: ", util.inspect(allObj.Contents, { colors: true, showHidden: true, depth: null }));
})();
