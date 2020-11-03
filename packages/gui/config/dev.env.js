'use strict'
require('dotenv').config();
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const MDPORT = process.env.MDPORT && Number(process.env.MDPORT)

// #  VUE_APP_API_BASE: '"http://'+HOST+':'+MDPORT+'/"'
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_API_BASE: '"http://192.168.0.25:8081/"'
})
