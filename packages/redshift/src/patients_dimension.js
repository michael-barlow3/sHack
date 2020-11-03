//raw connection
const redshiftClient = require('./redshift.js');
const SQL = require('sql-template-strings');

/**
 * Create a new file metadata record with the path to the file in s3
 * @param {path of the file in S3} path 
 */
async function createPatient(mvi, first_name, last_name, middle_name, ssn, dob){
    await redshiftClient.query(SQL`INSERT INTO vasdw.patients_dimension 
    (mvi, first_name, last_name, middle_name, ssn, dob) VALUES (${mvi},${first_name},${last_name}, ${middle_name}, ${ssn}, ${dob})`);
    return redshiftClient.query("select MAX(patient_id) as id from vasdw.patients_dimension");
}

/**
 * Get the ID of based on the site, name and station number
 * @param {path of the file in S3} path 
 */
function getPatientId(mvi, first_name, last_name, ssn){
    let query = SQL`SELECT distinct patient_id as id from vasdw.patients_dimension WHERE mvi=${mvi} AND first_name=${first_name} AND last_name=${last_name} AND ssn=${ssn} limit 1`;
    console.log(query);
    return redshiftClient.query(query);
}

module.exports = {
    create: createPatient, 
    getId: getPatientId
}