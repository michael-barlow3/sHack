//raw connection
const redshiftClient = require('./redshift.js');
const SQL = require('sql-template-strings');

/**
 * Get the ID of based on the time_value
 * @param {the time value} time_value  
 */
export function getTimeId(time_value){
    return redshiftClient.query(SQL`SELECT time_id as id from vasdw.time_dimension WHERE time_value=${time_value}`);
}
