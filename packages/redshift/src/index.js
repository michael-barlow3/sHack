
import "core-js/stable";
import "regenerator-runtime/runtime";
const process = require('process');

// console.log("Process env", process.env);

if (!('NODE_ENV' in process.env) && process.env.NODE_ENV !== 'docker') {
  require('dotenv').config();
}

const locations = require("./locations_dimension");
const files = require("./file_dimension");
const change = require("./change_dimension");
const user = require("./users_dimension");
const patient = require("./patients_dimension");
const dateDim = require("./date_dimension");
const timeDim = require("./time_dimension");
const messageFact = require("./message_fact");
const moment = require('moment');

const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

// load example json
//let dataObj = require("../example.json");

function runProcess() {
  redisClient.brpop(['vsr_audit', 0], function (listName, item) {
    //console.log("Data Obj", item);
    let dataObj = JSON.parse(item[1]);
    console.log("Inserting following data", dataObj);
    insertInRedshift(dataObj);
    // this recursive call will make this an infinitely running application
    console.log("Finished -- waiting for next one");
    runProcess();
  });
}

function insertInRedshift(dataObj) {

  let locationId = null;
  let stationNumber = dataObj?.HEADER?.Location?.StationNumber;
  let locationName = dataObj?.HEADER?.Location?.Site;
  let locationsPromise = new Promise((resolve, reject) => {
    if (dataObj?.HEADER?.Location?.StationNumber !== undefined
      && dataObj?.HEADER?.Location?.Site !== undefined) {
      locations.getLocationId(
        dataObj.HEADER.Location.StationNumber, dataObj.HEADER.Location.Site
      ).then(function (data) {
        if (!data.rows.length > 0) {
          locations.createLocation(dataObj.HEADER.Location.StationNumber,
            dataObj.HEADER.Location.Site)
            .then(function (data) {
              console.info("Inserted New Site into site dimension ", data);
              resolve(data.rows[0].id);
            });
        } else {
          resolve(data.rows[0].id);
        }
      });
    } else
      resolve(0);
  });

  console.log("Location id", locationId);

  let filePath = dataObj?.path;
  let filesPromise = new Promise((resolve, reject) => {
    if (filePath !== undefined) {
      files.getId(filePath).then(function (data) {
        if (!data.rows.length > 0) {
          files.create(filePath).then(function (data) {
            console.info("Insert new file dimension completed");
            resolve(data.rows[0].id);
          });
        } else
          resolve(data.rows[0].id);
      });
    } else
      resolve(0);
  });


  /**
   * Change dimension, captures type of change
   */

  let changeName = dataObj.SCHEMA["FIELD NAME"];
  let changeDescription = dataObj.SCHEMA["PROTOCOL or OPTION USED"];

  let changePromise = new Promise((resolve, reject) => {
    if (changeName !== undefined && changeDescription !== undefined) {
      change.getId(changeName, changeDescription).then(function (data) {
        if (!data.rows.length > 0) {
          change.create(changeName, changeDescription).then(function (data) {
            console.info("Insert new change dimension row completed");
            resolve(data.rows[0].id);
          }).catch(function (error) {
            console.error("Error inserting change dimension", error);
            reject(error);
          });
        } else
          resolve(data.rows[0].id);
      });
    } else
      resolve(0);
  });

  let userName = dataObj?.HEADER?.User?.UserName;
  let uid = dataObj?.HEADER?.User?.UID;
  let userPromise = new Promise((resolve, reject) => {
    if (dataObj?.HEADER?.User?.UserName !== undefined) {
      user.getId(uid).then(function (data) {
        if (!data.rows.length > 0) {
          let first_name = userName.split(',')[1];
          let last_name = userName.split(',')[0];
          let middle_name = null;
          if(first_name.split(' ').length > 1){
            middle_name = first_name.split(' ')[1];
          }
          user.create(uid, first_name, last_name, middle_name).then(function (data) {
            console.info("Inserting user row into dimension");
            resolve(data.rows[0].id);
          }).catch(function (err) {
            console.error("Error inserting user", err);
            reject(error);
          });
        } else
          resolve(data.rows[0].id);
      });
    } else
      resolve(0);
  });

  let mvi = dataObj?.HEADER?.Patient?.MVI;
  let patientName = dataObj?.HEADER?.Patient?.PatientName.split(',');
  let patientlastName = null;
  let patientFirstName = null;
  let patientMiddleName = null;
  let dob = dataObj?.HEADER?.Patient?.DOB;

  if (dob != null) {
    dob = moment(dob, "YYYYMMDD").format("YYYY-MM-DD");
    console.log("Dob", dob);
  }

  if (patientName.length == 2) {
    patientlastName = patientName[0];
    patientFirstName = patientName[1];
    if (patientFirstName.split(' ').length > 1) {
      patientMiddleName = patientFirstName.split(' ')[1];
    }
  }

  let patientSSN = dataObj?.HEADER?.Patient?.SSN;





  let patientPromise = new Promise((resolve, reject) => {
    if (dataObj?.HEADER?.Patient !== undefined) {
      patient.getId(mvi, patientFirstName, patientlastName, patientSSN).then(function (data) {
        if (!data.rows.length > 0) {
          patient.create(mvi, patientFirstName, patientlastName, patientMiddleName, patientSSN, dob).then(function (data) {
            console.log("Inserting patient row into patient dimension", data);
            resolve(data.rows[0].id);
          });
        } else{
          console.log("Result of patient dimension", data);
          resolve(data.rows[0].id);
        }

      });
    } else
      resolve();
  });

  let date = moment(dataObj.HEADER.DateTime, 'YYYYMMDDhhmmss-Z');
  let dateParameter = date.format('YYYY-MM-DD');
  let timeParameter = date.format('hh:mm');

  let datePromise = new Promise((resolve, reject) => {
    dateDim.getDateId(dateParameter).then((data) => {
      resolve(data.rows[0].id);
    });
  });

  let timePromise = new Promise((resolve, reject) => {
    timeDim.getTimeId(timeParameter).then((data) => {
      resolve(data.rows[0].id);
    });
  });

  Promise.all([locationsPromise, filesPromise, changePromise, userPromise, patientPromise, datePromise, timePromise])
    .then(values => {

        console.log("Insert Message FAct");

        let user_id = values[3];
        let location_id = values[0];
        let change_id = values[2];
        let file_id = values[1];
        let patient_id = values[4];
        let date_id = values[5];
        let time_id = values[6];
        console.log("PatientID ", patient_id, " FileID ", file_id, "Change Id ", change_id, "Location ID", location_id, "User ID", user_id);
        messageFact.insert(
          user_id,
          patient_id,
          change_id,
          location_id,
          file_id,
          date_id,
          time_id).then((data) => {
            console.log("Inserted Fact", data);

          });
    })
    .catch(error => {
      console.log("Something failed");
      console.error(error);
    });

} // end insertInRedshift



// kick things off
runProcess();
