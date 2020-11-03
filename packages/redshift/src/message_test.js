import "core-js/stable";
import "regenerator-runtime/runtime";

const message = require("./message_fact");

message.insert(
    '20', '19', '20', '22', '23', '1', '2' 
  ).then(function (data) {
      console.log("data",data);
      //console.log("data rows", data.rows[0].id);
  });