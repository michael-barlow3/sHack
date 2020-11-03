const chai = require("chai");
chai.use(require("chai-json-schema-ajv"));

const { assert, expect } = chai;

const patientSchema = require("../packages/sample_data/patient_schema.json");
const userSchema = require("../packages/sample_data/user_schema.json");
const siteSchema = require("../packages/sample_data/site_schema.json");
const fileSchema = require("../packages/sample_data/file_schema.json");
const auditSchema = require("../packages/sample_data/audit_schema.json");
const sampleData = require("../packages/sample_data/sample_data.js");

describe("sample_data", function () {
	it("getSite - returns a VAS Site object which matches the siteSchema", function () {
		expect(sampleData.privateFcns.getSite()).to.be.jsonSchema(siteSchema);
	});

	it("getFile - returns a VAS File object which matches the fileSchema", function () {
		expect(sampleData.privateFcns.getFile()).to.be.jsonSchema(fileSchema);
	});

	it("genPatientObj - returns an object", function () {
		const p = sampleData.privateFcns.genPatientObj(0);
		assert.isObject(p);
		expect(p).to.be.jsonSchema(patientSchema);
	});

	it("getRandomPatient - returns a Patient object which matches the PatientSchema", function () {
		const p = sampleData.privateFcns.getRandomPatient();
		assert.isObject(p);
		expect(p).to.be.jsonSchema(patientSchema);
	});

	it("genUserObj - returns an object", function () {
		const u = sampleData.privateFcns.genUserObj(0);
		assert.isObject(u);
		expect(u).to.be.jsonSchema(userSchema);
	});

	it("getRandomUser - returns a VAS User object which matches the UserSchema", function () {
		const u = sampleData.privateFcns.getRandomUser(0);
		assert.isObject(u);
		expect(u).to.be.jsonSchema(userSchema);
	});

	it("genAuditRecord - returns a valid VistA Audit Record", function () {
		const a = sampleData.genAuditRecords(1);
		assert.isArray(a);
		assert.equal(a.length, 1);
		assert.isObject(a[0]);
		expect(a[0]).to.be.jsonSchema(auditSchema);
	});

	it("gen multiple AuditRecords - returns an array of valid VistA Audit Records", function () {
		const aRecs = sampleData.genAuditRecords(5);
		assert.isArray(aRecs);
		assert.equal(aRecs.length, 5);
		for (let i = 0; i < 5; i += 1) {
			expect(aRecs[i]).to.be.jsonSchema(auditSchema);
		}
	});

	it("gen multiple AuditRecords for same patient but different users - returns an array of valid VistA Audit Records", function () {
		const aRecs = sampleData.genAuditRecords(5, 0);
		const p = aRecs[0].HEADER.Patient.PatientName;
		assert.isArray(aRecs);
		assert.equal(aRecs.length, 5);
		for (let i = 0; i < 5; i += 1) {
			expect(aRecs[i]).to.be.jsonSchema(auditSchema);
			assert.equal(aRecs[i].HEADER.Patient.PatientName, p);
		}
	});

	it("gen multiple AuditRecords for same patient and the same user - returns an array of valid VistA Audit Records", function () {
		const aRecs = sampleData.genAuditRecords(5, 0, 1);
		const p = aRecs[0].HEADER.Patient.PatientName;
		const u = aRecs[0].HEADER.User.UserName;

		assert.isArray(aRecs);
		assert.equal(aRecs.length, 5);

		for (let i = 0; i < 5; i += 1) {
			expect(aRecs[i]).to.be.jsonSchema(auditSchema);
			assert.equal(aRecs[i].HEADER.Patient.PatientName, p);
		}
		for (let i = 0; i < 5; i += 1) {
			expect(aRecs[i]).to.be.jsonSchema(auditSchema);
			assert.equal(aRecs[i].HEADER.User.UserName, u);
		}
	});
});
