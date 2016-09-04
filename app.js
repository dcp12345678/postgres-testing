'use strict';

const fs = require('fs');
if (fs.existsSync('.env')) {
  console.log('loading .env file');
  require('dotenv').config();
}
const configObj = require('./config/config');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const express = require('express');
const massive = require('massive');
const app = express();
const co = require('co');
const Promise = require('bluebird');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

const baseUrl = 'http://localhost:' + app.get('port');

let db = massive.connectSync({
  connectionString: configObj.DATABASE_CONN_DETAILS,
  scripts: path.join(__dirname, 'db')
});

db = Promise.promisifyAll(db);

/**
 * This method is responsible for writing err/response to response
 *
 * @param   {Object}    err       error from endpoint processing if any
 * @param   {Object}    result    result from endpoint processing if any
 * @param   {Object}    response  http response object
 */
function processResponse(err, result, response) {
  if (!err && result) {
    response.status(httpStatus.OK).json(result).end();
  } else {
    const statusCode = err && err.statusCode ? err.statusCode : 500;
    const message = err && err.message ? err.message : 'Internal error processing the request';
    response.status(statusCode).json({ code: statusCode, message: message }).end();
  }
}

http.createServer(app).listen(app.get('port'), () => {
  console.log('express server started on port : %d', app.get('port'));
  //straight up SQL 
  db.run("select * from person", [], function(err, people) {
    //all people
    console.log('number of records returned from person table = %d', people.length);
  });
});

app.get('/', (req, res) => {
  console.log('inside app.get for default path');
  //res.contentType('text/html');
  //res.send('hey there');

  console.log('calling db.getPeople...');
  db.getPeople(function(err, people) {
    console.log('returned from call to db.getPeople, function was ' + (err ? 'unsuccessful' : 'successful'));
    if (err) {
      res.send('Error getting people: ' + JSON.stringify(err));
    } else {
      console.log('fetch was successful, number person recs returned = ' + people.length);
      res.render('pages/index', { people: people });
    }
  });

});

app.get('/addPerson', (req, res) => {
  co(function*() {
    const depts = yield db.getDepartmentsAsync();
    console.log('depts = ' + JSON.stringify(depts));
    res.render('pages/addPerson', { depts : depts });
  }).catch((err) => {
    console.log('error getting departments, err: ' + JSON.stringify(err));
    console.error(err.stack);
  });
});

app.post('/savePerson', (req, res) => {
  console.log('req.body = %s\n', JSON.stringify(req.body));
  /*  
    async.waterfall([
      (callback) => {      
        serviceHelper.createModel(Person, 'Person', req.body, callback);
      }
      ], (err, result) => {
        utils.processResponse(err, result, res);
      });
  */
});

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'joey' });
})

app.get('/test', (req, res) => {
  res.contentType('text/html');
  res.send('test result');
});

module.exports = app;
