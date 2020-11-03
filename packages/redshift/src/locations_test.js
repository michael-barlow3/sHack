import "core-js/stable";
import "regenerator-runtime/runtime";

if (!('NODE_ENV' in process.env) && process.env.NODE_ENV !== 'docker') {
  require('dotenv').config();
}

const locations = require("./locations_dimension");
const patients = require("./patients_dimension");

/*
locations.getLocationId(
    107740, "MISSION"
  ).then(function (data) {
      console.log("data",data);
      console.log("data rows", data.rows[0].id);
  });
*/

  patients.getId('76be35bcV31d849a3', 'GELLY', 'MOGODUSH', '278949806').then((data) => {
      console.log("data", data);
  });
