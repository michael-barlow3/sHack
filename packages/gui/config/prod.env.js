'use strict'

// For Production Version on Local Dev Server
const HOST = "http://192.168.0.25/";
const PORT = process.env.PORT && Number(process.env.PORT);
const MDPORT = "8083";
const DEV_BOX = "http://192.168.0.25:8081/";
const PROD_BOX = "";
// VUE_APP_API_BASE: '"http://192.168.0.25:8081/"' <<--- Local Development
// VUE_APP_API_BASE: '""' <<-- Production AWS Environment

module.exports = {
  NODE_ENV: '"production"',
  VUE_APP_API_BASE: '""'
}
