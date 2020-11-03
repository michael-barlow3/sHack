//raw connection
const redshiftClient = require('./redshift.js');
const SQL = require('sql-template-strings');

/**
 * Get the ID of based on the date_value
 * @param {the date value} date_value  
 */
export function getDateId(date_value){
    return redshiftClient.query(SQL`SELECT date_id as id from vasdw.date_dimension WHERE full_date=${date_value}`);
}
