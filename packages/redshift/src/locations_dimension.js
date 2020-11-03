//raw connection
const redshiftClient = require('./redshift.js');
const SQL = require('sql-template-strings');
const redshift = require('./redshift.js');


async function createLocation(station_number, name){
    await redshiftClient.query(SQL`INSERT INTO vasdw.locations_dimension ( station_number, name) VALUES (${station_number},${name})`);
    return redshiftClient.query("select MAX(location_id) as id from vasdw.locations_dimension");
    
}

/**
 * Get the ID of based on the site, name and station number
 * @param {teh station number} station_number 
 * @param {name of the location} name 
 */
function getLocationId( station_number, name){
    return redshiftClient.query(SQL`SELECT location_id as id from vasdw.locations_dimension WHERE station_number=${station_number} and name=${name}`);
}

module.exports = {
    createLocation: createLocation, 
    getLocationId: getLocationId
}