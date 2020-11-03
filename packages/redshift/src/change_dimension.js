//raw connection
const redshiftClient = require('./redshift.js');
const SQL = require('sql-template-strings');

/**
 * Create a new file metadata record with the path to the file in s3
 * @param {path of the file in S3} path 
 */
async function createChange(name, description){
    await redshiftClient.query(SQL`INSERT INTO vasdw.change_dimension (name, description) VALUES (${name},${description})`);
    return redshiftClient.query("select MAX(change_id) as id from vasdw.change_dimension");
}

/**
 * Get the ID of based on the site, name and station number
 * @param {path of the file in S3} path 
 */
function getChangeId(name, description){
    return redshiftClient.query(SQL`SELECT change_id from vasdw.change_dimension WHERE name=${name} AND description=${description}`);
}

module.exports = {
    create: createChange, 
    getId: getChangeId
}