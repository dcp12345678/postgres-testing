'use strict';

const fp = require('path');
const fs = require('fs');
const async = require('async');
const co = require('co');
const Promise = require('bluebird');

if (fs.existsSync('.env')) {
  console.log('loading .env file');
  require('dotenv').config();
}
const configObj = require('./config/config');
const path = require('path');
const massive = require('massive');

console.log('connecting to db...');

let db = massive.connectSync({
  connectionString: configObj.DATABASE_CONN_DETAILS,
  scripts: path.join(__dirname, 'db')
});

db = Promise.promisifyAll(db);

console.log('connection established');

co(function*() {
  console.log('getting ddl');
  const ddl = fs.readFileSync(fp.resolve(__dirname, 'ddl', 'ddl.sql')).toString();
  //console.log('ddl = ' + ddl);

  console.log('running ddl');
  yield db.runAsync(ddl, []);
  console.log('ddl completed');

  console.log('loading test data');
  yield db.loadTestDataAsync();
  yield db.loadTestData2Async(['Accounting']);
  console.log('test data loaded!');

  console.log('exiting');
  process.exit(0);
}).catch((handleError));

function handleError(err) {
  // log any uncaught errors 
  // co will not throw any errors you do not handle!!! 
  // HANDLE ALL YOUR ERRORS!!! 
  console.error(err.stack);
  process.exit(1);
}
