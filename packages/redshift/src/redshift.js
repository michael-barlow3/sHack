//redshift.js
var Redshift = require('node-redshift');


var client = {
  user: process.env.REDSHIFT_USER,
  database: process.env.REDSHIFT_DB,
  password: process.env.REDSHIFT_PASSWORD,
  port: process.env.REDSHIFT_PORT,
  host: process.env.REDSHIFT_HOST,
};

// console.log("Redshift Client using", client);

// uses connection pooling by default
var redshift = new Redshift(client);

module.exports = redshift;