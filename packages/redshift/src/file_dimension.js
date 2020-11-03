//raw connection
const redshiftClient = require('./redshift.js');
const SQL = require('sql-template-strings');

/**
 * Create a new file metadata record with the path to the file in s3
 * @param {path of the file in S3} path 
 */
async function createFile(path){
    await redshiftClient.query(SQL`INSERT INTO vasdw.file_dimension (path) VALUES (${path})`);
    return redshiftClient.query("select MAX(file_id) as id from vasdw.file_dimension");
}

/**
 * Get the ID of based on the site, name and station number
 * @param {path of the file in S3} path 
 */
function getFileId(path){
    return redshiftClient.query(SQL`SELECT file_id from vasdw.file_dimension WHERE path =${path}`);
}

module.exports = {
    create: createFile, 
    getId: getFileId
}