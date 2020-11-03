require("dotenv").config();
const Redshift = require("node-redshift");

const client = {
	user: process.env.RS_USER,
	database: process.env.RS_DATABASE,
	password: process.env.RS_PASSWORD,
	port: process.env.RS_PORT,
	host: process.env.RS_HOST
};

// uses connection pooling by default
module.exports = new Redshift(client);
