//raw connection
const SQL = require('sql-template-strings');
const moment = require('moment');
const redshift = require('./redshift.js');

export async function oldinsert(
    userName,
    mvi,
    patientFirstName,
    patientlastName,
    patientSSN,
    changeName,
    changeDescription,
    stationNumber,
    locationName,
    date,
    filePath
) {
    //console.log("Date", date);
    let dateParameter = date.format('YYYY-MM-DD');
    let timeParameter = date.format('hh:mm');
    let stmt = SQL`
        INSERT INTO vasdw.message_fact 
            (
                user_id,
                patient_id,
                change_id,
                location_id,
                date_id,
                time_id,
                file_id
            )
            SELECT ud.user_id, pd.patient_id, cd.change_id, ld.location_id, dd.date_id, td.time_id, fd.file_id
                FROM vasdw.users_dimension ud, 
                vasdw.patients_dimension pd,
                vasdw.change_dimension cd,
                vasdw.locations_dimension ld,
                vasdw.date_dimension dd,
                vasdw.time_dimension td,
                vasdw.file_dimension fd
                WHERE ud.user_name = ${userName}
                AND pd.mvi=${mvi} AND pd.first_name=${patientFirstName} AND pd.last_name=${patientlastName} AND pd.ssn=${patientSSN}
                AND cd.name=${changeName} AND cd.description=${changeDescription}
                AND ld.station_number=${stationNumber} and ld.name=${locationName}
                AND dd.full_date = ${dateParameter}
                AND td.time_value = ${timeParameter}
                AND fd.path = ${filePath}
    `;

    console.log("SQL", stmt);

    await redshift.query(stmt);
    
}

export function insert(
    user_id,
    patient_id,
    change_id,
    location_id,
    file_id,
    date_id,
    time_id
) {

    let stmt = SQL`
        INSERT INTO vasdw.message_fact 
            (user_id, patient_id, change_id, location_id, date_id, time_id, file_id)
        VALUES 
            (${user_id}, ${patient_id}, ${change_id}, ${location_id}, ${date_id}, ${time_id}, ${file_id})`;

    console.log("SQL", stmt);

    return redshift.query(stmt);
   // return redshift.query("commit");
}