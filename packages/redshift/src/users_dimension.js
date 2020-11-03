//raw connection
const redshiftClient = require('./redshift.js');
const SQL = require('sql-template-strings');

/**
 * Create a new file metadata record with the path to the file in s3
 * @param {path of the file in S3} path 
 */
async function createUser(userName, first_name, last_name, middle_name){
    await redshiftClient.query(SQL`INSERT INTO vasdw.users_dimension (uid, first_name, last_name, middle_name) VALUES (${userName}, ${first_name}, ${last_name}, ${middle_name})`);
    return redshiftClient.query("select MAX(user_id) as id from vasdw.users_dimension");
}

/**
 * Get the ID of based on the site, name and station number
 * @param {path of the file in S3} path 
 */
function getUserId(userName){
    return redshiftClient.query(SQL`SELECT user_id from vasdw.users_dimension WHERE uid =${userName}`);
}

module.exports = {
    create: createUser, 
    getId: getUserId
}