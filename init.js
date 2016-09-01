'use strict';

const fs = require('fs');
if (fs.existsSync('.env')) {
  console.log('loading .env file');
  require('dotenv').config();
}
const configObj = require('./config/config');
const path = require('path');
const massive = require('massive');

console.log('connecting to db...');

const db = massive.connectSync({
  connectionString: configObj.DATABASE_CONN_DETAILS,
  scripts: path.join(__dirname, 'db')
});

console.log('connection completed');

process.exit(0);
