const chai = require("chai");
chai.use(require("chai-datetime"));

const { assert } = chai;

const s3 = require("../packages/das_dr/das_dr.js");

describe("s3", async function () {
	it("S3 bucket name ", function () {
		const d = new Date("December 17, 1995 03:24:00");
		const bucketName = s3.getBucketNameFromDate(d);
		// "YYYY-MM-DD/YYYYMMDDkk" - bucket name will look like this
		assert.equal("1995-12-17/1995-12-17-03", bucketName);
	});
	it("Mongo ID conversion ", function () {
		// 2020-05-15-04:04:08
		let mongoid = "5ebe4cf80000000000000000";
		let mongoDate = s3.getDateFromId(mongoid);

		let compareDate = new Date("May 15, 2020 04:04:08");

		// mongoDate.should.equalDate(compareDate);
		// "YYYY-MM-DD/YYYYMMDDkk" - bucket name will look like this
		assert.equalDate(mongoDate, compareDate);

		mongoid = "3133cfbb0000000000000000";
		mongoDate = s3.getDateFromId(mongoid);
		compareDate = new Date("February 27, 1996 22:44:59");
		assert.equalDate(mongoDate, compareDate);
	});
});
